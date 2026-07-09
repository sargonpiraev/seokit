import { rehypeCode } from 'fumadocs-core/mdx-plugins/rehype-code'
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import * as JsxRuntime from 'react/jsx-runtime'

const processor = remark().use(remarkGfm).use(remarkRehype).use(rehypeCode, {
  langs: ['ts', 'tsx', 'html'],
})

export async function renderMarkdownToJsx(markdown: string) {
  const hast = await processor.run(
    processor.parse(markdown.replace(/{@link ([^}]*)}/g, '$1')),
  )

  return toJsxRuntime(hast, {
    ...JsxRuntime,
    components: {
      ...defaultMdxComponents,
      img: undefined,
    },
  })
}
