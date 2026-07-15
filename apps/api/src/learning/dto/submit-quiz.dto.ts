import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({ type: [String], minItems: 1, maxItems: 100 })
  @IsArray()
  @ArrayMinSize(1, { message: 'answers must contain at least one answer' })
  @ArrayMaxSize(100)
  @IsString({ each: true })
  answers!: string[];
}
