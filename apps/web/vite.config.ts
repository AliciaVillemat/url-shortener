import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

function parsePort(value: string | undefined): number {
  const port = Number(value ?? 5173);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('VITE_WEB_PORT must be an integer between 1 and 65535');
  }

  return port;
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '../../', '');
  const port = parsePort(environment.VITE_WEB_PORT);

  return {
    envDir: '../../',
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
      strictPort: true,
    },
  };
});
