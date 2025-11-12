import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    
    // If already an array, return as is
    if (Array.isArray(value)) {
      return value;
    }
    
    // If it's a string, try to parse as JSON first
    if (typeof value === 'string') {
      // Try JSON parsing first
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // JSON parsing failed, try comma-split
      }
      
      // Fallback to comma-split
      return value
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }
    
    return [];
  })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}