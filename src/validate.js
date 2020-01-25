/* eslint-disable newline-per-chained-call */
import validate from '@fuelrats/argument-validator-utils'





const validateRoute = (args) => validate(args)
  .forClass('Route')
  .assert('name').toExist().toBeOfType('string')
  .assert('href').toExist().toBeOneOfType('string', 'function')
  .assert('as').toBeOneOfType('string', 'function')

const validateRouteHelper = (args) => validate(args)
  .forClass('RouteHelper')
  .assert('NextLink').toExist()
  .assert('NextRouter').toExist()

const validateResolveRoute = (args) => validate(args)
  .forFunc('resolveRoute')
  .assert('route').toExist().toBeOneOfType('string', 'object', 'function')





export {
  validateRoute,
  validateRouteHelper,
  validateResolveRoute,
}
