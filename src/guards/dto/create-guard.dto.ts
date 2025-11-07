import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateGuardDto {
  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(['active', 'inactive', 'on-duty'])
  status: 'active' | 'inactive' | 'on-duty';

  @IsDateString()
  hireDate: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  image?: string;
}