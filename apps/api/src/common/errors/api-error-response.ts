import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorResponseDto } from './api-error.dto';

export function createApiErrorResponse(
  exception: unknown,
  path: string,
  timestamp = new Date().toISOString(),
): ApiErrorResponseDto {
  if (!(exception instanceof HttpException)) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
      path,
      timestamp,
    };
  }

  const statusCode = exception.getStatus();
  const response: unknown = exception.getResponse();
  const defaultError = getHttpStatusLabel(statusCode);

  if (typeof response === 'string') {
    return {
      statusCode,
      error: defaultError,
      message: response,
      path,
      timestamp,
    };
  }

  if (isRecord(response)) {
    const responseMessage = response.message;
    const details = Array.isArray(responseMessage)
      ? responseMessage.filter(isString)
      : undefined;
    const message =
      typeof responseMessage === 'string'
        ? responseMessage
        : details?.length
          ? 'Request validation failed.'
          : exception.message;

    return {
      statusCode,
      error: typeof response.error === 'string' ? response.error : defaultError,
      message,
      ...(details?.length ? { details } : {}),
      path,
      timestamp,
    };
  }

  return {
    statusCode,
    error: defaultError,
    message: exception.message,
    path,
    timestamp,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function getHttpStatusLabel(statusCode: number): string {
  const label: unknown = HttpStatus[statusCode];
  return typeof label === 'string'
    ? label
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Error';
}
