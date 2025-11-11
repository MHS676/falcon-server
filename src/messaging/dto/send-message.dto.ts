import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  guestName?: string;

  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  sessionToken?: string;
}