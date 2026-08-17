import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChildDto {
  @ApiProperty({ minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1, { message: 'nickname is required' })
  @MaxLength(50)
  nickname!: string;

  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MinLength(1, { message: 'avatar is required' })
  @MaxLength(255)
  avatar!: string;

  @ApiProperty({ minimum: 1900, maximum: new Date().getFullYear() })
  @IsInt({ message: 'birthYear must be an integer' })
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear!: number;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  learningLevel?: string;

  @ApiPropertyOptional({ minLength: 48, maxLength: 48 })
  @IsOptional()
  @IsString()
  @Length(48, 48)
  @Matches(/^[a-f0-9]+$/, { message: 'invitationToken must be hexadecimal' })
  invitationToken?: string;
}
