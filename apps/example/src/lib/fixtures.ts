export const FIXTURE_ANIME = {
  malId: 1,
  titles: {
    en: "Cowboy Bebop",
    ru: "Ковбой Бибоп",
  },
  descriptions: {
    en: "Bounty hunters travel the solar system in the year 2071.",
    ru: "Охотники за головами путешествуют по Солнечной системе в 2071 году.",
  },
} as const;

export function getFixtureAnimeTitle(locale: string) {
  return FIXTURE_ANIME.titles[locale as keyof typeof FIXTURE_ANIME.titles] ?? FIXTURE_ANIME.titles.en;
}

export function getFixtureAnimeDescription(locale: string) {
  return (
    FIXTURE_ANIME.descriptions[locale as keyof typeof FIXTURE_ANIME.descriptions] ??
    FIXTURE_ANIME.descriptions.en
  );
}
