import { getRouteCompiler } from '../utility/pathUtil'
import { isDynamicRoute, validateRoute, validateRouteData } from '../utility/validate'





export default class Route {
  constructor (name, href) {
    validateRoute({ name, href })
    this.name = name
    this.href = href

    if (isDynamicRoute(href)) {
      this.compileFromParams = getRouteCompiler(href)
    } else if (typeof href === 'function') {
      this.compileFromParams = this.href
    }
  }

  getRouteData (params = {}) {
    let response = { href: this.href }
    let query = null

    if (this.compileFromParams) {
      ({ query, ...response } = this.compileFromParams(params))
    } else {
      query = { ...params }
    }

    validateRouteData(response, this.name)

    if (query) {
      response.href = { pathname: response.href, query }
      if (response.as) {
        response.as = { pathname: response.as, query }
      }
    }

    return response
  }
}
