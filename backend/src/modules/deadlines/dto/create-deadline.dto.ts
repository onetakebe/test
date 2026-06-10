import { DeadlineStatus, Priority } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDeadlineDto {
  @IsString()
  projectId: string;

  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(DeadlineStatus)
  status?: DeadlineStatus;
}
