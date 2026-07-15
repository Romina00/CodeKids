import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ParentsService } from './parents.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { UpdateParentProfileDto } from './dto/update-parent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';

@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.CONFLICT,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.parentsService.getDashboard(user.sub);
  }

  @Get('children')
  listChildren(@CurrentUser() user: AuthenticatedUser) {
    return this.parentsService.listChildren(user.sub);
  }

  @Post('children')
  createChild(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateChildDto,
  ) {
    return this.parentsService.createChild(user.sub, body);
  }

  @Patch('children/:childId')
  updateChild(
    @CurrentUser() user: AuthenticatedUser,
    @Param('childId', ParseIntPipe) childId: number,
    @Body() body: UpdateChildDto,
  ) {
    return this.parentsService.updateChild(user.sub, childId, body);
  }

  @Post('children/:childId/kids-mode')
  openKidsMode(
    @CurrentUser() user: AuthenticatedUser,
    @Param('childId', ParseIntPipe) childId: number,
  ) {
    return this.parentsService.openKidsMode(user.sub, childId);
  }

  @Patch('account/profile')
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateParentProfileDto,
  ) {
    return this.parentsService.updateParentProfile(user.sub, body);
  }

  @Patch('account/password')
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: ChangePasswordDto,
  ) {
    return this.parentsService.changePassword(user.sub, body);
  }
}
