export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof RegExp) return String(value);
  return JSON.stringify(value);
}

/** Leaf match: exact string, RegExp, or deep-partial for objects/arrays. */
export function matchesExpected(actual: unknown, expected: unknown): boolean {
  if (expected instanceof RegExp) {
    return typeof actual === "string" && expected.test(actual);
  }

  if (expected === actual) return true;

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return false;
    return expected.every((expectedItem) =>
      actual.some((actualItem) => matchesExpected(actualItem, expectedItem)),
    );
  }

  if (!isRecord(expected)) return expected === actual;
  if (!isRecord(actual)) return false;

  return Object.entries(expected).every(([key, value]) => {
    if (value === undefined) return true;
    if (!(key in actual)) return false;
    return matchesExpected(actual[key], value);
  });
}

export type MatchDiff = {
  path: string;
  expected: unknown;
  actual: unknown;
};

/** Collect leaf mismatches for a readable failure message. */
export function collectMatchDiffs(
  actual: unknown,
  expected: unknown,
  path = "",
): MatchDiff[] {
  if (expected instanceof RegExp) {
    if (typeof actual === "string" && expected.test(actual)) return [];
    return [{ path: path || "(root)", expected, actual }];
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return [{ path: path || "(root)", expected, actual }];
    }
    const diffs: MatchDiff[] = [];
    for (let i = 0; i < expected.length; i++) {
      const item = expected[i];
      const found = actual.some((actualItem) => matchesExpected(actualItem, item));
      if (!found) {
        diffs.push({
          path: path ? `${path}[${i}]` : `[${i}]`,
          expected: item,
          actual,
        });
      }
    }
    return diffs;
  }

  if (!isRecord(expected)) {
    if (expected === actual) return [];
    return [{ path: path || "(root)", expected, actual }];
  }

  if (!isRecord(actual)) {
    return [{ path: path || "(root)", expected, actual }];
  }

  const diffs: MatchDiff[] = [];
  for (const [key, value] of Object.entries(expected)) {
    if (value === undefined) continue;
    const nextPath = path ? `${path}.${key}` : key;
    if (!(key in actual)) {
      diffs.push({ path: nextPath, expected: value, actual: undefined });
      continue;
    }
    diffs.push(...collectMatchDiffs(actual[key], value, nextPath));
  }
  return diffs;
}

export function formatMatchDiffs(diffs: MatchDiff[]): string {
  return diffs
    .map(
      (diff) =>
        `  - ${diff.path}: expected ${formatValue(diff.expected)}, got ${formatValue(diff.actual)}`,
    )
    .join("\n");
}
