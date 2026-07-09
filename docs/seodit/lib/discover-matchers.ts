import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type DocumentedMatcher = {
  slug: string
  title: string
  matcher: string
  path: string
}

const packageSrc = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../packages/seodit/src')
const matchersRoot = path.join(packageSrc, 'matchers')

function normalizeDocComment(doc: string): string {
  return doc
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim()
}

function getMatcherDoc(source: string, name: string) {
  const match = source.match(
    new RegExp(`/\\*\\*([\\s\\S]*?)\\*/\\s*export (?:async )?function ${name}\\b`),
  )

  return normalizeDocComment(match?.[1]?.trim() ?? '')
}

export function extractMatcherDoc(source: string, name: string): string {
  return getMatcherDoc(source, name)
}

export function extractMatcherTitle(source: string, name: string): string {
  const doc = getMatcherDoc(source, name)
  const intro = doc.split(/^## /m)[0]?.trim() ?? ''
  const lines = intro
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)

  return lines[0] ?? name
}

export function extractMatcherSummary(description: string): string {
  const intro = description.split(/^## /m)[0]?.trim() ?? ''
  const paragraphs = intro.split(/\n\n+/).map((value) => value.trim()).filter(Boolean)
  const summary = paragraphs[1] ?? paragraphs[0] ?? intro
  return summary.replace(/\s+/g, ' ')
}

export function discoverDocumentedMatchers(): DocumentedMatcher[] {
  const results: DocumentedMatcher[] = []

  for (const file of readdirSync(matchersRoot)) {
    if (!file.startsWith('to-have-') || !file.endsWith('.ts')) continue
    if (file.endsWith('.test.ts')) continue

    const stem = file.replace(/\.ts$/, '')
    const relativePath = `matchers/${stem}.ts`
    const source = readFileSync(path.join(matchersRoot, file), 'utf-8')
    const matcher = source.match(/export (?:async )?function (toHave\w+)/)?.[1]
    if (!matcher) continue

    results.push({
      slug: stem,
      title: extractMatcherTitle(source, matcher),
      matcher,
      path: relativePath,
    })
  }

  return results.sort((left, right) => left.slug.localeCompare(right.slug))
}

export const documentedMatchers = discoverDocumentedMatchers()
