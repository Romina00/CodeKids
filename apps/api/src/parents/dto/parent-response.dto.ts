import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class ParentDashboardResponseDto {
  @ApiProperty({
    example: { id: 7, email: 'parent@example.com', displayName: 'Parent' },
  })
  parent!: Record<string, unknown>;

  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 20,
        nickname: 'Mina',
        completedLevels: 2,
        earnedRewards: 4,
        timeSpentMinutes: 85,
      },
    ],
  })
  children!: Array<Record<string, unknown>>;

  @ApiProperty({
    example: {
      children: 1,
      completedLevels: 2,
      rewards: 4,
      timeSpentMinutes: 85,
    },
  })
  totals!: Record<string, number>;
}

export class KidsModeResponseDto {
  @ApiProperty({ example: { id: 20, nickname: 'Mina', avatar: 'robot-blue' } })
  child!: Record<string, unknown>;

  @ApiProperty({
    example: { visible: ['Learning Levels'], hidden: ['Parent Settings'] },
  })
  kidsMode!: { visible: string[]; hidden: string[] };

  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: '/kids-panel/20' })
  redirectTo!: string;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;
}

export class ChildProfileResponseDto extends UserResponseDto {}
