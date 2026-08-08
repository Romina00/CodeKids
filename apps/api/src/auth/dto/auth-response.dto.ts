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

  @ApiPropertyOptional({ nullable: true, example: 7 })
  parentId!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'parent@example.com' })
  parentEmail!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Mina' })
  nickname!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'robot-blue' })
  avatar!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 2016 })
  birthYear!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'beginner' })
  learningLevel!: string | null;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'date-time' })
  lastKidsModeAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
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

export class ChildInvitationResponseDto {
  @ApiProperty({ example: 12 })
  invitationId!: number;

  @ApiProperty({ example: 'parent@example.com' })
  parentEmail!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty({
    example: {
      subject: 'Your child would like to join CodeKids',
      body: 'A child has requested access using your email address.',
      ctaLabel: 'Create Child Account',
      invitationToken: 'a'.repeat(48),
    },
  })
  emailPreview!: Record<string, string>;
}
