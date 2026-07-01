import { Body, Controller, Post } from '@nestjs/common';
import { CreateLevelDto } from '../dto/create-level.dto';
import { LevelsService } from '../services/levels.service';

@Controller('learning/levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }
}
