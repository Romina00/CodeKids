import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  @ApiProperty({ minLength: 1, maxLength: 120 })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type!: ActivityType;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown> | null;

  @ApiProperty({ minimum: 0, default: 0 })
  @IsInt()
  @Min(0)
  position!: number;

  @ApiProperty({ minimum: 0, default: 0 })
  @IsInt()
  @Min(0)
  estimatedMinutes!: number;
}
