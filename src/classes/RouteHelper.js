import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'




import {
  validateResolveRoute,
  validateRouteHelper,
} from '../utility/validate'
import Route from './Route'





const routes = (NextLink, NextRouter, routeManifest) => {
  return new (class RouteHelper {
    constructor () {
      validateRouteHelper({ NextLink, NextRouter, routeManifest })

      this.setRoutes(routeManifest)

      this.Link = this.getLink()
      this.Router = this.getRouter()
      this.useRouter = this.getUseRouter()
      this.withRouter = this.getWithRouter()
    }

    add (name, href, as) {
      if (this.routes[name]) {
        throw new Error(`Route "${name}" already exists!`)
      }

      this.routes[name] = new Route(name, href, as)

      return this
    }

    setRoutes (newManifest = {}) {
      this.routes = Object.entries(newManifest).reduce(
        (acc, [routeName, routeHref]) => {
          acc[routeName] = new Route(routeName, routeHref)
          return acc
        },
        {},
      )

      return this
    }

    getLink = () => {
      return (props) => {
        const {
          route,
          params,
          children,
          ...linkProps
        } = props
        let routeData = {}

        if (route) {
        /* eslint-disable-next-line react/no-this-in-sfc */// this is the way
          routeData = this.resolveRoute(route, params)
        }

        return React.createElement(
          NextLink,
          {
            ...linkProps,
            ...routeData,
          },
          children,
        )
      }
    }

    getRouter () {
      const Router = NextRouter.default

      const wrapMethod = (method) => {
        return (route, params, ...restArgs) => {
          const { href, as } = this.resolveRoute(route, params)

          return Router[method](href, as, ...restArgs)
        }
      }

      Router.pushRoute = wrapMethod('push')
      Router.replaceRoute = wrapMethod('replace')
      Router.prefetchRoute = wrapMethod('prefetch')

      return Router
    }

    getUseRouter () {
      return () => {
        return this.getRouter(NextRouter.useRouter())
      }
    }

    getWithRouter () {
      return (Component) => {
        return hoistNonReactStatics(
          ({ children, ...props }) => {
            return React.createElement(
              Component,
              { ...props, router: this.Router },
              children,
            )
          },
          Component,
        )
      }
    }

    resolveRoute (route, params) {
      const validator = validateResolveRoute({ route }, Route)

      switch (typeof route) {
        case 'string':
          if (this.routes[route]) {
            return this.routes[route].getRouteData(params)
          }

          if (route.startsWith('/')) {
            return { href: route, as: route }
          }

          validator.assert('route').throwCustom('to be member of `routes` or a valid path name', route)
          break

        case 'object':
          validator.assert('route').toBeInstaceOf(Route)
          return route.getRouteData(params)

        case 'function':
          return route(params)

        default:
          break
      }

      return null
    }
  })()
}





export default routes
