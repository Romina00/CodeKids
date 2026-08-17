import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuizAnswerDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  questionId!: number;

  @ApiProperty({ type: [String], minItems: 1, maxItems: 20 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  selectedAnswers!: string[];
}

export class SubmitQuizDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quizId!: number;

  @ApiProperty({ type: [QuizAnswerDto], minItems: 1, maxItems: 100 })
  @IsArray()
  @ArrayMinSize(1, { message: 'answers must contain at least one answer' })
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];
}
