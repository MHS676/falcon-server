import { IsString, IsEmail, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['admin', 'superadmin'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
