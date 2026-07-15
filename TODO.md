# Implementation tracker

This file is the source of truth for project progress. It is updated at every validated milestone so that work can be resumed without relying on conversation history.

## Resume here

- **Current milestone:** 1 — repository and workspace foundation
- **Status:** in progress, awaiting validation
- **Next action:** validate milestone 1, then scaffold the NestJS API
- **Last validated milestone:** none
- **Remote repository:** pending creation

## Working agreement

- Implement one milestone at a time.
- Run the milestone checks before requesting validation.
- After validation, update this file, create one logical commit, and push `main`.
- Record any material deviation from the brief in the decision log below.
- Do not start the next milestone before user validation.

Status legend: `[ ]` pending, `[~]` in progress, `[x]` completed and validated.

## Milestones

### 1. Repository and workspace foundation `[~]`

- [x] Create the minimal `apps/api` and `apps/web` workspace structure.
- [x] Add pnpm workspace and root orchestration scripts.
- [x] Add shared formatting, editor, environment, and ignore files.
- [x] Pin the Node.js and pnpm versions.
- [x] Initialize Git with `main` as the default branch.
- [ ] Create the GitHub repository and push the initial commit.
- [ ] Obtain user validation.

Validation gate:

- Workspace files are coherent and tracked.
- No secret, dependency, database, or generated artifact is staged.
- The initial commit is visible on GitHub.

### 2. Backend foundation `[ ]`

- [ ] Scaffold the NestJS TypeScript application.
- [ ] Add Prisma and the SQLite `Link` model.
- [ ] Create and version the initial Prisma migration.
- [ ] Validate required environment variables at startup.
- [ ] Configure expected CORS origin and global request validation.
- [ ] Add `GET /api/health`.
- [ ] Add root `setup` and backend lifecycle scripts.
- [ ] Run setup, lint, typecheck, tests, and build.
- [ ] Obtain user validation, commit, and push.

### 3. Backend link creation and redirection `[ ]`

- [ ] Implement `POST /api/links` with stable response data.
- [ ] Validate presence, syntax, protocol, and length server-side.
- [ ] Generate case-sensitive Base62 codes with cryptographic randomness.
- [ ] Enforce database uniqueness and bounded retries on insertion collision.
- [ ] Implement `GET /:code` with a `302` redirect.
- [ ] Return clean, consistent errors without leaking internals.
- [ ] Ensure the server never fetches submitted destinations.
- [ ] Run all milestone checks.
- [ ] Obtain user validation, commit, and push.

### 4. Backend integration tests `[ ]`

- [ ] Use an isolated, reproducible test database.
- [ ] Cover valid HTTPS and HTTP creation.
- [ ] Cover invalid values and forbidden protocols.
- [ ] Cover persistence and generated code format.
- [ ] Cover successful redirect and unknown-code `404`.
- [ ] Cover a simulated insertion collision where practical.
- [ ] Run all milestone checks.
- [ ] Obtain user validation, commit, and push.

### 5. Frontend application `[ ]`

- [ ] Scaffold React, TypeScript, Vite, and Tailwind CSS.
- [ ] Build the accessible URL submission form.
- [ ] Validate URL presence, syntax, protocol, and length client-side.
- [ ] Add loading and useful error states.
- [ ] Display the generated short URL.
- [ ] Add copy feedback and open-link action.
- [ ] Make the interface polished and responsive.
- [ ] Run lint, typecheck, and build.
- [ ] Obtain user validation, commit, and push.

### 6. Frontend tests `[ ]`

- [ ] Configure Vitest and Testing Library.
- [ ] Cover client validation and submission.
- [ ] Cover result and API error rendering.
- [ ] Cover loading and clipboard behavior where maintainable.
- [ ] Run all milestone checks.
- [ ] Obtain user validation, commit, and push.

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

| Date       | Decision                                                    | Reason                                                                                                                 |
| ---------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 2026-07-15 | Create and push the GitHub repository during milestone 1.   | The user wants regular remote checkpoints throughout implementation.                                                   |
| 2026-07-15 | Keep progress tracking in one root `TODO.md`.               | A single source of truth is easier to maintain and resume than several process documents.                              |
| 2026-07-15 | Use Node.js 24.16.0 and pnpm 10.17.1 initially.             | Both are installed locally, stable, and compatible; exact application dependencies will be locked in `pnpm-lock.yaml`. |
| 2026-07-15 | Use `pnpm run setup` as the documented preparation command. | `pnpm setup` is reserved by the pnpm CLI for shell configuration and cannot safely invoke the package script.          |
