# URL Shortener

A small full-stack URL shortener built as a technical exercise with React, NestJS, Prisma, and SQLite.

> The application is being implemented incrementally. See [TODO.md](./TODO.md) for the current status, validation gates, and exact restart point.

## Planned workspace

```text
.
├── apps/
│   ├── api/       # NestJS REST API
│   └── web/       # React + Vite frontend
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── TODO.md
```

## Prerequisites

- Node.js 24.16.0 (see `.nvmrc`)
- pnpm 10.17.1

## Local port configuration

The default development ports are explicit and configurable:

```dotenv
PORT=3001
PUBLIC_BASE_URL="http://localhost:3001"
WEB_ORIGIN="http://localhost:5173"
VITE_API_BASE_URL="http://localhost:3001"
VITE_WEB_PORT=5173
```

If either port is already occupied, copy `.env.example` to `.env` and change the related values together. For example, moving the API to `3100` requires updating `PORT`, `PUBLIC_BASE_URL`, and `VITE_API_BASE_URL`. Moving the frontend to `5174` requires updating both `WEB_ORIGIN` and `VITE_WEB_PORT`.

Vite uses strict port selection: it fails with a clear error when `VITE_WEB_PORT` is occupied rather than silently selecting another port and creating a CORS mismatch.

The complete setup and usage documentation will be written and verified before the project is considered finished.

## Manual API checks with Bruno

A ready-to-use Bruno 3+ collection is versioned in [`bruno/`](./bruno). Start the API with `pnpm dev`, open that directory as a collection in Bruno, and select the `Local` environment.

The collection includes the health check, successful HTTP/HTTPS creation, expected validation errors, a `302` redirect, and an unknown-code response. Run `Create HTTPS link` before `Redirect last created link` so the generated code is captured automatically.
