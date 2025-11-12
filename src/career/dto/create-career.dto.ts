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

export class CreateCareerDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => parseArrayField(value))
  requirements: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  featured?: boolean;
}