import { expect, test } from "@/test/seokit";
import { LOCALES, ORIGIN } from "@/test/seo-fixtures";

const SITEMAP_IDS = LOCALES.flatMap((locale) => [
  `${locale}-static`,
  `${locale}-pokemon-0`,
  `${locale}-types-0`,
  `${locale}-generations-0`,
]);

test("robots.txt points at the localized sitemap index", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain(`Sitemap: ${ORIGIN}/sitemapindex.xml`);
});

test("sitemap index lists locale-split child sitemaps", async ({ request }) => {
  const response = await request.get("/sitemapindex.xml");
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  expect(body).toContain("<sitemapindex");

  for (const id of SITEMAP_IDS) {
    expect(body).toContain(`${ORIGIN}/sitemap/${id}.xml`);
  }
});

test("static sitemap includes hreflang alternates and x-default", async ({
  request,
}) => {
  const response = await request.get("/sitemap/en-static.xml");
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  expect(body).toContain(`${ORIGIN}/en</loc>`);
  expect(body).toContain(`${ORIGIN}/en/pokemon</loc>`);
  expect(body).toContain(`${ORIGIN}/en/types</loc>`);
  expect(body).toContain(`${ORIGIN}/en/generations</loc>`);

  for (const locale of LOCALES) {
    expect(body).toContain(`hreflang="${locale}"`);
  }
  expect(body).toContain('hreflang="x-default"');
  expect(body).toContain(`href="${ORIGIN}/en"`);
  expect(body).toContain("<changefreq>");
  expect(body).toContain("<priority>");
});

test("unknown sitemap id returns 404", async ({ request }) => {
  const response = await request.get("/sitemap/zz-static.xml");
  expect(response.status()).toBe(404);
});

test("entity sitemaps are locale-scoped", async ({ request }) => {
  const [enPokemon, deTypes, frGenerations] = await Promise.all([
    request.get("/sitemap/en-pokemon-0.xml"),
    request.get("/sitemap/de-types-0.xml"),
    request.get("/sitemap/fr-generations-0.xml"),
  ]);

  expect(enPokemon.ok()).toBeTruthy();
  expect(deTypes.ok()).toBeTruthy();
  expect(frGenerations.ok()).toBeTruthy();

  const enBody = await enPokemon.text();
  const deBody = await deTypes.text();
  const frBody = await frGenerations.text();

  expect(enBody).toContain(`${ORIGIN}/en/pokemon/charmander</loc>`);
  expect(enBody).toContain(`hreflang="de"`);
  expect(deBody).toContain(`${ORIGIN}/de/types/fire</loc>`);
  expect(frBody).toContain(`${ORIGIN}/fr/generations/i</loc>`);
});
