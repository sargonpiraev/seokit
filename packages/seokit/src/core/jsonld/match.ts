import { collectMatchDiffs, formatMatchDiffs, isRecord, matchesExpected } from "../compare/match.js";

export type JsonLdExpected =
  | string
  | Record<string, unknown>
  | Array<string | Record<string, unknown>>;

function collectCandidates(data: unknown): Record<string, unknown>[] {
  const candidates: Record<string, unknown>[] = [];

  function visit(value: unknown): void {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!isRecord(value)) return;
    candidates.push(value);
    visit(value["@graph"]);
  }

  visit(data);
  return candidates;
}

export function parseJsonLdScripts(scripts: string[]): Record<string, unknown>[] {
  const candidates: Record<string, unknown>[] = [];
  for (const text of scripts) {
    if (!text.trim()) continue;
    candidates.push(...collectCandidates(JSON.parse(text)));
  }
  return candidates;
}

function matchesTypeOrObject(
  candidates: Record<string, unknown>[],
  item: string | Record<string, unknown>,
): boolean {
  if (typeof item === "string") {
    return candidates.some((candidate) => {
      const type = candidate["@type"];
      if (typeof type === "string") return type === item;
      if (Array.isArray(type)) return type.includes(item);
      return false;
    });
  }
  return candidates.some((candidate) => matchesExpected(candidate, item));
}

export function matchJsonLd(
  scripts: string[],
  expected: JsonLdExpected,
): { pass: boolean; message: string } {
  const candidates = parseJsonLdScripts(scripts);
  const items = Array.isArray(expected) ? expected : [expected];

  if (items.length === 0) {
    return candidates.length > 0
      ? { pass: true, message: "" }
      : { pass: false, message: "expected at least one JSON-LD entity, got none" };
  }

  const missing = items.filter((item) => !matchesTypeOrObject(candidates, item));
  if (missing.length === 0) return { pass: true, message: "" };

  const diffs = collectMatchDiffs(candidates, missing);
  return {
    pass: false,
    message: `JSON-LD mismatch:\n${formatMatchDiffs(diffs.length > 0 ? diffs : [{ path: "jsonLd", expected: missing, actual: candidates }])}`,
  };
}
