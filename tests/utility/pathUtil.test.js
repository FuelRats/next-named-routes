import { ValidationError } from '@fuelrats/argument-validator-utils'
import { compileRoute } from '../../src/utility/pathUtil'





describe('compileRoute', () => {
  let href = null
  let params = null
  let result = null

  beforeEach(() => {
    result = compileRoute(href, params)
  })

  describe('when given a simple dynamic route and it\'s sole parameter', () => {
    beforeAll(() => {
      href = '/foo/[bar]'
      params = { bar: 'foobar' }
    })

    test('will return the `href` path back in it\'s response.', () => {
      expect(result.href).toBe(href)
    })

    test('will return the compiled `as` path in it\'s reponse.', () => {
      expect(result.as).toBe('/foo/foobar')
    })

    test('will not return the route parameter as a query param.', () => {
      expect(result.query).toBeEmpty()
    })
  })

  describe('when given a catchAll dynamic route', () => {
    beforeAll(() => {
      href = '/foo/[...bar]'
      params = { bar: ['foobar', 'barbiz'] }
    })

    test('will detect and expand the catchAll', () => {
      expect(result.as).toBe('/foo/foobar/barbiz')
    })

    test('will not return the catchAll parameter as a query param', () => {
      expect(result.query).toBeEmpty()
    })
  })

  describe('when given extra parameters', () => {
    beforeAll(() => {
      href = '/foo/[bar]'
      params = { bar: 'foobar', baz: 'foobarbaz' }
    })

    test('will return unused parameters as query params.', () => {
      expect(result.query).toContainEntry(['baz', 'foobarbaz'])
    })

    test('will not return used parameters as query params.', () => {
      expect(result.query).not.toContainKey('bar')
    })
  })

  describe('when given an object as a parameter', () => {
    beforeAll(() => {
      href = '/foo/[bar]'
      params = { bar: { baz: 'buzz' } }
    })

    test('will stringify the object.', () => {
      expect(result.as).toBe('/foo/{"baz":"buzz"}')
    })
  })

  describe('will throw an error when', () => {
    test('a property required to compile the route is missing.', () => {
      expect(() => {
        compileRoute('/foo/[bar]', {})
      }).toThrow(ValidationError)
    })

    test('a property consumed by a catchAll route is not an array of values.', () => {
      expect(() => {
        compileRoute('/foo/[...bar]', { bar: 'foobar' })
      }).toThrow(ValidationError)
    })

    test('a property consumed by a dynamic route is a function.', () => {
      expect(() => {
        compileRoute('/foo/[bar]', { bar: () => {} })
      }).toThrow(ValidationError)
    })
  })
})
