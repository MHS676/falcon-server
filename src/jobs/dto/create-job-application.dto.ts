import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  jobId: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsString()
  linkedIn?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsArray()
  portfolio_files?: string[];
}