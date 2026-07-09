import {
  createFileSystemGeneratorCache,
  createGenerator,
} from 'fumadocs-typescript'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export const typeGenerator = createGenerator({
  cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
  tsconfigPath: path.join(rootDir, 'packages/seodit/tsconfig.json'),
})

export const packageSrc = (file: string) => path.join(rootDir, 'packages/seodit/src', file)
