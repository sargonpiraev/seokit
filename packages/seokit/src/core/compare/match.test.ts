import { collectMatchDiffs, matchesExpected } from './match.js'
import { matchJsonLd } from '../jsonld/match.js'
import { parseRobotsContent } from '../metadata/parse-robots.js'

test('matchesExpected deep-partial and RegExp', () => {
  expect(matchesExpected({ a: 1, b: 2 }, { a: 1 })).toBe(true)
  expect(matchesExpected('hello', /hel/)).toBe(true)
  expect(matchesExpected('hello', /x/)).toBe(false)
})

test('collectMatchDiffs reports missing leaves', () => {
  const diffs = collectMatchDiffs(
    { title: 'A', alternates: { canonical: '/a' } },
    { title: 'B', alternates: { canonical: 'https://example.com/a' } }
  )
  expect(diffs.some((diff) => diff.path === 'title')).toBe(true)
  expect(diffs.some((diff) => diff.path === 'alternates.canonical')).toBe(true)
})

test('parseRobotsContent', () => {
  expect(parseRobotsContent('index, follow')).toEqual({ index: true, follow: true })
  expect(parseRobotsContent('noindex')).toEqual({ index: false })
  expect(parseRobotsContent(null)).toBeNull()
})

test('matchJsonLd type and deep-partial', () => {
  const scripts = [
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Acme',
    }),
  ]
  expect(matchJsonLd(scripts, 'Organization').pass).toBe(true)
  expect(matchJsonLd(scripts, [{ '@type': 'Organization', name: 'Acme' }]).pass).toBe(true)
  expect(matchJsonLd(scripts, 'Product').pass).toBe(false)
})
