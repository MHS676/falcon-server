import { IsString, IsEmail, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['admin', 'superadmin'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
