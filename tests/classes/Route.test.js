import { ValidationError } from '@fuelrats/validation-util'
import Route from '../../src/classes/Route'


const dynamicRouteQueryShape = expect.objectContaining({
  biz: expect.stringMatching('buzz'),
})

const dynamicRouteHrefShape = expect.objectContaining({
  pathname: expect.stringMatching(/\/foo\/\[bar\]/u),
  query: dynamicRouteQueryShape,
})

const dynamicRouteAsShape = expect.objectContaining({
  pathname: expect.stringMatching('/foo/baz'),
  query: dynamicRouteQueryShape,
})





describe('Route', () => {
  const name = 'route'
  let href = null
  let route = null

  const setupRoute = (_name = name, _href = href) => {
    route = new Route(_name, _href)
  }
  beforeEach(setupRoute)

  describe('when provided a basic name and href', () => {
    beforeAll(() => {
      href = '/foo/bar'
    })
    test('will contain the provided info', () => {
      expect(route.name).toBe(name)
      expect(route.href).toBe(href)
    })

    test('will generate route data with given parameters', () => {
      const routeData = route.getRouteData({})

      expect(routeData.href).toEqual(expect.objectContaining({
        pathname: expect.stringMatching('/foo/bar'),
      }))
      expect(routeData.href.query).toBeEmpty()
      expect(routeData.as).toBeUndefined()
    })
  })

  describe('when provided a dynamic route', () => {
    beforeAll(() => {
      href = '/foo/[bar]'
    })

    test('will generate dynamic route data with the given parameters', () => {
      const routeData = route.getRouteData({ bar: 'baz', biz: 'buzz' })

      expect(routeData.href).toEqual(dynamicRouteHrefShape)
      expect(routeData.as).toEqual(dynamicRouteAsShape)
    })
  })

  describe('when provided a function route', () => {
    beforeAll(() => {
      href = ({ bar, ...query }) => {
        return {
          href: '/foo/[bar]',
          as: `/foo/${bar}`,
          query,
        }
      }
    })

    test('will generate route data from the result of the route function', () => {
      const routeData = route.getRouteData({ bar: 'baz', biz: 'buzz' })

      expect(routeData.href).toEqual(dynamicRouteHrefShape)
      expect(routeData.as).toEqual(dynamicRouteAsShape)
    })

    test('will throw when function returns invalid href', () => {
      setupRoute(undefined, () => {
        return {
          href: () => {},
          as: 'herp',
        }
      })

      expect(() => {
        route.getRouteData({})
      }).toThrowWithMessage(ValidationError, 'Expected argument `href` of route data for Route `route` to be of type `string`, but got `function` instead.')
    })

    test('will throw when function returns invalid as', () => {
      setupRoute(undefined, () => {
        return {
          href: '/hello',
          as: () => {},
        }
      })

      expect(() => {
        route.getRouteData({})
      }).toThrowWithMessage(ValidationError, 'Expected argument `as` of route data for Route `route` to be one of type [ `string`, `undefined` ], but got `function` instead.')
    })
  })
})
