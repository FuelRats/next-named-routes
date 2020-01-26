import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'
import { validateRoute, validateRouteHelper, validateResolveRoute } from './validate'





class Route {
  constructor (name, href, as) {
    validateRoute({ name, href, as })

    this.name = name
    this.href = href
    this.as = as
  }

  getRouteData (params = {}) {
    let as = null

    const href = typeof this.href === 'function' ? this.href(params) : this.href
    if (typeof href === 'object' && typeof href.href === 'string') {
      return href
    }

    if (typeof href === 'string') {
      as = (typeof this.as === 'function' ? this.as(params) : this.as)
      if (!as || typeof as === 'string') {
        return {
          href,
          as,
        }
      }
    }

    throw new Error(`Unable to calculate route data for route ${this.name}. href was: ${href}. as was: ${as}`)
  }
}





const routes = (NextLink, NextRouter) => new (class RouteHelper {
  constructor () {
    validateRouteHelper({ NextLink, NextRouter })

    this.routes = {}
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

  getLink = () => ({
    route,
    params,
    children,
    ...linkProps
  }) => {
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

  getRouter () {
    const Router = NextRouter.default

    const wrapMethod = (method) => (route, params, ...restArgs) => {
      const { href, as } = this.resolveRoute(route, params)

      return Router[method](href, as, ...restArgs)
    }

    Router.pushRoute = wrapMethod('push')
    Router.replaceRoute = wrapMethod('replace')
    Router.prefetchRoute = wrapMethod('prefetch')

    return Router
  }

  getUseRouter () {
    return () => this.getRouter(NextRouter.useRouter())
  }

  getWithRouter () {
    return (Component) => hoistNonReactStatics(
      ({ children, ...props }) => React.createElement(
        Component,
        { ...props, router: this.Router },
        children,
      ),
      Component,
    )
  }

  resolveRoute (route, params) {
    const validator = validateResolveRoute({ route })

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





export default routes
export {
  Route,
}
