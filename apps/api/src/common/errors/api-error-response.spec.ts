import {
  BadRequestException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { createApiErrorResponse } from './api-error-response';

describe('createApiErrorResponse', () => {
  const timestamp = '2026-07-15T09:30:00.000Z';

  it('normalizes validation errors', () => {
    const result = createApiErrorResponse(
      new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be valid', 'password is too short'],
      }),
      '/auth/register-parent',
      timestamp,
    );

    expect(result).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Request validation failed.',
      details: ['email must be valid', 'password is too short'],
      path: '/auth/register-parent',
      timestamp,
    });
  });

  it('preserves safe HTTP exception messages', () => {
    expect(
      createApiErrorResponse(
        new ConflictException('Email is already registered.'),
        '/auth/register-parent',
        timestamp,
      ),
    ).toMatchObject({
      statusCode: HttpStatus.CONFLICT,
      message: 'Email is already registered.',
    });
  });

  it('hides unexpected exception details', () => {
    expect(
      createApiErrorResponse(
        new Error('database credentials leaked'),
        '/users',
        timestamp,
      ),
    ).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
      path: '/users',
      timestamp,
    });
  });
});
