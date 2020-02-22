import {
  isDynamicRoute,
} from '../../src/utility/validate'





describe('isDynamicRoute', () => {
  test('will be `true` when route contains a dynamic route segment', () => {
    const result = isDynamicRoute('/foo/[bar]')
    expect(result).toBe(true)
  })

  test('will be `true` when route contains a catchAll dynamic route segment', () => {
    const result = isDynamicRoute('/foo/[...bar]')
    expect(result).toBe(true)
  })

  test('will be `true` when route is a complex dynamic route', () => {
    const result = isDynamicRoute('/foo/[bar]/[...foobar]/[baz]')
    expect(result).toBe(true)
  })

  test('will be `false` when route does not contain any dynamic path segments', () => {
    const result = isDynamicRoute('/foo/bar')
    expect(result).toBe(false)
  })

  test('will be `false` when route is malformed', () => {
    const result = isDynamicRoute('/foo/b[a]r/[...b]az/')
    expect(result).toBe(false)
  })

  test('will be `false` when route is not a string', () => {
    const result = isDynamicRoute({ pathname: '/foo/[bar]' })
    expect(result).toBe(false)
  })
})
