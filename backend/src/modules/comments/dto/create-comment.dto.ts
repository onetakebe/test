import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsString()
  @MinLength(1)
  content: string;
}
