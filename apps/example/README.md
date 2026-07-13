# Seokit Next Example

Minimal Next.js + next-intl app that demonstrates `@sargonpiraev/seokit/next` with colocated Playwright SEO specs.

## Routes

- `/[locale]`
- `/[locale]/products`
- `/[locale]/products/[id]` with fixture `id=alpha`

## Run

From the repository root:

```bash
npm install
npm run build -w @sargonpiraev/seokit
npm test -w seokit-example
```

The Playwright project builds the app, reads `.next/app-path-routes-manifest.json`, infers route patterns from colocated `page.seokit.spec.ts` files, and runs SEO assertions.
