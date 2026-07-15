import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminOverviewResponseDto } from './admin-response.dto';

@Controller('admin')
@ApiTags('Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiStandardErrors(
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get the administrator platform overview' })
  @ApiOkResponse({ type: AdminOverviewResponseDto })
  findAll() {
    return this.adminService.getOverview();
  }
}
