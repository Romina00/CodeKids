import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/auth-response.dto';

export class AdminOverviewResponseDto {
  @ApiProperty({ example: { users: 8, parents: 3, children: 4, admins: 1 } })
  totals!: Record<string, number>;

  @ApiProperty({ type: [UserResponseDto] })
  parents!: UserResponseDto[];

  @ApiProperty({ type: [UserResponseDto] })
  children!: UserResponseDto[];

  @ApiProperty({ type: [UserResponseDto] })
  admins!: UserResponseDto[];

  @ApiProperty({ type: [String], example: ['User Management', 'Statistics'] })
  permissions!: string[];
}
