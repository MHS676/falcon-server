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
        content: `Hi ${guestName}! 👋 Welcome to Falcon® Security Limited!\n\nOur team will respond to your inquiry shortly. How can we assist you with your security needs today?\n\n📞 For immediate / emergency assistance:\n• Head Office (Dhaka): +880 1618-325266\n• Chittagong: +880 1913-052845\n• Khulna: +880 1711-480287\n\n✉️ Email: info@falconslimited.com`,
        senderType: 'admin',
        senderName: 'Support'
      }
    });

    return welcomeMessage;
  }

  async sendAutoReply(sessionId: string) {
    return await this.prisma.message.create({
      data: {
        sessionId,
        content:
          `Thank you for reaching out to Falcon® Security Limited! 🛡️\n\nOur team has received your message and will respond shortly.\n\n📞 For immediate assistance or emergencies, please call us:\n• Head Office (Dhaka): +880 1618-325266\n• Chittagong: +880 1913-052845\n• Khulna: +880 1711-480287\n\n✉️ Email: info@falconslimited.com\n\n— Falcon® Support Team`,
        senderType: 'admin',
        senderName: 'Support'
      }
    });
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

  async getUnreadMessagesCount() {
    const result = await this.prisma.message.aggregate({
      where: {
        senderType: 'guest',
        isRead: false
      },
      _count: {
        id: true
      }
    });
    
    return result._count.id;
  }

  async getUnreadSessionsCount() {
    const sessions = await this.prisma.chatSession.findMany({
      where: { 
        isActive: true,
        messages: {
          some: {
            senderType: 'guest',
            isRead: false
          }
        }
      },
      select: { id: true }
    });
    
    return sessions.length;
  }
}