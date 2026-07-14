# seokit

Playwright SEO matchers (`toHaveMetadata`, `toHaveJsonLd`) + example Next.js app + Fumadocs site.

## Workspaces

| Path | npm name | Role |
| --- | --- | --- |
| `packages/seokit` | `@sargonpiraev/seokit` | published library |
| `apps/example` | `seokit-example` | Pokémon catalog demo + Playwright SEO specs |
| `apps/docs` | `seokit-docs` | Fumadocs docs (GitHub Pages) |

Node: `>=24 <25` (see root `package.json` `engines`).

## Commands

```bash
npm test                         # package unit tests
npm run test:next -w @sargonpiraev/seokit   # example build + Playwright
npm run build -w @sargonpiraev/seokit
npm run check-types
```

Example `npm test` builds Next first (needs network for PokeAPI on cold cache).

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

- Colocate `*.seokit.spec.ts` next to pages
- Locales × known URLs; expectations in `apps/example/src/test/seo-fixtures.ts` (not app imports)
- robots/sitemaps: Playwright `request` in `apps/example/src/app/app.seokit.spec.ts` (not library matchers)

Optional Next helpers (`createSeokitPageRoutes`, …) live under `@sargonpiraev/seokit/next` and need a prior `next build`; the example uses fixture loops instead.

## Build hygiene

Package build: `rm -rf dist && readme-gen && tsc` — never ship stale `dist/` artifacts.
