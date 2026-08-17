import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ProgressStatus } from '../entities/progress.entity';

export class UpdateProgressDto {
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) levelId!: number;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) activityId!: number;
  @ApiProperty({ enum: ProgressStatus })
  @IsEnum(ProgressStatus)
  status!: ProgressStatus;
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  attemptStarted?: boolean;
  @ApiPropertyOptional({ minimum: 0, maximum: 120, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  timeSpentMinutesDelta?: number;
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  resumeData?: Record<string, unknown> | null;
}
