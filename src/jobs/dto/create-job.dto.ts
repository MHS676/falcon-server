import { IsString, IsOptional, IsArray, IsBoolean, IsDateString } from 'class-validator';
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
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => parseArrayField(value))
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => parseArrayField(value))
  benefits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => parseArrayField(value))
  skills?: string[];

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