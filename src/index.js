/* eslint-disable import/no-extraneous-dependencies */// Peer Dependencies
import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import NextLink from 'next/link'
import NextRouter, {
  useRouter as useNextRouter,
} from 'next/router'




class Route {
  constructor (name, href, as) {
    if (typeof name !== 'string'
        || (typeof href !== 'string' && typeof href !== 'function')
        || (as && (typeof as !== 'string' && typeof as !== 'function'))
    ) {
      throw new TypeError(`Invalid arguments for route: "${name}"`)
    }

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





class RouteHelper {
  constructor () {
    this.routes = {}
    this.Route = Route
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

  getLink = (LinkComp = NextLink) => ({
    route,
    params,
    children,
    ...linkProps
  }) => {
    let routeData = {}

    if (route) {
      routeData = this.resolveRoute(route, params)
    }

    return (
      <LinkComp {...linkProps} {...routeData}>
        {children}
      </LinkComp>
    )
  }

  getRouter (target = NextRouter) {
    const wrapMethod = (method) => (route, params, ...restArgs) => {
      const { href, as } = this.resolveRoute(route, params)

      return target[method](href, as, ...restArgs)
    }

    target.pushRoute = wrapMethod('push')
    target.replaceRoute = wrapMethod('replace')
    target.prefetchRoute = wrapMethod('prefetch')

    return target
  }

  getUseRouter () {
    return () => this.getRouter(useNextRouter())
  }

  getWithRouter () {
    return (Component) => hoistNonReactStatics((props) => (
      <Component {...props} router={this.Router} />
    ), Component)
  }

  resolveRoute (route, params) {
    switch (typeof route) {
      case 'string':
        if (this.routes[route]) {
          return this.routes[route].getRouteData(params)
        }
        if (route.startsWith('/')) {
          return { href: route, as: route }
        }
        throw new Error(`Route name "${route}" is an invalid route.`)

      case 'object':
        if (route instanceof Route) {
          return route.getRouteData(params)
        }
        throw new Error('Route objects must be an instance of Route')

      case 'function':
        return route(params)

      default:
        throw new TypeError(`Route must be of type "[string]", "[object]", or "[function]". Got "[${typeof route}]".`)
    }
  }
}





module.exports = (...opts) => new RouteHelper(...opts)
