import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
