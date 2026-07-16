# API

NestJS REST API for URL creation and redirection. The current implementation status is tracked in the root [`TODO.md`](../../TODO.md).

## Tests

Run the backend integration suite from the repository root with:

```bash
pnpm test
```

The test runner creates a dedicated SQLite database, applies the versioned Prisma migrations, executes Jest and Supertest serially, and removes the database afterward. It never reads from or writes to the local development database.
