import NextLink from 'next/link'
import * as NextRouter from 'next/router'


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

let routes = null

const setupRoutes = (routeManifest = testRoutes) => {
  routes = getRouteHelper(NextLink, NextRouter, routeManifest)
}

describe('RouteHelper', () => {
  describe('when given a basic valid input', () => {
    beforeAll(() => {
      setupRoutes()
    })

    test('will return object with route components', () => {
      expect(routes).toEqual(expect.objectContaining({
        Link: expect.toBeFunction(),
        Router: expect.toBeObject(),
        useRouter: expect.toBeFunction(),
        withRouter: expect.toBeFunction(),
        routes: expect.toBeObject(),
      }))
    })
  })
})
