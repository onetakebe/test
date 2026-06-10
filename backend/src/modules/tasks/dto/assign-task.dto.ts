import { IsOptional, IsString } from 'class-validator';

export class AssignTaskDto {
  /** User id to assign the task to. Send null/omit to unassign. */
  @IsOptional()
  @IsString()
  assignedTo?: string | null;
}
