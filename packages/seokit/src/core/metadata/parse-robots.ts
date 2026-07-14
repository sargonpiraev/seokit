import type { PageMetadata } from "./types.js";

export function parseRobotsContent(content: string | null): PageMetadata["robots"] {
  if (content == null || content.trim() === "") return null;

  const tokens = new Set(
    content
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  );

  const robots: NonNullable<PageMetadata["robots"]> = {};
  if (tokens.has("index")) robots.index = true;
  if (tokens.has("noindex")) robots.index = false;
  if (tokens.has("follow")) robots.follow = true;
  if (tokens.has("nofollow")) robots.follow = false;

  return Object.keys(robots).length > 0 ? robots : null;
}
