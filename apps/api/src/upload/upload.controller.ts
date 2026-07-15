import { Controller, HttpStatus, Post } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class UploadResponseDto {
  @ApiProperty({ example: true })
  uploaded!: boolean;
}

@Controller('upload')
@ApiTags('Uploads')
@ApiStandardErrors(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Run the current upload simulation' })
  @ApiCreatedResponse({ type: UploadResponseDto })
  upload() {
    return this.uploadService.upload();
  }
}
