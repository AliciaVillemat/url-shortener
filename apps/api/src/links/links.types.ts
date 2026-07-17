export const EXPIRATION_PRESETS = ['1h', '1d', '7d', '30d'] as const;

export type ExpirationPreset = (typeof EXPIRATION_PRESETS)[number];

export interface CreatedLinkResponse {
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string | null;
}
