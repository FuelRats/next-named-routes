import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'





import {
  validateResolveRoute,
  validateRouteHelper,
} from '../utility/validate'
import Route from './Route'





const wrapRouter = (target, resolveRoute) => {
  const wrapMethod = (method) => (route, params, ...restArgs) => {
    const { href, as } = resolveRoute(route, params).getRouteData(params)

    return target[method](href, as, ...restArgs)
  }

  target.pushRoute = wrapMethod('push')
  target.replaceRoute = wrapMethod('replace')
  target.prefetchRoute = wrapMethod('prefetch')

  return target
}





const routes = (NextLink, NextRouter, routeManifest) => new (class RouteHelper {
  useRouter = () => wrapRouter(NextRouter.useRouter(), this.resolveRoute.bind(this))

  withRouter = (Component) => hoistNonReactStatics(
    ({ children, ...props }) => React.createElement(
      Component,
      { ...props, router: this.Router },
      children,
    ),
    Component,
  )

  Link = (props) => {
    const {
      route,
      params,
      children,
      ...linkProps
    } = props
    let routeData = {}

    if (route) {
      routeData = this.resolveRoute(route).getRouteData(params)
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

  Router = wrapRouter(NextRouter.default, this.resolveRoute.bind(this))

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

  resolveRoute (routeName) {
    validateResolveRoute({ routeName }, this.routes)

    return this.routes[routeName]
        ?? Object.values(this.routes).find((route) => route.href === routeName)
        ?? new Route('route', routeName)
  }
})()





export default routes
