import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createFileSystemGeneratorCache,
  createGenerator,
  remarkAutoTypeTable,
} from 'fumadocs-typescript'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

const generator = createGenerator({
  cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
  tsconfigPath: path.join(rootDir, 'packages/seodit/tsconfig.json'),
})

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkAutoTypeTable, { generator }]],
  },
})
