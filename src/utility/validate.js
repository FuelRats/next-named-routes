/* eslint-disable newline-per-chained-call */
import validate from '@fuelrats/argument-validator-utils'


export const isDynamicRoute = (route) => {
  return typeof route === 'string' && /\/\[[^/]+?\](?=\/|$)/u.test(route)
}

export const validateRoute = (args) => {
  const validator = validate(args).forClass('Route')

  validator.assert('name').toExist().toBeOfType('string')
  validator.forObject(args.name, 'Route') // Change identifier since `name` is validated
  validator.assert('href').toExist().toBeOneOfType('string', 'function')

  return validator
}

export const validateRouteHelper = (args) => {
  const validator = validate(args).forClass('RouteHelper')

  validator.assert('NextLink').toExist()
  validator.assert('NextRouter').toExist()
  validator.assert('routeManifest').toBeOfType('object')

  return validator
}

export const validateResolveRoute = (args, Route) => {
  const validator = validate(args).forFunc('resolveRoute')
  validator.assert('route').toExist().or((value) => {
    return [
      value.toBeOneOfType('string', 'function'),
      value.toBeInstanceOf(Route, 'Route'),
    ]
  })

  return validator
}
