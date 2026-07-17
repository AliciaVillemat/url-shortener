import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createShortLink, type CreatedLink } from './api/links';
import App from './App';

vi.mock('./api/links', () => ({
  createShortLink: vi.fn(),
}));

const mockedCreateShortLink = vi.mocked(createShortLink);

const createdLink: CreatedLink = {
  code: 'aB3dE9z',
  originalUrl: 'https://example.com/a/long/path',
  shortUrl: 'http://localhost:3001/aB3dE9z',
  createdAt: '2026-07-17T08:30:00.000Z',
  expiresAt: null,
};

describe('App', () => {
  beforeEach(() => {
    mockedCreateShortLink.mockReset();
  });

  it('validates the URL before submitting it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a URL to shorten.',
    );
    expect(mockedCreateShortLink).not.toHaveBeenCalled();
  });

  it('shows a loading state and renders the created link', async () => {
    const user = userEvent.setup();
    let resolveRequest: (value: CreatedLink) => void = () => undefined;

    mockedCreateShortLink.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<App />);

    await user.type(screen.getByLabelText('URL'), createdLink.originalUrl);
    await user.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(screen.getByRole('button', { name: 'Shortening…' })).toBeDisabled();
    expect(mockedCreateShortLink).toHaveBeenCalledOnce();
    expect(mockedCreateShortLink).toHaveBeenCalledWith({
      url: createdLink.originalUrl,
    });

    await act(async () => {
      resolveRequest(createdLink);
      await Promise.resolve();
    });

    expect(
      screen.getByRole('link', { name: createdLink.shortUrl }),
    ).toHaveAttribute('href', createdLink.shortUrl);
    expect(
      screen.getByText(`Destination: ${createdLink.originalUrl}`),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute(
      'href',
      createdLink.shortUrl,
    );
    expect(screen.getByText('Does not expire')).toBeInTheDocument();
  });

  it('submits an expiration preset and renders the returned date', async () => {
    const user = userEvent.setup();
    const expiringLink: CreatedLink = {
      ...createdLink,
      expiresAt: '2026-07-24T08:30:00.000Z',
    };
    mockedCreateShortLink.mockResolvedValue(expiringLink);

    render(<App />);

    await user.type(screen.getByLabelText('URL'), expiringLink.originalUrl);
    await user.selectOptions(screen.getByLabelText('Expiration'), '7d');
    await user.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(mockedCreateShortLink).toHaveBeenCalledWith({
      url: expiringLink.originalUrl,
      expiration: '7d',
    });

    const expiration = await screen.findByText(/Expires/);
    expect(expiration.querySelector('time')).toHaveAttribute(
      'datetime',
      expiringLink.expiresAt,
    );
  });

  it('renders an API error and removes the loading state', async () => {
    const user = userEvent.setup();
    mockedCreateShortLink.mockRejectedValue(
      new Error('The service is unavailable. Try again.'),
    );

    render(<App />);

    await user.type(screen.getByLabelText('URL'), createdLink.originalUrl);
    await user.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The service is unavailable. Try again.',
    );
    expect(screen.getByRole('button', { name: 'Shorten' })).toBeEnabled();
  });

  it('copies the generated short URL and confirms success', async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);
    mockedCreateShortLink.mockResolvedValue(createdLink);

    render(<App />);

    await user.type(screen.getByLabelText('URL'), createdLink.originalUrl);
    await user.click(screen.getByRole('button', { name: 'Shorten' }));
    await user.click(await screen.findByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(createdLink.shortUrl);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('shows a useful message when clipboard access fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
      new Error('Clipboard access denied'),
    );
    mockedCreateShortLink.mockResolvedValue(createdLink);

    render(<App />);

    await user.type(screen.getByLabelText('URL'), createdLink.originalUrl);
    await user.click(screen.getByRole('button', { name: 'Shorten' }));
    await user.click(await screen.findByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Copy failed. Select the link and copy it manually.',
    );
  });
});
