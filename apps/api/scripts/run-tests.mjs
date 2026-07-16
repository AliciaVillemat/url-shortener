import { DatabaseSync } from 'node:sqlite';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const databasePath = resolve(process.cwd(), 'test/test.db');
const databaseFiles = [
  databasePath,
  `${databasePath}-journal`,
  `${databasePath}-shm`,
  `${databasePath}-wal`,
];
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const environment = {
  ...process.env,
  DATABASE_URL: `file:${databasePath}`,
  PUBLIC_BASE_URL: 'http://localhost:3001',
  WEB_ORIGIN: 'http://localhost:5173',
  PORT: '3001',
};

function removeTestDatabase() {
  for (const file of databaseFiles) {
    if (existsSync(file)) {
      rmSync(file, { force: true });
    }
  }
}

function run(args) {
  const result = spawnSync(pnpmCommand, args, {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: pnpm ${args.join(' ')}`);
  }
}

removeTestDatabase();

try {
  const database = new DatabaseSync(databasePath);
  database.close();

  run(['exec', 'prisma', 'generate']);
  run(['exec', 'prisma', 'migrate', 'deploy']);
  run(['exec', 'jest', '--runInBand']);
} finally {
  removeTestDatabase();
}
