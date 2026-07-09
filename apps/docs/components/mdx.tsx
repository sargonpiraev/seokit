import defaultMdxComponents from 'fumadocs-ui/mdx'
import { MatcherDoc } from '@/components/matcher-doc'
import { MatcherIndex } from '@/components/matcher-index'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    MatcherDoc,
    MatcherIndex,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
