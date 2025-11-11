import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, AdminReplyDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async createOrGetSession(sessionToken?: string, guestName?: string, guestEmail?: string) {
    if (sessionToken) {
      // Try to find existing session
      let session = await this.prisma.chatSession.findUnique({
        where: { sessionToken }
      });
      
      if (session) {
        // Update last activity
        await this.prisma.chatSession.update({
          where: { id: session.id },
          data: { lastActivity: new Date() }
        });
        return session;
      }
    }

    // Create new session with anonymous user by default
    const newSessionToken = sessionToken || uuidv4();
    return await this.prisma.chatSession.create({
      data: {
        sessionToken: newSessionToken,
        guestName: guestName || 'Anonymous User',
        guestEmail: guestEmail || null,
        lastActivity: new Date()
      }
    });
  }

  async sendGuestMessage(sendMessageDto: SendMessageDto) {
    // Check if session exists before creating
    let isNewSession = false;
    if (!sendMessageDto.sessionToken) {
      isNewSession = true;
    } else {
      const existingSession = await this.prisma.chatSession.findUnique({
        where: { sessionToken: sendMessageDto.sessionToken }
      });
      isNewSession = !existingSession;
    }

    const session = await this.createOrGetSession(
      sendMessageDto.sessionToken,
      sendMessageDto.guestName,
      sendMessageDto.guestEmail
    );

    const message = await this.prisma.message.create({
      data: {
        sessionId: session.id,
        content: sendMessageDto.content,
        senderType: 'guest',
        senderName: session.guestName || 'Anonymous User'
      }
    });

    return {
      message,
      sessionToken: session.sessionToken,
      isFirstMessage: isNewSession || (!session.guestName && sendMessageDto.guestName)
    };
  }

  async sendWelcomeMessage(sessionId: string, guestName: string) {
    const welcomeMessage = await this.prisma.message.create({
      data: {
        sessionId: sessionId,
        content: `Hi ${guestName}! 👋 Welcome to Falcon Security. I'm here to help you with any questions about our cybersecurity services. How can I assist you today?`,
        senderType: 'admin',
        senderName: 'Falcon Security Team'
      }
    });

    return welcomeMessage;
  }

  async sendAdminReply(adminReplyDto: AdminReplyDto) {
    const message = await this.prisma.message.create({
      data: {
        sessionId: adminReplyDto.sessionId,
        content: adminReplyDto.content,
        senderType: 'admin',
        senderName: adminReplyDto.adminName
      }
    });

    return message;
  }

  async getSessionMessages(sessionId: string) {
    return await this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getAllActiveSessions() {
    return await this.prisma.chatSession.findMany({
      where: { isActive: true },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1 // Get latest message
        },
        _count: {
          select: {
            messages: {
              where: {
                senderType: 'guest',
                isRead: false
              }
            }
          }
        }
      },
      orderBy: { lastActivity: 'desc' }
    });
  }

  async markMessagesAsRead(sessionId: string) {
    await this.prisma.message.updateMany({
      where: {
        sessionId,
        senderType: 'guest',
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async closeSession(sessionId: string) {
    return await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { isActive: false }
    });
  }

  async getSessionById(sessionId: string) {
    return await this.prisma.chatSession.findUnique({
      where: { id: sessionId }
    });
  }

  async getSessionByToken(sessionToken: string) {
    return await this.prisma.chatSession.findUnique({
      where: { sessionToken }
    });
  }
}