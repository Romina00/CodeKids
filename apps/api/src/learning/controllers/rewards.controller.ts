import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('learning/rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KID)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }
}
