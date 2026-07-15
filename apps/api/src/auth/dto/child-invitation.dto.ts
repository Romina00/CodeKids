import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChildInvitationDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail({}, { message: 'parentEmail must be a valid email address' })
  parentEmail!: string;
}
