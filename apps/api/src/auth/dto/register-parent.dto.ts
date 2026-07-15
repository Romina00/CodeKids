import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterParentDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @ApiProperty({ minLength: 8, format: 'password' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/[a-z]/, { message: 'password must include a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'password must include an uppercase letter' })
  @Matches(/\d/, { message: 'password must include a number' })
  password!: string;

  @ApiProperty({ minLength: 8, format: 'password' })
  @IsString()
  confirmPassword!: string;
}
