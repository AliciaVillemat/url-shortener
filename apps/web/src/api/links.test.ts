import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CreatedLink, CreateLinkInput } from './links';

const createdLink: CreatedLink = {
  code: 'aB3dE9z',
  originalUrl: 'https://example.com/temporary',
  shortUrl: 'http://localhost:3001/aB3dE9z',
  createdAt: '2026-07-17T08:30:00.000Z',
  expiresAt: '2026-07-24T08:30:00.000Z',
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3001');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('createShortLink', () => {
  it('sends the selected expiration to the API', async () => {
    const { createShortLink } = await import('./links');
    const input: CreateLinkInput = {
      url: createdLink.originalUrl,
      expiration: '7d',
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(createdLink), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(createShortLink(input)).resolves.toEqual(createdLink);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  });

  it('rejects a successful response without expiration information', async () => {
    const { createShortLink } = await import('./links');
    const incompleteResponse = {
      code: createdLink.code,
      originalUrl: createdLink.originalUrl,
      shortUrl: createdLink.shortUrl,
      createdAt: createdLink.createdAt,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(incompleteResponse), {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        }),
      ),
    );

    await expect(
      createShortLink({ url: createdLink.originalUrl }),
    ).rejects.toThrow('The service returned an unexpected response.');
  });
});
