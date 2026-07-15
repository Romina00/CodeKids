import { Controller, Get, HttpStatus } from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';

@Controller('learning/rewards')
@ApiStandardErrors(HttpStatus.INTERNAL_SERVER_ERROR)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }
}
