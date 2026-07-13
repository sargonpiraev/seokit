# seokit matchers

Playwright SEO matchers for `expect.extend`. Flat folder — one file per matcher.

Canonical example: [`to-have-canonical.ts`](./to-have-canonical.ts).

## Write a matcher like this

```typescript
import type { Page } from "@playwright/test";

/**
 * Title
 *
 * Short summary.
 *
 * ## Why is this important?
 * …
 *
 * ## How to use this matcher?
 * …
 *
 * ## Further reading
 * …
 */
export async function toHaveSomething(page: Page, expected: string | RegExp) {
  const selector = "…";
  const actual = await page.locator(selector).getAttribute("…");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected …: ${expected}\nReceived: ${actual}`,
  };
}
```

## Do

- One file: `to-have-*.ts` / `to-match-*.ts` → matching `export async function`
- Selector inside the function
- Locator read + inline compare + `{ pass, message }`
- TSDoc on the export (docs are generated from it)

## Don't

- Factories / `create*Matcher`
- Exported selector constants
- `try/catch` around `baseExpect(...).toHaveAttribute`
- Shared helpers like `matchesExpected` / `ExpectedValue` for simple checks
- Copies of Playwright internals (`_expect`, `expectTypes`, `toMatchText`)
- Subfolders, `index.ts`, `discover.ts`, or other non-matcher files here
- Docs discovery lives in `apps/docs`, not in this folder

## Register

1. Import the matcher in `playwright/index.ts` (`seokitMatchers` + module augmentation)
2. Re-export from package `src/index.ts` if needed
3. Docs regenerate from TSDoc via `generate-matcher-docs`
