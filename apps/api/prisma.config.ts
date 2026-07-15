import { config } from 'dotenv';
import { isAbsolute, resolve } from 'node:path';
import { defineConfig, env } from 'prisma/config';

config({ path: '.env' });
config({ path: '../../.env' });

const configuredDatabaseUrl = env('DATABASE_URL');
const databasePath = configuredDatabaseUrl.replace(/^file:/, '');
const databaseUrl = configuredDatabaseUrl.startsWith('file:')
  ? `file:${isAbsolute(databasePath) ? databasePath : resolve(process.cwd(), databasePath)}`
  : configuredDatabaseUrl;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
