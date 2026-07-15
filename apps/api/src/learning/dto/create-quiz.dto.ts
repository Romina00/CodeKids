import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) levelId!: number;
  @ApiProperty({ maxLength: 120 })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;
  @ApiProperty({ minimum: 0, maximum: 100, default: 70 })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore!: number;
  @ApiPropertyOptional({ nullable: true, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number | null;
  @ApiProperty({ default: false }) @IsBoolean() published!: boolean;
}
