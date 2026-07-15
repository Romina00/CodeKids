import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../users/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 42 })
  id!: number;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiPropertyOptional({ nullable: true, example: 'parent@example.com' })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Parent' })
  displayName!: string | null;
}

export class AuthSessionResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ description: 'Short-lived bearer token' })
  accessToken!: string;

  @ApiProperty({ description: 'Long-lived token used only at /auth/refresh' })
  refreshToken!: string;

  @ApiProperty({ example: 900, description: 'Lifetime in seconds' })
  accessTokenExpiresIn!: number;

  @ApiProperty({ example: 604800, description: 'Lifetime in seconds' })
  refreshTokenExpiresIn!: number;

  @ApiPropertyOptional({ example: '/parent-dashboard' })
  redirectTo?: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
