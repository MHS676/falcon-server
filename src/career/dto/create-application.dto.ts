import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  careerId: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}