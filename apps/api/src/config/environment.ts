const HTTP_PROTOCOLS = new Set(['http:', 'https:']);

function requireString(config: Record<string, unknown>, key: string): string {
  const value = config[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${key} must be a non-empty string`);
  }

  return value;
}

function requireHttpUrl(config: Record<string, unknown>, key: string): string {
  const value = requireString(config, key);
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL`);
  }

  if (!HTTP_PROTOCOLS.has(url.protocol)) {
    throw new Error(`${key} must use http:// or https://`);
  }

  return value;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const databaseUrl = requireString(config, 'DATABASE_URL');
  const publicBaseUrl = requireHttpUrl(config, 'PUBLIC_BASE_URL');
  const webOrigin = requireHttpUrl(config, 'WEB_ORIGIN');
  const port = Number(config.PORT);

  if (!databaseUrl.startsWith('file:')) {
    throw new Error('DATABASE_URL must use the file: protocol for SQLite');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return {
    ...config,
    DATABASE_URL: databaseUrl,
    PUBLIC_BASE_URL: publicBaseUrl.replace(/\/$/, ''),
    WEB_ORIGIN: webOrigin.replace(/\/$/, ''),
    PORT: port,
  };
}
