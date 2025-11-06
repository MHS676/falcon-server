import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(0)
  @Max(100)
  level: number;

  @IsOptional()
  @IsString()
  icon?: string;
}
