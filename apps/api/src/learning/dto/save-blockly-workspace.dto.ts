import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BlocklyBlockDto {
  @ApiProperty({ maxLength: 80 }) @IsString() @MaxLength(80) id!: string;
  @ApiProperty({ maxLength: 80 }) @IsString() @MaxLength(80) type!: string;
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject()
  fields?: Record<string, string>;
}

export class SaveBlocklyWorkspaceDto {
  @ApiProperty({ minimum: 0 }) @IsInt() @Min(0) revision!: number;
  @ApiProperty({ type: [BlocklyBlockDto], maxItems: 200 })
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => BlocklyBlockDto)
  blocks!: BlocklyBlockDto[];
}
