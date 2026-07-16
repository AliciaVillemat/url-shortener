import { FormEvent, useRef, useState } from 'react';

import { createShortLink, type CreatedLink } from './api/links';
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  LinkIcon,
} from './components/icons';
import { validateUrl } from './lib/validate-url';

type CopyState = 'idle' | 'copied' | 'failed';

export default function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreatedLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copyResetTimer = useRef<number | undefined>(undefined);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateUrl(url);

    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setCopyState('idle');

    try {
      const createdLink = await createShortLink(url);
      setResult(createdLink);
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The link could not be created. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    window.clearTimeout(copyResetTimer.current);

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }

    copyResetTimer.current = window.setTimeout(() => {
      setCopyState('idle');
    }, 2_500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_50%_-20%,rgba(91,91,214,0.16),transparent_62%)]"
      />

      <header className="relative border-b border-line/80 bg-white/55 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8">
          <a
            aria-label="URL Shortener home"
            className="inline-flex items-center gap-3 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-3"
            href="/"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <LinkIcon className="size-[18px]" />
            </span>
            URL Shortener
          </a>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Shorten a link
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Paste an HTTP or HTTPS URL and get a shorter link ready to share.
          </p>
        </div>

        <section aria-labelledby="shortener-title" className="mt-8">
          <h2 className="sr-only" id="shortener-title">
            Shorten a URL
          </h2>

          <form
            className="rounded-2xl border border-line bg-white/95 p-5 shadow-card sm:p-7"
            noValidate
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <label className="block text-sm font-medium" htmlFor="url">
              URL
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                aria-describedby={error ? 'url-error' : 'url-hint'}
                aria-invalid={Boolean(error)}
                autoComplete="url"
                className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-base outline-none transition placeholder:text-muted/55 hover:border-line-strong focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                id="url"
                inputMode="url"
                name="url"
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://example.com/long-url"
                spellCheck={false}
                type="url"
                value={url}
              />

              <button
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-button outline-none transition hover:-translate-y-px hover:bg-accent-hover hover:shadow-button-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    Shortening…
                  </>
                ) : (
                  'Shorten'
                )}
              </button>
            </div>

            {error ? (
              <p
                className="mt-2 text-sm text-error"
                id="url-error"
                role="alert"
              >
                {error}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted" id="url-hint">
                The URL must start with http:// or https://
              </p>
            )}
          </form>

          <div aria-live="polite">
            {result ? (
              <article className="mt-4 rounded-2xl border border-accent/15 bg-white p-5 shadow-card sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-full bg-success-soft text-success">
                    <CheckIcon className="size-4" />
                  </span>
                  <p className="text-sm font-semibold">Short URL</p>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    className="min-w-0 flex-1 truncate rounded text-xl font-semibold tracking-tight text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent"
                    href={result.shortUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {result.shortUrl}
                  </a>

                  <div className="flex gap-2">
                    <button
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-medium outline-none transition hover:border-line-strong hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-none"
                      onClick={() => {
                        void handleCopy();
                      }}
                      type="button"
                    >
                      {copyState === 'copied' ? (
                        <>
                          <CheckIcon className="size-4 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon className="size-4" />
                          Copy
                        </>
                      )}
                    </button>

                    <a
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-medium outline-none transition hover:border-line-strong hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-none"
                      href={result.shortUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open
                      <ArrowUpRightIcon className="size-4" />
                    </a>
                  </div>
                </div>

                <p className="mt-4 truncate border-t border-line pt-4 text-sm text-muted">
                  Destination: {result.originalUrl}
                </p>

                {copyState === 'failed' ? (
                  <p className="mt-3 text-sm text-error" role="alert">
                    Copy failed. Select the link and copy it manually.
                  </p>
                ) : null}
              </article>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
