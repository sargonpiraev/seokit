// source.config.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createFileSystemGeneratorCache,
  createGenerator,
  remarkAutoTypeTable
} from "fumadocs-typescript";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
var generator = createGenerator({
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
  tsconfigPath: path.join(rootDir, "packages/seodit/tsconfig.json")
});
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkAutoTypeTable, { generator }]]
  }
});
export {
  source_config_default as default,
  docs
};
