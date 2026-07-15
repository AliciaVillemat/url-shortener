import { config } from 'dotenv';
import { DatabaseSync } from 'node:sqlite';
import { isAbsolute, resolve } from 'node:path';

config({ path: '.env' });
config({ path: '../../.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.startsWith('file:')) {
  throw new Error('DATABASE_URL must use the file: protocol for SQLite');
}

const configuredPath = databaseUrl.replace(/^file:/, '');
const databasePath = isAbsolute(configuredPath)
  ? configuredPath
  : resolve(process.cwd(), configuredPath);

const database = new DatabaseSync(databasePath);
database.close();
