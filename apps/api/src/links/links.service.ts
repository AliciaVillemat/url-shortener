import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CodeGeneratorService,
  LINK_CODE_LENGTH,
} from './code-generator.service';
import type { CreatedLinkResponse, ExpirationPreset } from './links.types';

const MAX_URL_LENGTH = 2_048;
const MAX_CODE_ATTEMPTS = 5;
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const CODE_PATTERN = new RegExp(`^[0-9A-Za-z]{${LINK_CODE_LENGTH}}$`);
const EXPIRATION_DURATIONS_MS: Record<ExpirationPreset, number> = {
  '1h': 60 * 60 * 1_000,
  '1d': 24 * 60 * 60 * 1_000,
  '7d': 7 * 24 * 60 * 60 * 1_000,
  '30d': 30 * 24 * 60 * 60 * 1_000,
};

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly codeGenerator: CodeGeneratorService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    originalUrl: string,
    expiration?: ExpirationPreset,
  ): Promise<CreatedLinkResponse> {
    this.validateUrl(originalUrl);
    const expiresAt = expiration
      ? new Date(Date.now() + EXPIRATION_DURATIONS_MS[expiration])
      : null;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      const code = this.codeGenerator.generate();

      try {
        const link = await this.prisma.link.create({
          data: { code, originalUrl, expiresAt },
        });

        return {
          code: link.code,
          originalUrl: link.originalUrl,
          shortUrl: `${this.configService.getOrThrow<string>('PUBLIC_BASE_URL')}/${link.code}`,
          createdAt: link.createdAt.toISOString(),
          expiresAt: link.expiresAt?.toISOString() ?? null,
        };
      } catch (error) {
        if (this.isUniqueCodeCollision(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new ServiceUnavailableException({
      code: 'CODE_GENERATION_FAILED',
      message: 'Unable to generate a short link. Please try again.',
    });
  }

  async findOriginalUrl(code: string): Promise<string> {
    if (!CODE_PATTERN.test(code)) {
      throw this.linkNotFound();
    }

    const link = await this.prisma.link.findUnique({ where: { code } });

    if (!link) {
      throw this.linkNotFound();
    }

    if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
      throw this.linkExpired();
    }

    return link.originalUrl;
  }

  private validateUrl(value: string): void {
    if (value.length > MAX_URL_LENGTH) {
      throw new BadRequestException({
        code: 'URL_TOO_LONG',
        message: `URL must not exceed ${MAX_URL_LENGTH} characters.`,
      });
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      throw new BadRequestException({
        code: 'INVALID_URL',
        message: 'Enter a valid URL starting with http:// or https://.',
      });
    }

    if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_PROTOCOL',
        message: 'Only http:// and https:// URLs are allowed.',
      });
    }
  }

  private isUniqueCodeCollision(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }

  private linkNotFound(): NotFoundException {
    return new NotFoundException({
      code: 'LINK_NOT_FOUND',
      message: 'Short link not found.',
    });
  }

  private linkExpired(): GoneException {
    return new GoneException({
      code: 'LINK_EXPIRED',
      message: 'This short link has expired.',
    });
  }
}
