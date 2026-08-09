import { defineRouting } from "next-intl/routing";

/** Locales that PokeAPI pokemon-species exposes in `names` / flavor text. */
export const routing = defineRouting({
  locales: ["en", "de", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});
