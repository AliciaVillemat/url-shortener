import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const urlError = errors.find((error) => error.property === 'url');

  if (
    urlError &&
    (urlError.value === undefined ||
      urlError.value === null ||
      urlError.constraints?.isNotEmpty)
  ) {
    return new BadRequestException({
      code: 'URL_REQUIRED',
      message: 'URL is required.',
    });
  }

  if (urlError?.constraints?.isString) {
    return new BadRequestException({
      code: 'INVALID_URL',
      message: 'URL must be a string.',
    });
  }

  return new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'The request body contains unsupported properties.',
  });
}
