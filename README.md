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

The complete setup and usage documentation will be written and verified before the project is considered finished.

## Manual API checks with Bruno

A ready-to-use Bruno 3+ collection is versioned in [`bruno/`](./bruno). Start the API with `pnpm dev`, open that directory as a collection in Bruno, and select the `Local` environment.

The collection includes the health check, successful HTTP/HTTPS creation, expected validation errors, a `302` redirect, and an unknown-code response. Run `Create HTTPS link` before `Redirect last created link` so the generated code is captured automatically.
