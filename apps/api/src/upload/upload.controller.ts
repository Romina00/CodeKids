import { Controller, HttpStatus, Post } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';

@Controller('upload')
@ApiStandardErrors(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  upload() {
    return this.uploadService.upload();
  }
}
