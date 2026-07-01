import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from '../dto/create-level.dto';

@Injectable()
export class LevelsService {
  create(dto: CreateLevelDto) {
    return dto;
  }
}
