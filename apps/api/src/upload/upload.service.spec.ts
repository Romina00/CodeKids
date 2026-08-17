import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { MAX_AVATAR_BYTES, UploadService } from './upload.service';

describe('UploadService avatar storage', () => {
  let directory: string;
  let service: UploadService;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'codekids-avatar-test-'));
    process.env.AVATAR_UPLOAD_DIR = directory;
    service = new UploadService();
  });

  afterEach(async () => {
    delete process.env.AVATAR_UPLOAD_DIR;
    await rm(directory, { recursive: true, force: true });
  });

  it('stores a valid image under an opaque owner-scoped safe name', async () => {
    const buffer = Buffer.from('valid-image-bytes');
    const result = await service.saveAvatar(7, {
      buffer,
      mimetype: 'image/png',
      originalname: '../../unsafe-name.exe',
      size: buffer.length,
    });

    expect(result.fileName).toMatch(
      /^u7-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.png$/,
    );
    await expect(readFile(join(directory, result.fileName))).resolves.toEqual(
      buffer,
    );
    expect(result.fileName).not.toContain('unsafe-name');
  });

  it.each([
    ['image/gif', 10, Buffer.alloc(10)],
    ['image/png', MAX_AVATAR_BYTES + 1, Buffer.alloc(1)],
    ['image/png', 10, Buffer.alloc(5)],
  ])(
    'rejects invalid MIME, size, or payload metadata',
    async (mimetype, size, buffer) => {
      await expect(
        service.saveAvatar(7, {
          buffer,
          mimetype,
          originalname: 'avatar',
          size,
        }),
      ).rejects.toThrow(BadRequestException);
    },
  );

  it('deletes only an avatar owned by the requesting parent', async () => {
    const buffer = Buffer.from('avatar');
    const stored = await service.saveAvatar(7, {
      buffer,
      mimetype: 'image/webp',
      originalname: 'avatar.webp',
      size: buffer.length,
    });

    await expect(service.deleteAvatar(8, stored.fileName)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(service.deleteAvatar(7, stored.fileName)).resolves.toEqual({
      deleted: true,
    });
    await expect(service.deleteAvatar(7, stored.fileName)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('provides stable built-in default avatars', () => {
    expect(service.getDefaultAvatars()).toEqual([
      { id: 'robot-blue', url: '/assets/avatars/robot-blue.svg' },
      { id: 'robot-green', url: '/assets/avatars/robot-green.svg' },
      { id: 'robot-orange', url: '/assets/avatars/robot-orange.svg' },
    ]);
  });
});
