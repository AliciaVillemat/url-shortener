# Web

React and Vite frontend for the URL shortener. Its implementation status is tracked in the root [`TODO.md`](../../TODO.md).

The development server uses `VITE_WEB_PORT` and enables Vite's `strictPort` option. If the configured port is occupied, startup fails explicitly instead of silently selecting another port and breaking the configured API CORS origin.
