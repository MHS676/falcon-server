import { IsString, IsOptional, IsArray, IsBoolean, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  requirements?: string[] | string;

  @IsOptional()
  benefits?: string[] | string;

  @IsOptional()
  skills?: string[] | string;

  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsBoolean()
  urgent?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;
}