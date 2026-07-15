import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './entities/user.entity';
import { UsersService } from './users.service';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/auth-response.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiStandardErrors(
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all users for administration' })
  @ApiOkResponse({ type: [UserResponseDto] })
  findAll() {
    return this.usersService.listSerializedUsers();
  }
}
