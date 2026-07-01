import { Body, Controller, Patch } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { ProgressService } from '../services/progress.service';

@Controller('learning/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch()
  update(@Body() dto: UpdateProgressDto) {
    return this.progressService.update(dto);
  }
}
