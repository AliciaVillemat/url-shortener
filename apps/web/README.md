# Web

React and Vite frontend for the URL shortener, including optional expiration presets. Its implementation status is tracked in the root [`TODO.md`](../../TODO.md).

The development server uses `VITE_WEB_PORT` and enables Vite's `strictPort` option. If the configured port is occupied, startup fails explicitly instead of silently selecting another port and breaking the configured API CORS origin.

## Tests

Run the frontend test suite once:

```bash
pnpm --filter @url-shortener/web test
```

Use `test:watch` instead while developing frontend behavior.
