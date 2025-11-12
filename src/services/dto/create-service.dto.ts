import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';
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

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => parseArrayField(value))
  features: string[];

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}