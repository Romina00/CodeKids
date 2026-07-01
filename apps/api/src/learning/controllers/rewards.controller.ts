import { Controller, Get } from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';

@Controller('learning/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }
}
