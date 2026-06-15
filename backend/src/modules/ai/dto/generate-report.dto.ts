import { IsIn, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsOptional()
  @IsIn(['weekly', 'monthly'])
  period?: 'weekly' | 'monthly';

  @IsOptional()
  @IsString()
  focus?: string;
}
