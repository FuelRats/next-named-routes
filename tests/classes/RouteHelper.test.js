import { ValidationError } from '@fuelrats/argument-validator-utils'
import NextLink from 'next/link'
import * as NextRouter from 'next/router'


import Route from '../../src/classes/Route'
import getRouteHelper from '../../src/classes/RouteHelper'


const testRoutes = {
  'route:static': '/foo/bar',
  'route:dynamic': '/foo/[bar]',
  'route:function': ({ bar, ...query }) => {
    return {
      href: '/foo/[bar]',
      as: `/foo/${bar}`,
      query,
    }
  },
}



const setupRoutes = (routeManifest = testRoutes) => getRouteHelper(NextLink, NextRouter, routeManifest)

const routes = setupRoutes()

describe('RouteHelper', () => {
  describe('.constructor()', () => {
    test('will return object with route components', () => {
      expect(routes).toEqual(expect.objectContaining({
        Link: expect.toBeFunction(),
        Router: expect.toBeObject(),
        useRouter: expect.toBeFunction(),
        withRouter: expect.toBeFunction(),
        resolveRoute: expect.toBeFunction(),
        routes: expect.toBeObject(),
      }))
    })
  })

  describe('.resolveRoute()', () => {
    test('will resolve defined route by name', () => {
      const name = 'route:function'
      const resolvedRoute = routes.resolveRoute(name)

      expect(resolvedRoute).toBeInstanceOf(Route)
      expect(resolvedRoute).toEqual(
        expect.objectContaining({
          name,
          href: testRoutes[name],
        }),
      )
    })

    test('will resolve defined route by matching href', () => {
      const href = '/foo/[bar]'
      const resolvedRoute = routes.resolveRoute(href)

      expect(resolvedRoute).toBeInstanceOf(Route)
      expect(resolvedRoute).toEqual(
        expect.objectContaining({
          name: 'route:dynamic',
          href,
        }),
      )
    })

    test('will generate new route when no defined route exists, but the route is still valid', () => {
      const href = '/foo/bar/[baz]'
      const resolvedRoute = routes.resolveRoute(href)

      expect(resolvedRoute).toBeInstanceOf(Route)
      expect(resolvedRoute).toEqual(
        expect.objectContaining({
          name: 'route',
          href,
        }),
      )
    })


    describe('will throw when', () => {
      test('given an unresolvable name', () => {
        expect(() => {
          routes.resolveRoute('route:invalid')
        }).toThrow(ValidationError)
      })

      test('given an invalid value', () => {
        expect(() => {
          routes.resolveRoute({ foo: 'bar' }) // whoops I passed in params as route!
        }).toThrow(ValidationError)
      })
    })
  })
})
