import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { QuestionType } from '../entities/question.entity';

export class CreateQuestionDto {
  @ApiProperty() @IsString() prompt!: string;
  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;
  @ApiProperty({ type: [String], minItems: 2, maxItems: 20 })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  options!: string[];
  @ApiProperty({ type: [String], minItems: 1, maxItems: 20 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  correctAnswers!: string[];
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  explanation?: string | null;
  @ApiProperty({ minimum: 0 }) @IsInt() @Min(0) position!: number;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) points!: number;
}
