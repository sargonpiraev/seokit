const POKEAPI = "https://pokeapi.co/api/v2";

/** Stable catalog across a few generations (for filters + i18n SEO specs). */
export const DEMO_POKEMON = [
  "bulbasaur",
  "charmander",
  "squirtle",
  "pikachu",
  "eevee",
  "charizard",
  "cyndaquil",
  "totodile",
  "mudkip",
] as const;

/** Types that appear on demo Pokémon. */
export const DEMO_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "poison",
  "flying",
] as const;

/** Generations covered by the demo catalog. */
export const DEMO_GENERATIONS = ["i", "ii", "iii"] as const;

export type PokemonSlug = (typeof DEMO_POKEMON)[number];
export type TypeSlug = (typeof DEMO_TYPES)[number];
export type GenerationSlug = (typeof DEMO_GENERATIONS)[number];

type NamedApiResource = {
  name: string;
  url: string;
};

type NamedLocalized = {
  names: Array<{ name: string; language: NamedApiResource }>;
};

type PokemonSpecies = NamedLocalized & {
  id: number;
  name: string;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedApiResource;
    version: NamedApiResource;
  }>;
  generation: NamedApiResource;
  color: NamedApiResource;
};

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
    };
  };
  types: Array<{ slot: number; type: NamedApiResource }>;
  species: NamedApiResource;
};

type TypeApi = NamedLocalized & {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: NamedApiResource[];
    double_damage_to: NamedApiResource[];
    half_damage_from: NamedApiResource[];
    half_damage_to: NamedApiResource[];
    no_damage_from: NamedApiResource[];
    no_damage_to: NamedApiResource[];
  };
  pokemon: Array<{ pokemon: NamedApiResource; slot: number }>;
};

type GenerationApi = NamedLocalized & {
  id: number;
  name: string;
  main_region: NamedApiResource;
  pokemon_species: NamedApiResource[];
  types: NamedApiResource[];
};

export type LocalizedPokemon = {
  slug: string;
  id: number;
  locale: string;
  name: string;
  description: string;
  imageUrl: string | null;
  types: string[];
  /** Short generation key, e.g. `i` from `generation-i`. */
  generation: string;
  color: string;
};

export type LocalizedType = {
  slug: string;
  id: number;
  locale: string;
  name: string;
  /** Demo Pokémon that have this type. */
  pokemonSlugs: string[];
  doubleDamageTo: string[];
  doubleDamageFrom: string[];
};

export type LocalizedGeneration = {
  slug: string;
  id: number;
  locale: string;
  name: string;
  mainRegion: string;
  /** Demo Pokémon in this generation. */
  pokemonSlugs: string[];
  /** Types introduced in this generation (demo intersection when listing). */
  typeSlugs: string[];
};

async function pokeFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${POKEAPI}${path}`, {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) {
    throw new Error(`PokeAPI ${path} failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function pickLocalizedName(
  names: NamedLocalized["names"],
  locale: string,
  fallback: string,
): string {
  return (
    names.find((entry) => entry.language.name === locale)?.name ??
    names.find((entry) => entry.language.name === "en")?.name ??
    fallback
  );
}

function localizedFlavor(species: PokemonSpecies, locale: string): string {
  const entry =
    species.flavor_text_entries.find((item) => item.language.name === locale) ??
    species.flavor_text_entries.find((item) => item.language.name === "en");
  return (entry?.flavor_text ?? "").replace(/\s+/g, " ").trim();
}

function shortGeneration(generationName: string): string {
  return generationName.replace(/^generation-/, "");
}

function resourceNames(resources: NamedApiResource[]): string[] {
  return resources.map((item) => item.name);
}

export async function getPokemon(slug: string, locale: string): Promise<LocalizedPokemon> {
  const pokemon = await pokeFetch<Pokemon>(`/pokemon/${slug}`);
  const species = await pokeFetch<PokemonSpecies>(
    `/pokemon-species/${pokemon.species.name}`,
  );

  return {
    slug: pokemon.name,
    id: pokemon.id,
    locale,
    name: pickLocalizedName(species.names, locale, species.name),
    description: localizedFlavor(species, locale),
    imageUrl: pokemon.sprites.other?.["official-artwork"]?.front_default ?? null,
    types: pokemon.types.map((item) => item.type.name),
    generation: shortGeneration(species.generation.name),
    color: species.color.name,
  };
}

export async function listDemoPokemon(locale: string): Promise<LocalizedPokemon[]> {
  return Promise.all(DEMO_POKEMON.map((slug) => getPokemon(slug, locale)));
}

export function isDemoPokemon(slug: string): slug is PokemonSlug {
  return (DEMO_POKEMON as readonly string[]).includes(slug);
}

export async function getType(slug: string, locale: string): Promise<LocalizedType> {
  const type = await pokeFetch<TypeApi>(`/type/${slug}`);
  const demoSet = new Set<string>(DEMO_POKEMON);

  return {
    slug: type.name,
    id: type.id,
    locale,
    name: pickLocalizedName(type.names, locale, type.name),
    pokemonSlugs: type.pokemon
      .map((entry) => entry.pokemon.name)
      .filter((name) => demoSet.has(name)),
    doubleDamageTo: resourceNames(type.damage_relations.double_damage_to),
    doubleDamageFrom: resourceNames(type.damage_relations.double_damage_from),
  };
}

export async function listDemoTypes(locale: string): Promise<LocalizedType[]> {
  return Promise.all(DEMO_TYPES.map((slug) => getType(slug, locale)));
}

export function isDemoType(slug: string): slug is TypeSlug {
  return (DEMO_TYPES as readonly string[]).includes(slug);
}

export async function getGeneration(
  slug: string,
  locale: string,
): Promise<LocalizedGeneration> {
  const generation = await pokeFetch<GenerationApi>(`/generation/generation-${slug}`);
  const demoSet = new Set<string>(DEMO_POKEMON);
  const typeSet = new Set<string>(DEMO_TYPES);

  return {
    slug: shortGeneration(generation.name),
    id: generation.id,
    locale,
    name: pickLocalizedName(generation.names, locale, generation.name),
    mainRegion: generation.main_region.name,
    pokemonSlugs: generation.pokemon_species
      .map((entry) => entry.name)
      .filter((name) => demoSet.has(name)),
    typeSlugs: generation.types
      .map((entry) => entry.name)
      .filter((name) => typeSet.has(name)),
  };
}

export async function listDemoGenerations(
  locale: string,
): Promise<LocalizedGeneration[]> {
  return Promise.all(DEMO_GENERATIONS.map((slug) => getGeneration(slug, locale)));
}

export function isDemoGeneration(slug: string): slug is GenerationSlug {
  return (DEMO_GENERATIONS as readonly string[]).includes(slug);
}
