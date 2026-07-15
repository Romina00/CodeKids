import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from './api-error.dto';

export function ApiStandardErrors(...statuses: HttpStatus[]) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: getDescription(status),
        schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      }),
    ),
  );
}

function getDescription(status: HttpStatus): string {
  const descriptions: Partial<Record<HttpStatus, string>> = {
    [HttpStatus.BAD_REQUEST]: 'The request is invalid.',
    [HttpStatus.UNAUTHORIZED]: 'Authentication is required or invalid.',
    [HttpStatus.FORBIDDEN]: 'The authenticated user lacks permission.',
    [HttpStatus.NOT_FOUND]: 'The requested resource was not found.',
    [HttpStatus.CONFLICT]: 'The request conflicts with existing data.',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'An unexpected server error occurred.',
  };
  return descriptions[status] ?? 'The request failed.';
}
