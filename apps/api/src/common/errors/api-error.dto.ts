import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({ example: 'Request validation failed.' })
  message!: string;

  @ApiPropertyOptional({ type: [String] })
  details?: string[];

  @ApiProperty({ example: '/auth/register-parent' })
  path!: string;

  @ApiProperty({ example: '2026-07-15T09:30:00.000Z' })
  timestamp!: string;
}
