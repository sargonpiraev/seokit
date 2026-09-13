import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifestKeyToRoutePattern, readNextPageRoutes, specFileToManifestKey } from './manifest.js'
import { createSeokitPageRoutes } from './routes.js'
import { checkSeokitSpecCoverage } from './coverage.js'
import { assertSeokitRouteBasics, type SeokitRouteBasicsExpect } from './assertions.js'

const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__')
const routing = {
  locales: ['en', 'ru'],
  defaultLocale: 'en',
} as const

describe('next manifest helpers', () => {
  it('maps colocated spec files to manifest keys', () => {
    const key = specFileToManifestKey('/project/src/app/[locale]/products/page.spec.ts')
    expect(key).toBe('/[locale]/products/page')
    expect(manifestKeyToRoutePattern(key!)).toBe('/[locale]/products')
    const seoKey = specFileToManifestKey('/project/src/app/[locale]/products/page.seo.spec.ts')
    expect(seoKey).toBe('/[locale]/products/page')
  })

  it('reads page routes from Next build manifest', () => {
    const routes = readNextPageRoutes({ buildDir: fixtureDir })
    expect(routes).toEqual(['/', '/[locale]', '/[locale]/products', '/[locale]/products/[id]'])
  })
})

describe('createSeokitPageRoutes', () => {
  it('expands locales for static localized routes', () => {
    const specUrl = new URL(
      './__fixtures__/project/src/app/[locale]/products/page.seokit.spec.ts',
      import.meta.url
    )
    const routes = createSeokitPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      origin: 'http://localhost:3000',
    })

    expect(routes.map((route) => route.pathname)).toEqual(['/en/products', '/ru/products'])
    expect(routes[0]?.absoluteUrl()).toBe('http://localhost:3000/en/products')
    expect(routes[0]?.alternates()).toEqual([
      { locale: 'en', url: 'http://localhost:3000/en/products' },
      { locale: 'ru', url: 'http://localhost:3000/ru/products' },
    ])
    expect(routes[0]?.xDefaultUrl()).toBe('http://localhost:3000/en/products')
  })

  it('applies dynamic params for localized detail routes', () => {
    const specUrl = new URL(
      './__fixtures__/project/src/app/[locale]/products/[id]/page.seokit.spec.ts',
      import.meta.url
    )
    const routes = createSeokitPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      params: [{ id: 'alpha' }],
    })

    expect(routes.map((route) => route.pathname)).toEqual([
      '/en/products/alpha',
      '/ru/products/alpha',
    ])
  })

  it('asserts route basics with canonical and hreflang alternates', async () => {
    const specUrl = new URL(
      './__fixtures__/project/src/app/[locale]/products/page.seokit.spec.ts',
      import.meta.url
    )
    const [route] = createSeokitPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      origin: 'http://localhost:3000',
    })
    const calls: unknown[] = []
    const expectFn: SeokitRouteBasicsExpect = () => ({
      async toHaveMetadata(expected) {
        calls.push(expected)
      },
    })

    await assertSeokitRouteBasics(expectFn, {} as never, route!)

    expect(calls).toEqual([
      {
        lang: 'en',
        alternates: {
          canonical: 'http://localhost:3000/en/products',
          languages: {
            'x-default': 'http://localhost:3000/en/products',
            en: 'http://localhost:3000/en/products',
            ru: 'http://localhost:3000/ru/products',
          },
        },
      },
    ])
  })
})

describe('checkSeokitSpecCoverage', () => {
  it('warns when manifest routes are missing colocated specs', () => {
    const projectRoot = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '__fixtures__',
      'project'
    )
    const result = checkSeokitSpecCoverage({
      projectRoot,
      buildDir: fixtureDir,
    })

    expect(result.missingSpecs).toContain('/[locale]')
    expect(result.warnings.some((warning) => warning.includes('/[locale]'))).toBe(true)
  })
})
