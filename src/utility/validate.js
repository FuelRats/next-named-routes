import validate, { assert } from '@fuelrats/argument-validator-utils'





export const isDynamicRoute = (route) => typeof route === 'string' && /\/\[[^/]+?\](?=\/|$)/u.test(route)


export const validateRoute = (args) => {
  const validator = validate(args).forClass('Route')

  validator.assert('name').toBeOneOfType('string', 'symbol')
  validator.forObject(args.name, 'Route') // Change identifier since `name` is validated
  validator.assert('href').toBeOneOfType('string', 'function')

  return validator
}

export const validateRouteHelper = (args) => {
  const validator = validate(args).forClass('RouteHelper')

  validator.assert('NextLink').toExist()
  validator.assert('NextRouter').toExist()

  return validator
}


export const validateRouteData = (routeData, routeName) => {
  const routeDataValidator = validate(routeData).forObject(routeName, 'route data for Route')
  routeDataValidator.assert('href').toBeOfType('string')
  routeDataValidator.assert('as').toBeOneOfType('string', 'undefined')

  return routeDataValidator
}


export const makeAssertForRoute = (route) => (name, value) => assert(name, value, route, 'Route')


export const validateResolveRoute = (args, routes) => {
  const assertResolveRoute = validate(args).forFunc('resolveRoute')


  const assertRouteName = assertResolveRoute.assert('routeName')

  assertRouteName.toBeOneOfType('string', 'function')
  assertRouteName.or(() => [
    assertRouteName.toBeKeyOf(routes, 'routes'),
    assertRouteName.toStartWith('/'),
    assertRouteName.toBeOfType('function'),
  ])

  assertResolveRoute.assert('params').toBeOneOfType('object', 'undefined')

  return assertResolveRoute
}
