import { AutoTypeTable } from 'fumadocs-typescript/ui'
import { packageSrc, typeGenerator } from '@/lib/type-generator'

export function ExtendSeoditExpectTable() {
  return (
    <AutoTypeTable
      path={packageSrc('playwright/index.ts')}
      name="extendSeoditExpect"
      generator={typeGenerator}
    />
  )
}

export function SeoditMatchersTable() {
  return (
    <AutoTypeTable
      path={packageSrc('playwright/index.ts')}
      name="SeoditMatchers"
      generator={typeGenerator}
    />
  )
}

export function SeoIssueTable() {
  return (
    <AutoTypeTable path={packageSrc('types.ts')} name="SeoIssue" generator={typeGenerator} />
  )
}

export function ExpectedValueTable() {
  return (
    <AutoTypeTable
      path={packageSrc('types.ts')}
      name="ExpectedValue"
      generator={typeGenerator}
    />
  )
}

export function AssertCanonicalTable() {
  return (
    <AutoTypeTable
      path={packageSrc('html/assertions.ts')}
      name="assertCanonical"
      generator={typeGenerator}
    />
  )
}

export function AssertMetaTitleTable() {
  return (
    <AutoTypeTable
      path={packageSrc('html/assertions.ts')}
      name="assertMetaTitle"
      generator={typeGenerator}
    />
  )
}

export function AssertJsonLdTypeTable() {
  return (
    <AutoTypeTable
      path={packageSrc('jsonld/index.ts')}
      name="assertJsonLdType"
      generator={typeGenerator}
    />
  )
}
