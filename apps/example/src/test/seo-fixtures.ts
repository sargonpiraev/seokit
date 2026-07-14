/** Independent SEO expectations for Playwright — not imported by the app. */

export const LOCALES = ["en", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const ORIGIN = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4100";
export const DEFAULT_LOCALE: Locale = "en";
export const SITE_NAME = "Pokédex";

export function pageUrl(locale: Locale, path = "") {
  const normalized = path.replace(/^\//, "");
  return normalized ? `${ORIGIN}/${locale}/${normalized}` : `${ORIGIN}/${locale}`;
}

export function pathname(locale: Locale, path = "") {
  const normalized = path.replace(/^\//, "");
  return normalized ? `/${locale}/${normalized}` : `/${locale}`;
}

export function hreflangLanguages(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = pageUrl(locale, path);
  }
  languages["x-default"] = pageUrl(DEFAULT_LOCALE, path);
  return languages;
}

export const home = {
  en: {
    title: "Pokédex",
    description: "Explore Pokémon entries, types, and generations in one place.",
  },
  de: {
    title: "Pokédex",
    description: "Entdecke Pokémon-Einträge, Typen und Generationen an einem Ort.",
  },
  fr: {
    title: "Pokédex",
    description: "Explorez les fiches, types et générations de Pokémon.",
  },
} as const satisfies Record<Locale, { title: string; description: string }>;

export const pokemonList = {
  en: {
    title: "Pokémon",
    description: "Browse and filter the Pokédex catalog.",
    homeCrumb: "Home",
  },
  de: {
    title: "Pokémon",
    description: "Durchsuche und filtere den Pokédex.",
    homeCrumb: "Startseite",
  },
  fr: {
    title: "Pokémon",
    description: "Parcourez et filtrez le catalogue du Pokédex.",
    homeCrumb: "Accueil",
  },
} as const;

export const typesList = {
  en: {
    title: "Types",
    description: "Browse elemental types and the Pokémon that share them.",
    homeCrumb: "Home",
  },
  de: {
    title: "Typen",
    description: "Entdecke Elementtypen und die Pokémon, die sie teilen.",
    homeCrumb: "Startseite",
  },
  fr: {
    title: "Types",
    description: "Parcourez les types élémentaires et les Pokémon associés.",
    homeCrumb: "Accueil",
  },
} as const;

export const generationsList = {
  en: {
    title: "Generations",
    description: "Browse Pokémon generations and their main regions.",
    homeCrumb: "Home",
  },
  de: {
    title: "Generationen",
    description: "Entdecke Pokémon-Generationen und ihre Hauptregionen.",
    homeCrumb: "Startseite",
  },
  fr: {
    title: "Générations",
    description: "Parcourez les générations de Pokémon et leurs régions.",
    homeCrumb: "Accueil",
  },
} as const;

/** Known PokeAPI localized names (external contract). */
export const charmander = {
  en: {
    name: "Charmander",
    description: /Charmander/,
    homeCrumb: "Home",
    listTitle: "Pokémon",
  },
  de: {
    name: "Glumanda",
    description: /Glumanda/,
    homeCrumb: "Startseite",
    listTitle: "Pokémon",
  },
  fr: {
    name: "Salamèche",
    description: /Salamèche/,
    homeCrumb: "Accueil",
    listTitle: "Pokémon",
  },
} as const;

export const fireType = {
  en: {
    name: "Fire",
    description: "Fire type — strengths, weaknesses, and Pokémon.",
    homeCrumb: "Home",
    listTitle: "Types",
  },
  de: {
    name: "Feuer",
    description: "Typ Feuer — Stärken, Schwächen und Pokémon.",
    homeCrumb: "Startseite",
    listTitle: "Typen",
  },
  fr: {
    name: "Feu",
    description: "Type Feu — forces, faiblesses et Pokémon.",
    homeCrumb: "Accueil",
    listTitle: "Types",
  },
} as const;

export const generationI = {
  en: {
    name: "Generation I",
    description: "Generation I — Pokémon and types from this era.",
    homeCrumb: "Home",
    listTitle: "Generations",
  },
  de: {
    name: "Generation I",
    description: "Generation I — Pokémon und Typen dieser Ära.",
    homeCrumb: "Startseite",
    listTitle: "Generationen",
  },
  fr: {
    name: "1re Génération",
    description: "1re Génération — Pokémon et types de cette ère.",
    homeCrumb: "Accueil",
    listTitle: "Générations",
  },
} as const;
