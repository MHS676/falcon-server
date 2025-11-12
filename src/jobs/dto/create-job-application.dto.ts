import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

const parseArrayField = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Ignore JSON parse errors
    }
    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }
  return [];
};

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
  @Transform(({ value }) => parseArrayField(value))
  portfolio_files?: string[];
}