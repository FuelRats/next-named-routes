/* eslint-disable newline-per-chained-call */
import validate from '@fuelrats/argument-validator-utils'





export const validateRoute = (args) => validate(args)
  .forClass('Route')
  .assert('name').toExist().toBeOfType('string')
  .forObject(args.name, 'Route') // Change identifier since `name` is validated
  .assert('href').toExist().toBeOneOfType('string', 'function')
  .assert('as').toBeOneOfType('string', 'function')

export const validateRouteHelper = (args) => validate(args)
  .forClass('RouteHelper')
  .assert('NextLink').toExist()
  .assert('NextRouter').toExist()
  .assert('routeData').toBeOfType('array')

export const validateResolveRoute = (args, Route) => validate(args)
  .forFunc('resolveRoute')
  .assert('route').toExist().or((value) => [
    value.toBeOneOfType('string', 'function'),
    value.toBeInstanceOf(Route, 'Route'),
  ])
