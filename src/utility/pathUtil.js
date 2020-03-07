/* eslint-disable no-restricted-syntax */// C style loop for performance
import { makeAssertForRoute } from './validate'





const segmentRegex = /^\[(\.\.\.)?([^/]+?)\]$/u


const stringifyForPath = (value) => {
  if (typeof value !== 'string') {
    return JSON.stringify(value)
  }
  return value
}

export const getRouteCompiler = (href) => (params) => {
  const assertForRoute = makeAssertForRoute(href)

  const asSegments = href.split('/')
  const query = { ...params }

  for (let segIndex = 1; segIndex < asSegments.length; segIndex += 1) {
    const [isDynamicSegment, isCatchAll, paramName] = asSegments[segIndex].match(segmentRegex) ?? []

    if (isDynamicSegment) {
      const paramValue = query[paramName]
      const assertParam = assertForRoute(paramName, paramValue).toExist()

      if (isCatchAll) {
        assertParam.toBeOfType('array')
        asSegments[segIndex] = paramValue.map(stringifyForPath).join('/')
      } else {
        assertParam.not.toBeOfType('function')
        asSegments[segIndex] = stringifyForPath(paramValue)
      }

      delete query[paramName]
    }
  }

  const as = asSegments.join('/')

  return { href, as, query }
}
