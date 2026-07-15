import { Body, Controller, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { ProgressService } from '../services/progress.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('learning/progress')
@ApiTags('Learning - Progress')
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
  @ApiOperation({ summary: 'Update progress for the authenticated child' })
  @ApiOkResponse({ type: UpdateProgressDto })
  update(@Body() dto: UpdateProgressDto) {
    return this.progressService.update(dto);
  }
}
