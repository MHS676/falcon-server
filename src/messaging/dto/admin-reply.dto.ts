import { IsString, IsNotEmpty } from 'class-validator';

export class AdminReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  adminName: string;
}