import defaultMdxComponents from 'fumadocs-ui/mdx'
import {
  AssertCanonicalTable,
  AssertJsonLdTypeTable,
  AssertMetaTitleTable,
  ExpectedValueTable,
  ExtendSeoditExpectTable,
  SeoditMatchersTable,
  SeoIssueTable,
} from '@/components/api-reference'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ExtendSeoditExpectTable,
    SeoditMatchersTable,
    SeoIssueTable,
    ExpectedValueTable,
    AssertCanonicalTable,
    AssertMetaTitleTable,
    AssertJsonLdTypeTable,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
