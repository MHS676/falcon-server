import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  buttonText?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
    if (typeof value === 'number') return value === 1;
    return undefined;
  })
  @IsBoolean()
  active?: boolean;
}
