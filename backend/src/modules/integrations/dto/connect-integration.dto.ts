import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ConnectIntegrationDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
