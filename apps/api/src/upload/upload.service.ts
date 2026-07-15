import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export interface AvatarFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly avatarDirectory: string;

  constructor() {
    this.avatarDirectory = resolve(
      process.env.AVATAR_UPLOAD_DIR ??
        join(process.cwd(), 'storage', 'avatars'),
    );
  }

  getDefaultAvatars() {
    return [
      { id: 'robot-blue', url: '/assets/avatars/robot-blue.svg' },
      { id: 'robot-green', url: '/assets/avatars/robot-green.svg' },
      { id: 'robot-orange', url: '/assets/avatars/robot-orange.svg' },
    ];
  }

  async saveAvatar(ownerId: number, file?: AvatarFile) {
    if (!file) {
      throw new BadRequestException('An avatar file is required.');
    }
    const extension = EXTENSIONS[file.mimetype];
    if (!extension) {
      throw new BadRequestException(
        'Avatar must be a JPEG, PNG, or WebP image.',
      );
    }
    if (file.size <= 0 || file.size > MAX_AVATAR_BYTES) {
      throw new BadRequestException('Avatar must be between 1 byte and 2 MB.');
    }
    if (file.buffer.length !== file.size) {
      throw new BadRequestException('Avatar payload size is invalid.');
    }

    const fileName = `u${ownerId}-${randomUUID()}${extension}`;
    await mkdir(this.avatarDirectory, { recursive: true });
    await writeFile(join(this.avatarDirectory, fileName), file.buffer, {
      flag: 'wx',
    });
    return {
      fileName,
      url: `/uploads/avatars/${fileName}`,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteAvatar(ownerId: number, fileName: string) {
    if (
      basename(fileName) !== fileName ||
      !fileName.startsWith(`u${ownerId}-`)
    ) {
      throw new ForbiddenException('Avatar does not belong to this account.');
    }
    try {
      await unlink(join(this.avatarDirectory, fileName));
    } catch (error) {
      if (isMissingFile(error)) {
        throw new NotFoundException('Avatar file was not found.');
      }
      throw error;
    }
    return { deleted: true };
  }
}

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as NodeJS.ErrnoException).code === 'ENOENT'
  );
}
