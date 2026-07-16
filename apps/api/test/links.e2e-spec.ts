import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/app.setup';
import { CodeGeneratorService } from '../src/links/code-generator.service';
import { PrismaService } from '../src/prisma/prisma.service';

interface CreatedLinkBody {
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string;
}

describe('URL shortener API', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;
  let codeGenerator: CodeGeneratorService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    configureApplication(app, { enableShutdownHooks: false });
    await app.init();

    server = app.getHttpServer();
    prisma = app.get(PrismaService);
    codeGenerator = app.get(CodeGeneratorService);
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    await prisma.link.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates and persists an HTTPS link with a Base62 code', async () => {
    const originalUrl = 'https://www.example.com/some/long/path';

    const response = await request(server)
      .post('/api/links')
      .send({ url: originalUrl })
      .expect(201);
    const body = response.body as unknown as CreatedLinkBody;

    expect(body.code).toMatch(/^[0-9A-Za-z]{7}$/);
    expect(body.originalUrl).toBe(originalUrl);
    expect(body.shortUrl).toBe(`http://localhost:3001/${body.code}`);
    expect(typeof body.createdAt).toBe('string');
    expect(new Date(body.createdAt).toISOString()).toBe(body.createdAt);

    await expect(
      prisma.link.findUnique({ where: { code: body.code } }),
    ).resolves.toMatchObject({
      code: body.code,
      originalUrl,
    });
  });

  it('creates an HTTP link', async () => {
    const originalUrl = 'http://example.org/resource';

    const response = await request(server)
      .post('/api/links')
      .send({ url: originalUrl })
      .expect(201);
    const body = response.body as unknown as CreatedLinkBody;

    expect(body.originalUrl).toBe(originalUrl);
  });

  it('creates different codes for repeated URLs', async () => {
    const payload = { url: 'https://example.com/repeated' };

    const first = await request(server)
      .post('/api/links')
      .send(payload)
      .expect(201);
    const second = await request(server)
      .post('/api/links')
      .send(payload)
      .expect(201);
    const firstBody = first.body as unknown as CreatedLinkBody;
    const secondBody = second.body as unknown as CreatedLinkBody;

    expect(secondBody.code).not.toBe(firstBody.code);
    await expect(prisma.link.count()).resolves.toBe(2);
  });

  it.each([
    [{}, 'URL_REQUIRED'],
    [{ url: 'not-a-url' }, 'INVALID_URL'],
    [{ url: 'javascript:alert(1)' }, 'UNSUPPORTED_PROTOCOL'],
    [{ url: 'data:text/plain,hello' }, 'UNSUPPORTED_PROTOCOL'],
    [{ url: 'file:///tmp/example' }, 'UNSUPPORTED_PROTOCOL'],
  ])('rejects invalid payload %#', async (payload, expectedCode) => {
    const response = await request(server)
      .post('/api/links')
      .send(payload)
      .expect(400);
    const body = response.body as unknown as ErrorBody;

    expect(body.code).toBe(expectedCode);
    await expect(prisma.link.count()).resolves.toBe(0);
  });

  it('rejects an URL longer than 2048 characters', async () => {
    const response = await request(server)
      .post('/api/links')
      .send({ url: `https://example.com/${'a'.repeat(2050)}` })
      .expect(400);
    const body = response.body as unknown as ErrorBody;

    expect(body.code).toBe('URL_TOO_LONG');
  });

  it('redirects to the persisted destination with HTTP 302', async () => {
    await prisma.link.create({
      data: {
        code: 'Ab3xYz7',
        originalUrl: 'https://example.com/destination',
      },
    });

    await request(server)
      .get('/Ab3xYz7')
      .redirects(0)
      .expect(302)
      .expect('Location', 'https://example.com/destination');
  });

  it('returns a clean 404 for an unknown code', async () => {
    const response = await request(server).get('/Missing').expect(404);
    const body = response.body as unknown as ErrorBody;

    expect(body).toEqual({
      statusCode: 404,
      code: 'LINK_NOT_FOUND',
      message: 'Short link not found.',
    });
  });

  it('retries after a database uniqueness collision', async () => {
    await prisma.link.create({
      data: {
        code: 'COLLIDE',
        originalUrl: 'https://example.com/existing',
      },
    });
    const generateSpy = jest
      .spyOn(codeGenerator, 'generate')
      .mockReturnValueOnce('COLLIDE')
      .mockReturnValueOnce('FRESH01');

    const response = await request(server)
      .post('/api/links')
      .send({ url: 'https://example.com/new' })
      .expect(201);
    const body = response.body as unknown as CreatedLinkBody;

    expect(body.code).toBe('FRESH01');
    expect(body.originalUrl).toBe('https://example.com/new');
    expect(generateSpy).toHaveBeenCalledTimes(2);
    await expect(prisma.link.count()).resolves.toBe(2);
  });
});
