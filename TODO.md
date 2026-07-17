# Implementation tracker

This file is the source of truth for project progress. It is updated at every validated milestone so that work can be resumed without relying on conversation history.

## Resume here

- **Current milestone:** 7 — full-stack integration and manual verification
- **Status:** ready to start after the milestone 6 Git checkpoint
- **Next action:** user commits and pushes milestone 6, then full-stack verification begins
- **Last validated milestone:** 6 — frontend tests
- **Remote repository:** `https://github.com/AliciaVillemat/url-shortener` (public)

## Working agreement

- Implement one milestone at a time.
- Run the milestone checks before requesting validation.
- After validation, update this file and suggest one logical set of Git commands.
- The user reviews the changes and remains responsible for staging, committing, and pushing.
- Record any material deviation from the brief in the decision log below.
- Do not start the next milestone before user validation.

Status legend: `[ ]` pending, `[~]` in progress, `[x]` completed and validated.

## Milestones

### 1. Repository and workspace foundation `[x]`

- [x] Create the minimal `apps/api` and `apps/web` workspace structure.
- [x] Add pnpm workspace and root orchestration scripts.
- [x] Add shared formatting, editor, environment, and ignore files.
- [x] Pin the Node.js and pnpm versions.
- [x] Initialize Git with `main` as the default branch.
- [x] Create the GitHub repository and push the initial commit.
- [x] Obtain user validation.

Validation gate:

- Workspace files are coherent and tracked.
- No secret, dependency, database, or generated artifact is staged.
- The initial commit is visible on GitHub.

### 2. Backend foundation `[x]`

- [x] Scaffold the NestJS TypeScript application.
- [x] Add Prisma and the SQLite `Link` model.
- [x] Create and version the initial Prisma migration.
- [x] Validate required environment variables at startup.
- [x] Configure expected CORS origin and global request validation.
- [x] Add `GET /api/health`.
- [x] Add root `setup` and backend lifecycle scripts.
- [x] Run setup, lint, typecheck, tests, and build.
- [x] Obtain user validation, commit, and push.

### 3. Backend link creation and redirection `[x]`

- [x] Implement `POST /api/links` with stable response data.
- [x] Validate presence, syntax, protocol, and length server-side.
- [x] Generate case-sensitive Base62 codes with cryptographic randomness.
- [x] Enforce database uniqueness and bounded retries on insertion collision.
- [x] Implement `GET /:code` with a `302` redirect.
- [x] Return clean, consistent errors without leaking internals.
- [x] Ensure the server never fetches submitted destinations.
- [x] Add a versioned Bruno collection for manual API verification.
- [x] Run all milestone checks.
- [x] Obtain user validation, commit, and push.

### 4. Backend integration tests `[x]`

- [x] Use an isolated, reproducible test database.
- [x] Cover valid HTTPS and HTTP creation.
- [x] Cover invalid values and forbidden protocols.
- [x] Cover persistence and generated code format.
- [x] Cover successful redirect and unknown-code `404`.
- [x] Cover a simulated insertion collision where practical.
- [x] Run all milestone checks.
- [x] Obtain user validation, commit, and push.

### 5. Frontend application `[x]`

- [x] Scaffold React, TypeScript, Vite, and Tailwind CSS.
- [x] Build the accessible URL submission form.
- [x] Validate URL presence, syntax, protocol, and length client-side.
- [x] Add loading and useful error states.
- [x] Display the generated short URL.
- [x] Add copy feedback and open-link action.
- [x] Make the interface polished and responsive.
- [x] Run lint, typecheck, and build.
- [x] Obtain user validation.

### 6. Frontend tests `[x]`

- [x] Configure Vitest and Testing Library.
- [x] Cover client validation and submission.
- [x] Cover result and API error rendering.
- [x] Cover loading and clipboard behavior where maintainable.
- [x] Run all milestone checks.
- [x] Obtain user validation.

### 7. Full-stack integration and manual verification `[ ]`

- [ ] Connect the web application to the configured API URL.
- [ ] Test real creation, copy, open, and redirect flows.
- [ ] Verify unknown codes return `404` without frontend fallback.
- [ ] Verify data persists after an API restart.
- [ ] Check keyboard navigation, focus states, mobile, and desktop layouts.
- [ ] Obtain user validation, commit, and push.

### 8. Quality, CI, and final documentation `[ ]`

- [ ] Make root format, lint, typecheck, test, and build checks pass.
- [ ] Add a minimal GitHub Actions quality workflow.
- [ ] Complete the README sections required by the brief.
- [ ] Document product decisions, trade-offs, limits, production evolution, and AI use.
- [ ] Add a useful screenshot if the final interface warrants one.
- [ ] Obtain user validation, commit, and push.

### 9. Clean-install acceptance audit `[ ]`

- [ ] Reinstall dependencies from the lockfile in a clean state.
- [ ] Follow the README setup instructions exactly.
- [ ] Run setup, lint, typecheck, tests, and builds.
- [ ] Start both applications and repeat the critical manual flow.
- [ ] Audit tracked files for secrets, local databases, and artifacts.
- [ ] Verify the final GitHub repository content.
- [ ] Obtain final user acceptance and push the final audit commit.

## Decision log

| Date       | Decision                                                                                   | Reason                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-15 | Create and push the GitHub repository during milestone 1.                                  | The user wants regular remote checkpoints throughout implementation.                                                                                      |
| 2026-07-15 | Keep progress tracking in one root `TODO.md`.                                              | A single source of truth is easier to maintain and resume than several process documents.                                                                 |
| 2026-07-15 | Use Node.js 24.16.0 and pnpm 10.17.1 initially.                                            | Both are installed locally, stable, and compatible; exact application dependencies will be locked in `pnpm-lock.yaml`.                                    |
| 2026-07-15 | Use `pnpm run setup` as the documented preparation command.                                | `pnpm setup` is reserved by the pnpm CLI for shell configuration and cannot safely invoke the package script.                                             |
| 2026-07-15 | Run the API on port 3001 during local development.                                         | Port 3000 is already occupied on the development machine; ports 3001 and 5173 were confirmed available.                                                   |
| 2026-07-15 | Leave all future Git operations to the user.                                               | The user wants to review changes and personally run staging, commit, and push commands.                                                                   |
| 2026-07-15 | Create the empty SQLite file with Node before deploying migrations.                        | Prisma 7.8 did not create the missing local file before `migrate deploy`; the Node 24 SQLite module keeps setup deterministic without another dependency. |
| 2026-07-15 | Use seven-character Base62 codes, five collision attempts, and a 2048-character URL limit. | These conservative MVP limits satisfy the brief while keeping behavior explicit and easy to test.                                                         |
| 2026-07-15 | Version a Bruno OpenCollection in YAML without adding its CLI dependency.                  | Bruno 3 recommends the review-friendly YAML format; the desktop collection is sufficient for manual checks and avoids extra project dependencies.         |
| 2026-07-16 | Run backend integration tests against a disposable migrated SQLite database.               | Each run is reproducible, exercises real Prisma persistence, and cannot alter local development data.                                                     |
| 2026-07-16 | Keep API and web ports configurable but explicit, with Vite strict port selection.         | Automatic discovery would require synchronizing runtime values across CORS, public links, and the browser; explicit configuration is more predictable.    |
| 2026-07-17 | Test frontend behavior with Vitest, jsdom, and Testing Library at the component boundary.  | Mocking the API keeps UI tests fast and deterministic while the existing backend suite independently verifies HTTP and persistence behavior.              |
