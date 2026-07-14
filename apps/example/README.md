# Seokit Next Example

**Next.js + next-intl + [PokeAPI](https://pokeapi.co/)** demo for `@sargonpiraev/seokit`.

Locales (from PokeAPI `pokemon-species` names): **`en` · `de` · `fr`**.

## UI

Minimal **shadcn/ui** catalog shell:
- Home landing: hero + starters + featured + types + generations
- `/pokemon`: search + type + generation filters, card grid
- `/types` · `/generations`: taxonomy catalogs with detail pages
- Globe dropdown locale switcher that keeps the current path

## Entities

| Route | What |
| --- | --- |
| `/[locale]` | Home |
| `/[locale]/pokemon` | Card grid + search |
| `/[locale]/pokemon/[name]` | Pokémon detail |
| `/[locale]/types` | Type catalog |
| `/[locale]/types/[slug]` | Type detail (relations + Pokémon) |
| `/[locale]/generations` | Generation catalog |
| `/[locale]/generations/[slug]` | Generation detail (region + Pokémon) |

## SEO

- `generateMetadata` on every page — title, description, canonical, hreflang, OG, Twitter
- `robots.ts` → `/sitemapindex.xml`
- Locale-split sitemaps: `{locale}-static`, `{locale}-pokemon-0`, `{locale}-types-0`, `{locale}-generations-0`
- JSON-LD: Organization (layout), WebSite + ItemList (home), BreadcrumbList + ItemList (lists), Thing + BreadcrumbList (+ ItemList on taxonomies)

## What the specs show

- Loop locales × known URLs; expectations live in `src/test/seo-fixtures.ts` (not app code)
- `toHaveMetadata` / `toHaveJsonLd` per page type
- `app.seokit.spec.ts` — robots.txt + sitemap index / urlsets via Playwright `request` (not seokit matchers)
- Localized titles from PokeAPI (Charmander → Glumanda / Salamèche, Fire → Feuer / Feu)

## Run

```bash
npm install
npm run build -w @sargonpiraev/seokit
npm test -w seokit-example
```

`npm test` builds the Next app first (static pages need PokeAPI at build time), then Playwright starts the server.

Requires network on first build (PokeAPI). Responses are cached via `fetch` `revalidate`.
