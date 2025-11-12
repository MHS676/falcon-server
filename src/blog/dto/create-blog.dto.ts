import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    
    if (Array.isArray(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // JSON parsing failed, try comma-split
      }
      
      return value
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }
    
    return [];
  })
  tags?: string[];
}
