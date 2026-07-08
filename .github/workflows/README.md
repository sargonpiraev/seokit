# GitHub Actions

## Reusable workflows

### `on-push-main.yml`

Baseline parallel checks for monorepo workspaces:

- `lint`
- `check-types`
- `build`
- `test`
- `audit` (optional via `skip-audit` input)

Call from the same repo:

```yaml
jobs:
  base:
    uses: ./.github/workflows/on-push-main.yml
```

Call from another repo:

```yaml
jobs:
  base:
    uses: sargonpiraev/shared/.github/workflows/on-push-main.yml@main
```

### Package publish workflows

Pattern for publishable packages in `shared`:

```yaml
jobs:
  base:
    uses: ./.github/workflows/on-push-main.yml

  package-extra:
    runs-on: ubuntu-latest
    steps:
      # package-specific checks (Playwright, integration, etc.)

  publish-npm:
    needs: [base, package-extra]

  publish-docs:
    needs: [base, package-extra]
```

Example: `on-main-push-seodit.yml` adds `test-next` beside `base`, then publishes npm + docs in parallel.

### npm publish auth

`publish-npm` uses **npm Trusted Publishing (OIDC)** only — `id-token: write`, `registry-url` in `setup-node`. No `NPM_TOKEN` fallback.

On npmjs.com → `@sargonpiraev/seodit` → Trusted Publisher must match exactly:

- Repository: `sargonpiraev/shared`
- Workflow filename: `on-main-push-seodit.yml`

## Extension points

Add optional `workflow_call` inputs to `on-push-main.yml` when a consumer needs them (`skip-audit`, custom test command, etc.). Keep heavy package-specific checks in `on-main-push-<package>.yml`, not in the shared baseline.
