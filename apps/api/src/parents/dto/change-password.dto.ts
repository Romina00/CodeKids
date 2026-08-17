import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ format: 'password' })
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @ApiProperty({ minLength: 8, format: 'password' })
  @IsString()
  @MinLength(8)
  @Matches(/[a-z]/, { message: 'newPassword must include a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'newPassword must include an uppercase letter' })
  @Matches(/\d/, { message: 'newPassword must include a number' })
  newPassword!: string;

  @ApiProperty({ minLength: 8, format: 'password' })
  @IsString()
  confirmPassword!: string;
}
