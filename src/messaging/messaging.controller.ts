import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { SendMessageDto, AdminReplyDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('send')
  async sendGuestMessage(@Body() sendMessageDto: SendMessageDto) {
    return await this.messagingService.sendGuestMessage(sendMessageDto);
  }

  @Post('admin/reply')
  @UseGuards(JwtAuthGuard)
  async sendAdminReply(@Body() adminReplyDto: AdminReplyDto) {
    return await this.messagingService.sendAdminReply(adminReplyDto);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getAllActiveSessions() {
    return await this.messagingService.getAllActiveSessions();
  }

  @Get('session/:sessionId/messages')
  async getSessionMessages(@Param('sessionId') sessionId: string) {
    return await this.messagingService.getSessionMessages(sessionId);
  }

  @Get('session/token/:sessionToken')
  async getSessionByToken(@Param('sessionToken') sessionToken: string) {
    const session = await this.messagingService.getSessionByToken(sessionToken);
    if (!session) {
      return { session: null };
    }
    
    const messages = await this.messagingService.getSessionMessages(session.id);
    return {
      session,
      messages
    };
  }

  @Patch('session/:sessionId/read')
  @UseGuards(JwtAuthGuard)
  async markMessagesAsRead(@Param('sessionId') sessionId: string) {
    await this.messagingService.markMessagesAsRead(sessionId);
    return { success: true };
  }

  @Patch('session/:sessionId/close')
  @UseGuards(JwtAuthGuard)
  async closeSession(@Param('sessionId') sessionId: string) {
    return await this.messagingService.closeSession(sessionId);
  }
}