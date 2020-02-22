import { compileRoute } from '../utility/pathUtil'
import { isDynamicRoute, validateRoute } from '../utility/validate'





export default class Route {
  constructor (name, href) {
    validateRoute({ name, href })
    this.name = name
    this.href = href
  }

  getRouteData (params = {}) {
    let { href } = this
    let as = undefined
    let query = undefined

    if (typeof href === 'function') {
      ({ href, as, query } = href(params))
    } else if (isDynamicRoute(href)) {
      ({ href, as, query } = compileRoute(href, params))
    } else {
      query = { ...params }
    }

    if (query) {
      href = { pathname: href, query }
      if (as) {
        as = { pathname: as, query }
      }
    }

    return { href, as }
  }
}
