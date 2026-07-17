import { describe, expect, it } from 'vitest';

import { MAX_URL_LENGTH, validateUrl } from './validate-url';

describe('validateUrl', () => {
  it.each(['', '   '])('rejects an empty value', (value) => {
    expect(validateUrl(value)).toBe('Enter a URL to shorten.');
  });

  it('rejects a malformed URL', () => {
    expect(validateUrl('example.com/page')).toBe(
      'Enter a valid URL starting with http:// or https://.',
    );
  });

  it('rejects unsupported protocols', () => {
    expect(validateUrl('ftp://example.com/file')).toBe(
      'Only http:// and https:// URLs are allowed.',
    );
  });

  it('rejects values over the maximum length', () => {
    expect(
      validateUrl(`https://example.com/${'a'.repeat(MAX_URL_LENGTH)}`),
    ).toBe(`URL must not exceed ${MAX_URL_LENGTH} characters.`);
  });

  it.each(['http://example.com', 'https://example.com/path?value=1'])(
    'accepts a supported URL: %s',
    (value) => {
      expect(validateUrl(value)).toBeNull();
    },
  );
});
