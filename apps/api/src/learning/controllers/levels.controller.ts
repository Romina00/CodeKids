import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateLevelDto } from '../dto/create-level.dto';
import { LevelsService } from '../services/levels.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';

@Controller('learning/levels')
@ApiStandardErrors(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }
}
