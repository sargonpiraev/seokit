# Seodit Next Example

Minimal Next.js + next-intl fixture used to validate `@sargonpiraev/seodit/next`.

## Routes

- `/[locale]`
- `/[locale]/anime`
- `/[locale]/anime/[malId]` with fixture `malId=1`

## Run

```bash
npm install
npm run build -w @sargonpiraev/seodit
npm test -w seodit-next-example
```

The Playwright project builds the app, reads `.next/app-path-routes-manifest.json`, infers route patterns from colocated `page.seodit.spec.ts` files, and runs SEO assertions.
