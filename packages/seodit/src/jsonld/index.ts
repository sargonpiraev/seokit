import type { CheerioAPI } from "cheerio";
import type { SeoIssue } from "../types.js";
import { toCheerio, type HtmlInput } from "../html/extract.js";

export interface JsonLdBlock {
  index: number;
  raw: string;
  data: unknown;
}

export interface JsonLdParseError {
  index: number;
  raw: string;
  error: unknown;
}

export interface JsonLdParseResult {
  blocks: JsonLdBlock[];
  errors: JsonLdParseError[];
}

export function parseJsonLdBlocks(input: HtmlInput): JsonLdParseResult {
  const $ = toCheerio(input);
  const blocks: JsonLdBlock[] = [];
  const errors: JsonLdParseError[] = [];

  $('script[type="application/ld+json"]').each((index, element) => {
    const raw = $(element).html()?.trim();
    if (!raw) return;

    try {
      blocks.push({
        index,
        raw,
        data: JSON.parse(raw) as unknown,
      });
    } catch (error) {
      errors.push({ index, raw, error });
    }
  });

  return { blocks, errors };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectTypesFromValue(value: unknown, types: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectTypesFromValue(item, types);
    }
    return;
  }

  if (!isRecord(value)) return;

  const type = value["@type"];
  if (typeof type === "string") {
    types.add(type);
  } else if (Array.isArray(type)) {
    for (const item of type) {
      if (typeof item === "string") {
        types.add(item);
      }
    }
  }

  collectTypesFromValue(value["@graph"], types);
}

export function getJsonLdTypes(input: HtmlInput): string[] {
  const result = parseJsonLdBlocks(input);
  const types = new Set<string>();

  for (const block of result.blocks) {
    collectTypesFromValue(block.data, types);
  }

  return [...types];
}

export function hasJsonLdType(input: HtmlInput, expectedType: string): boolean {
  return getJsonLdTypes(input).includes(expectedType);
}

export function assertValidJsonLd(input: HtmlInput): SeoIssue[] {
  const result = parseJsonLdBlocks(input);

  return result.errors.map((error) => ({
    id: `jsonld.valid.${error.index}`,
    field: "jsonLd",
    selector: 'script[type="application/ld+json"]',
    severity: "error",
    message: `JSON-LD block ${error.index} is not valid JSON`,
    actual: error.raw,
  }));
}

export function assertJsonLdType(input: HtmlInput, expectedType: string): SeoIssue[] {
  const issues = assertValidJsonLd(input);
  if (issues.length > 0) return issues;

  const types = getJsonLdTypes(input);
  if (types.includes(expectedType)) return [];

  return [
    {
      id: `jsonld.type.${expectedType}`,
      field: "jsonLd.type",
      selector: 'script[type="application/ld+json"]',
      severity: "error",
      message: `JSON-LD type "${expectedType}" was not found`,
      expected: expectedType,
      actual: types,
    },
  ];
}

export function getJsonLdBlocksByType(input: HtmlInput, expectedType: string): JsonLdBlock[] {
  const result = parseJsonLdBlocks(input);
  return result.blocks.filter((block) => {
    const types = new Set<string>();
    collectTypesFromValue(block.data, types);
    return types.has(expectedType);
  });
}

export function getJsonLdBlockByType(input: HtmlInput, expectedType: string): JsonLdBlock | undefined {
  return getJsonLdBlocksByType(input, expectedType)[0];
}

export function getJsonLdBlocksFromCheerio($: CheerioAPI): JsonLdBlock[] {
  return parseJsonLdBlocks($).blocks;
}
