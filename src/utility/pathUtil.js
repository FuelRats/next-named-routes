/* eslint-disable no-restricted-syntax */// C style loop for performance
import validate from '@fuelrats/argument-validator-utils'





const segmentRegex = /^\[(\.\.\.)?([^/]+?)\]$/u


const stringifyForPath = (value) => {
  if (typeof value !== 'string') {
    return JSON.stringify(value)
  }
  return value
}

export const getRouteCompiler = (href) => (params) => {
  const validator = validate(params).forObject(href, 'Route')

  const asSegments = href.split('/')
  const query = { ...params }

  for (let segIndex = 1; segIndex < asSegments.length; segIndex += 1) {
    const [isDynamicSegment, isCatchAll, paramName] = asSegments[segIndex].match(segmentRegex) ?? []

    if (isDynamicSegment) {
      const paramValue = query[paramName]
      const assertCurrentParam = validator.assert(paramName).toExist()

      if (isCatchAll) {
        assertCurrentParam.toBeOfType('array')
        asSegments[segIndex] = paramValue.map(stringifyForPath).join('/')
      } else {
        assertCurrentParam.not.toBeOfType('function')
        asSegments[segIndex] = stringifyForPath(paramValue)
      }

      delete query[paramName]
    }
  }

  const as = asSegments.join('/')

  return { href, as, query }
}
