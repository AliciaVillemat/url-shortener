# API

NestJS REST API for URL creation, optional expiration, and redirection. The current implementation status is tracked in the root [`TODO.md`](../../TODO.md).

## Tests

Run the backend integration suite from the repository root with:

```bash
pnpm test
```

The test runner creates a dedicated SQLite database, applies the versioned Prisma migrations, executes Jest and Supertest serially, and removes the database afterward. It covers permanent, active, and expired links without waiting for a real expiration, and never reads from or writes to the local development database.
