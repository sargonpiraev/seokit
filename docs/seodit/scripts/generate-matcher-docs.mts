import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  documentedMatchers,
  extractMatcherDoc,
  extractMatcherSummary,
  type DocumentedMatcher,
} from '../lib/discover-matchers.js'

const docsRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(docsRoot, 'content/docs/matchers')
const packageSrc = path.join(docsRoot, '../../packages/seodit/src')

function readMatcherSource(entry: DocumentedMatcher) {
  return readFileSync(path.join(packageSrc, entry.path), 'utf-8')
}

function yamlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`
}

function writeMatcherPage(entry: DocumentedMatcher) {
  const source = readMatcherSource(entry)
  const doc = extractMatcherDoc(source, entry.matcher)
  const description = extractMatcherSummary(doc)
  const outFile = path.join(contentRoot, `${entry.slug}.mdx`)

  mkdirSync(contentRoot, { recursive: true })

  const body = `---
title: ${yamlString(entry.title)}
description: ${yamlString(description)}
---

{/* generated from packages/seodit/src/${entry.path} */}

<MatcherDoc name="${entry.matcher}" path="${entry.path}" />
`

  writeFileSync(outFile, body)
}

const pages = ['index', ...documentedMatchers.map((entry) => entry.slug)]

writeFileSync(
  path.join(contentRoot, 'meta.json'),
  `${JSON.stringify({ title: 'Matchers', pages }, null, 2)}\n`,
)

for (const entry of documentedMatchers) {
  writeMatcherPage(entry)
}

console.log(`Generated ${documentedMatchers.length} matcher docs pages`)
