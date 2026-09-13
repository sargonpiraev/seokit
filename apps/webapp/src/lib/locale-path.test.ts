import { switchLocalePath } from './locale-path.js'

test('switchLocalePath keeps the current route', () => {
  expect(switchLocalePath('/en/pokemon/charmander', 'de')).toBe('/de/pokemon/charmander')
  expect(switchLocalePath('/fr/pokemon', 'de')).toBe('/de/pokemon')
  expect(switchLocalePath('/de', 'en')).toBe('/en')
})
