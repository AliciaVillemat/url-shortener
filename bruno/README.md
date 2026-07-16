# Bruno collection

This directory contains the manual API checks for the URL shortener in Bruno's OpenCollection YAML format.

## Use in the Bruno desktop app

1. Prepare and start the API from the repository root with `pnpm run setup` and `pnpm dev`.
2. In Bruno 3 or later, open this `bruno` directory as a collection.
3. Select the `Local` environment.
4. Run individual requests or use the collection runner.

`Create HTTPS link` stores its returned code as the runtime variable `shortCode`. Run it before `Redirect last created link` when executing requests individually. Redirect following is disabled for that request so Bruno exposes the API's `302` and `Location` header instead of visiting the external destination.

The Bruno CLI is intentionally not a project dependency. If it is already installed on your machine, the collection can also be run from this directory with `bru run --env Local` while the API is running.
