import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  platform: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
