import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { SendMessageDto, AdminReplyDto } from './dto';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://falcon-frontend-six.vercel.app',
      /^https:\/\/falcon-frontend.*\.vercel\.app$/
    ],
    credentials: true,
  },
  namespace: '/chat'
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  constructor(private messagingService: MessagingService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // Store user connection
    const userType = client.handshake.query.userType as string;
    const sessionToken = client.handshake.query.sessionToken as string;
    
    if (userType === 'admin') {
      client.join('admin_room');
    } else if (sessionToken) {
      client.join(`session_${sessionToken}`);
    }
    
    this.connectedUsers.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('guest_message')
  async handleGuestMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.messagingService.sendGuestMessage(data);
      
      // Join the session room if not already joined
      client.join(`session_${result.sessionToken}`);
      
      // Emit to the specific session
      this.server.to(`session_${result.sessionToken}`).emit('new_message', {
        ...result.message,
        sessionToken: result.sessionToken
      });
      
      // Notify admins about new message
      this.server.to('admin_room').emit('new_guest_message', {
        ...result.message,
        sessionToken: result.sessionToken,
        sessionId: result.message.sessionId
      });
      
      return {
        success: true,
        sessionToken: result.sessionToken,
        message: result.message
      };
    } catch (error) {
      console.error('Error handling guest message:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('admin_reply')
  async handleAdminReply(
    @MessageBody() data: AdminReplyDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.messagingService.sendAdminReply(data);
      
      // Get session to find sessionToken
      const session = await this.messagingService.getSessionById(data.sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }
      
      // Emit to the specific session
      this.server.to(`session_${session.sessionToken}`).emit('new_message', message);
      
      // Emit to admin room to update their interface
      this.server.to('admin_room').emit('admin_message_sent', {
        ...message,
        sessionId: data.sessionId
      });
      
      return { success: true, message };
    } catch (error) {
      console.error('Error handling admin reply:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @MessageBody() data: { sessionToken: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`session_${data.sessionToken}`);
    
    // Get existing messages for this session
    const session = await this.messagingService.getSessionByToken(data.sessionToken);
    if (session) {
      const messages = await this.messagingService.getSessionMessages(session.id);
      client.emit('session_messages', messages);
    }
    
    return { success: true };
  }

  @SubscribeMessage('admin_join')
  async handleAdminJoin(
    @ConnectedSocket() client: Socket,
  ) {
    client.join('admin_room');
    
    // Get all active sessions for admin
    const sessions = await this.messagingService.getAllActiveSessions();
    client.emit('active_sessions', sessions);
    
    return { success: true };
  }

  @SubscribeMessage('mark_read')
  async handleMarkAsRead(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.messagingService.markMessagesAsRead(data.sessionId);
      
      // Notify admin room about read status update
      this.server.to('admin_room').emit('messages_marked_read', {
        sessionId: data.sessionId
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}