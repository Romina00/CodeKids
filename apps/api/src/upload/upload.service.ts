import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  upload() {
    return { uploaded: true };
  }
}
