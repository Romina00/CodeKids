import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
export class CreateLandingContentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(120)
  key!: string;
  @ApiProperty() @IsString() @MaxLength(120) title!: string;
  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  content!: Record<string, unknown>;
  @ApiProperty({ minimum: 0 }) @IsInt() @Min(0) position!: number;
  @ApiProperty() @IsBoolean() published!: boolean;
}
export class UpdateLandingContentDto extends PartialType(
  CreateLandingContentDto,
) {
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) expectedVersion!: number;
}
