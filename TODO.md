# Implementation tracker

This file is the source of truth for project progress. It is updated at every validated milestone so that work can be resumed without relying on conversation history.

## Resume here

- **Current milestone:** 10 — optional link expiration
- **Status:** final user validation
- **Last validated milestone:** 9 — clean-install acceptance audit
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

### 7. Full-stack integration and manual verification `[x]`

- [x] Connect the web application to the configured API URL.
- [x] Test real creation and redirect flows against the running applications.
- [x] Verify copy and open-link actions in an interactive browser.
- [x] Verify unknown codes return `404` without frontend fallback.
- [x] Verify data persists after an API restart.
- [x] Check keyboard navigation, focus states, mobile, and desktop layouts in an interactive browser.
- [x] Obtain user validation.

Verification evidence recorded on 2026-07-17:

- The web application and API responded on the configured ports `5173` and `3001`.
- The API health check returned `200`, and the browser preflight returned `204` with the expected CORS headers.
- A live URL creation returned `201`; its generated short URL returned `302` to the original destination.
- An unknown, correctly shaped code returned the API's JSON `404` response rather than frontend HTML.
- An isolated API instance retained a created link after a complete stop and restart against the same SQLite database.
- The user confirmed clipboard, open-link, keyboard focus, mobile, and desktop behavior in an interactive browser.

### 8. Quality, CI, and final documentation `[x]`

- [x] Make root format, lint, typecheck, test, and build checks pass.
- [x] Add a minimal GitHub Actions quality workflow.
- [x] Complete a focused clone-and-run README with the product, setup, API, architecture, and main decisions.
- [x] Preserve interview-specific trade-offs, limits, production evolution, CI, and AI notes in an ignored local file.
- [x] Add a useful screenshot if the final interface warrants one.
- [x] Obtain user validation.

### 9. Clean-install acceptance audit `[x]`

- [x] Reinstall dependencies from the lockfile in a clean state.
- [x] Follow the README setup instructions exactly.
- [x] Run setup, lint, typecheck, tests, and builds.
- [x] Start both applications and repeat the critical manual flow.
- [x] Audit tracked files for secrets, local databases, and artifacts.
- [x] Verify the final GitHub repository content.
- [x] Obtain final user acceptance and push the final audit commit.

### 10. Optional link expiration `[x]`

- [x] Define the product rules: optional presets, server-calculated expiry, `410 Gone`, and no automatic deletion.
- [x] Add a nullable expiration field through a versioned Prisma migration.
- [x] Accept and validate expiration presets when creating a link.
- [x] Reject redirects for expired links with a clean `410` response.
- [x] Cover permanent, active, expired, and invalid-expiration cases in backend tests.
- [x] Add Bruno requests for valid and invalid expiration values.
- [x] Obtain user validation of the backend behavior.
- [x] Add the expiration control and result information to the web interface.
- [x] Cover the frontend request and rendering behavior with tests.
- [x] Update public documentation and complete the full-stack acceptance checks.
- [x] Obtain final user validation.
