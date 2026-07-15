import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateLevelDto } from '../dto/create-level.dto';
import { LevelsService } from '../services/levels.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('learning/levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }
}
