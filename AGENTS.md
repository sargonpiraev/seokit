# seokit

Two Playwright expect matchers for SEO checks (`toHaveMetadata`, `toHaveJsonLd`) via `extendSeokitExpect`. Demo `apps/webapp` + Fumadocs `apps/docapp` support the package; they are not part of the public product surface. Playwright harness lives on `webapp` (eslint glob); `docapp` is docs-only / no harness yet.

## Workspaces

| Path | npm name | Role |
| --- | --- | --- |
| `packages/seokit` | `@sargonpiraev/seokit` | published library (matchers) |
| `apps/webapp` | `seokit-webapp` | demo + Playwright SEO specs |
| `apps/docapp` | `seokit-docapp` | Fumadocs docs (GitHub Pages) |

Node: `>=24 <25` (see root `package.json` `engines`).

## Public API

Root export: `extendSeokitExpect`, the two matchers (via expect), `extractPageMetadata`, and matcher expectation types.

Subpaths `@sargonpiraev/seokit/next` and `@sargonpiraev/seokit/core` exist for internal/advanced use — not part of the product pitch; do not document them as first-class features.

## Commands

```bash
npm test                         # package unit tests
npm run test:webapp -w @sargonpiraev/seokit   # webapp build + Playwright suites
npm run build -w @sargonpiraev/seokit
npm run check-types
npm run test:visual:update       # Linux visual baselines via Playwright Docker (CI image)
```

Webapp `npm test` builds Next first (needs network for PokeAPI on cold cache).

## Visual baselines

CI (`test-webapp`) runs in `mcr.microsoft.com/playwright:v{playwright}-jammy` (see `.github/workflows/on-push-main.yml`).

Update screenshots with `npm run test:visual:update` (`scripts/pw-visual-docker.sh`) — not bare macOS Playwright — so committed `*-linux.png` match CI. Bump the workflow image tag when `@playwright/test` changes.

## npm rename (`seodit` → `seokit`)

Registry names are immutable. Publish `@sargonpiraev/seokit`, then deprecate `@sargonpiraev/seodit`.
Trusted Publisher on npmjs.com must target package `@sargonpiraev/seokit`, repo `sargonpiraev/seokit`, workflow `on-push-main.yml`.
Do not set `registry-url` on `setup-node` in the publish job (breaks OIDC).

## Commits & release

Use Conventional Commits with scope **`seokit`** so `semantic-release` publishes:

```text
feat(seokit): …
fix(seokit): …
feat(seokit)!: …          # breaking
chore(seokit): …
```

Other scopes do **not** trigger a release (`packages/seokit/release.config.cjs`).

## Specs pattern (example)

- Colocate `*.seo.spec.ts` next to pages
- Locales × known URLs; expectations in `apps/webapp/src/test/seo-fixtures.ts` (not app imports)
- robots/sitemaps: Playwright `request` in `apps/webapp/src/app/app.seo.spec.ts` (not library matchers)

## Build hygiene

Package build: `rm -rf dist && readme-gen && tsc` — never ship stale `dist/` artifacts.
