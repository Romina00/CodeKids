import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateChildDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ minLength: 1, maxLength: 255 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  avatar?: string;

  @ApiPropertyOptional({ minimum: 1900, maximum: new Date().getFullYear() })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  learningLevel?: string;
}
