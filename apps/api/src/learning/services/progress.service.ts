import { Injectable } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';

@Injectable()
export class ProgressService {
  update(dto: UpdateProgressDto) {
    return dto;
  }
}
