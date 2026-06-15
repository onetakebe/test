import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class UploadFileDto {
  @IsString()
  projectId: string;

  @IsString()
  @MinLength(1)
  fileName: string;

  @IsUrl({ require_tld: false })
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;
}
