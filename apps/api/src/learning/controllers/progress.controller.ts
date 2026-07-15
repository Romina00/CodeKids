import { Body, Controller, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { ProgressService } from '../services/progress.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('learning/progress')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KID)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch()
  update(@Body() dto: UpdateProgressDto) {
    return this.progressService.update(dto);
  }
}
