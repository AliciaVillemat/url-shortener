export const MAX_URL_LENGTH = 2_048;

export function validateUrl(value: string): string | null {
  if (value.trim() === '') {
    return 'Enter a URL to shorten.';
  }

  if (value.length > MAX_URL_LENGTH) {
    return `URL must not exceed ${MAX_URL_LENGTH} characters.`;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return 'Enter a valid URL starting with http:// or https://.';
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'Only http:// and https:// URLs are allowed.';
  }

  return null;
}
