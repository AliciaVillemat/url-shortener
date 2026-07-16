export interface CreatedLink {
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

const API_BASE_URL = getApiBaseUrl();

function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL;

  if (!value) {
    throw new Error('VITE_API_BASE_URL is required');
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('VITE_API_BASE_URL must use http:// or https://');
  }

  return value.replace(/\/$/, '');
}

export async function createShortLink(url: string): Promise<CreatedLink> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error(
      'The service is unavailable. Check that the API is running and try again.',
    );
  }

  const body = await readJson(response);

  if (!response.ok) {
    throw new Error(
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : 'The link could not be created. Please try again.',
    );
  }

  if (!isCreatedLink(body)) {
    throw new Error('The service returned an unexpected response.');
  }

  return body;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCreatedLink(value: unknown): value is CreatedLink {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.originalUrl === 'string' &&
    typeof value.shortUrl === 'string' &&
    typeof value.createdAt === 'string'
  );
}
