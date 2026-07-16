import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { validationExceptionFactory } from './common/validation/validation-exception.factory';

interface ConfigureApplicationOptions {
  enableShutdownHooks?: boolean;
}

export function configureApplication(
  app: INestApplication,
  options: ConfigureApplicationOptions = {},
): void {
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow<string>('WEB_ORIGIN'),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  if (options.enableShutdownHooks !== false) {
    app.enableShutdownHooks();
  }

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
}
