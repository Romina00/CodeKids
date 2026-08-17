import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import { Role } from '../users/entities/user.entity';
import { MAX_AVATAR_BYTES, UploadService } from './upload.service';

class AvatarUploadResponseDto {
  @ApiProperty({ example: 'u7-550e8400-e29b-41d4-a716-446655440000.png' })
  fileName!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ example: 82431 })
  size!: number;

  @ApiProperty({ example: 'image/png' })
  mimeType!: string;
}

@Controller('upload/avatars')
@ApiTags('Uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('defaults')
  @ApiOperation({ summary: 'List built-in avatar choices' })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, url: { type: 'string' } },
      },
    },
  })
  defaults() {
    return this.uploadService.getDefaultAvatars();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_AVATAR_BYTES, files: 1 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a parent-owned child avatar' })
  @ApiCreatedResponse({ type: AvatarUploadResponseDto })
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.uploadService.saveAvatar(user.sub, file);
  }

  @Delete(':fileName')
  @ApiOperation({ summary: 'Delete an avatar owned by the parent account' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('fileName') fileName: string,
  ) {
    return this.uploadService.deleteAvatar(user.sub, fileName);
  }
}
