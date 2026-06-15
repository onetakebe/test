import { IsString } from 'class-validator';

export class ProjectSummaryDto {
  @IsString()
  projectId: string;
}
