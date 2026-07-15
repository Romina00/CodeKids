import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { ProgressService } from '../services/progress.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';

@Controller('learning/progress')
@ApiStandardErrors(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch()
  update(@Body() dto: UpdateProgressDto) {
    return this.progressService.update(dto);
  }
}
