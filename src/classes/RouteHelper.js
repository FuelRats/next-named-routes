import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'





import {
  validateResolveRoute,
  validateRouteHelper,
} from '../utility/validate'
import Route from './Route'


const wrapRouter = (target, resolveRoute) => {
  const wrapMethod = (method) => {
    return (route, params, ...restArgs) => {
      const { href, as } = resolveRoute(route, params)

      return target[method](href, as, ...restArgs)
    }
  }

  target.pushRoute = wrapMethod('push')
  target.replaceRoute = wrapMethod('replace')
  target.prefetchRoute = wrapMethod('prefetch')

  return target
}


const routes = (NextLink, NextRouter, routeManifest) => {
  return new (class RouteHelper {
    useRouter = () => {
      return wrapRouter(NextRouter.useRouter(), this.resolveRoute)
    }

    withRouter = (Component) => {
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

    Link = (props) => {
      const {
        route,
        params,
        children,
        ...linkProps
      } = props
      let routeData = {}

      if (route) {
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

    Router = wrapRouter(NextRouter.default, this.resolveRoute)

    constructor () {
      validateRouteHelper({ NextLink, NextRouter, routeManifest })
      this.setRoutes(routeManifest)
    }

    add (name, href) {
      if (this.routes[name]) {
        throw new Error(`Route "${name}" already exists!`)
      }

      this.routes[name] = new Route(name, href)

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

    resolveRoute (route, params) {
      validateResolveRoute({ route, params })

      if (this.routes[route]) {
        return this.routes[route].getRouteData(params)
      }

      return (new Route('route', route)).getRouteData(params)
    }
  })()
}





export default routes
