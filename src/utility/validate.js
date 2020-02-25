import validate from '@fuelrats/argument-validator-utils'





export const isDynamicRoute = (route) => {
  return typeof route === 'string' && /\/\[[^/]+?\](?=\/|$)/u.test(route)
}


export const validateRoute = (args) => {
  const validator = validate(args).forClass('Route')

  validator.assert('name').toBeOfType('string')
  validator.forObject(args.name, 'Route') // Change identifier since `name` is validated
  validator.assert('href').toBeOneOfType('string', 'function')

  return validator
}

export const validateRouteHelper = (args) => {
  const validator = validate(args).forClass('RouteHelper')

  validator.assert('NextLink').toExist()
  validator.assert('NextRouter').toExist()
  validator.assert('routeManifest').toBeOneOfType('object', 'undefined')

  return validator
}


export const validateResolveRoute = (args, routes) => {
  const assertResolveRoute = validate(args).forFunc('resolveRoute')


  const assertRoute = assertResolveRoute.assert('route')

  assertRoute.toBeOneOfType('string', 'function')
  assertRoute.or(() => {
    return [
      assertRoute.toBeKeyOf(routes, 'routes'),
      assertRoute.toStartWith('/'),
      assertRoute.toBeOfType('function'),
    ]
  })

  assertResolveRoute.assert('params').toBeOneOfType('object', 'undefined')

  return assertResolveRoute
}
