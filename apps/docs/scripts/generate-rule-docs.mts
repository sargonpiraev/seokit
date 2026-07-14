import { rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Legacy rule pages removed — matchers are documented in content/docs/matchers.mdx */
const contentRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../content/docs/rules')
rmSync(contentRoot, { recursive: true, force: true })
console.log('Removed legacy rule docs directory (matchers live in content/docs/matchers.mdx)')
