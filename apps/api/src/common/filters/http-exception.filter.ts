import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import type { ApiErrorResponse } from '../errors/api-error';

interface HttpResponse {
  json(body: ApiErrorResponse): void;
  status(statusCode: number): HttpResponse;
}

const DEFAULT_ERRORS: Record<number, Omit<ApiErrorResponse, 'statusCode'>> = {
  [HttpStatus.BAD_REQUEST]: {
    code: 'BAD_REQUEST',
    message: 'The request is invalid.',
  },
  [HttpStatus.NOT_FOUND]: {
    code: 'NOT_FOUND',
    message: 'The requested resource was not found.',
  },
  [HttpStatus.SERVICE_UNAVAILABLE]: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'The service is temporarily unavailable.',
  },
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = this.getKnownPayload(exception);
      const fallback = DEFAULT_ERRORS[statusCode] ?? {
        code: 'HTTP_ERROR',
        message: 'The request could not be completed.',
      };

      response.status(statusCode).json({
        statusCode,
        code: payload?.code ?? fallback.code,
        message: payload?.message ?? fallback.message,
      });
      return;
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    });
  }

  private getKnownPayload(
    exception: HttpException,
  ): { code: string; message: string } | undefined {
    const response = exception.getResponse();

    if (typeof response !== 'object' || response === null) {
      return undefined;
    }

    const payload = response as Record<string, unknown>;

    if (
      typeof payload.code !== 'string' ||
      typeof payload.message !== 'string'
    ) {
      return undefined;
    }

    return { code: payload.code, message: payload.message };
  }
}
