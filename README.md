# @fuelrats/next-dynamic-router
Named dynamic routes for Next.js 9's built-in dynamic routing. Inspired by [`next-routes`][next-routes].

### ⚠ This project is WIP. There are no releases available yet. ⚠

## Motivation

The current API for routing to dynamic routes is rather cumbersome, and refactoring routes can be costly in larger websites as a result.

This library aims to provide a more convenient interface for routing in your Next.js website.

## How To Use

1. Install using: `yarn add @fuelrats/next-dynamic-router` or `npm i @fuelrats/next-dynamic-router`

2. Structure your `pages` directory for Next.js dynamic routes.

3. Create a `routes.js` file in your project:

```javascript
import routes from '@fuelrats/next-dynamic-router'

module.exports = routes()
  // .add() accepts 3 parameters: Name, href, and as.
  .add('basic route', '/href/field', '/as/field')
  
  // The as field is optional. if none is provided, href is copied to as.
  .add('shortened basic route', '/href/field')
  
  // Route fields can be functions.
  .add('dynamic route', '/dynamic/route/[param]', (params) => `/dynamic/route/${params.param}`)
  .add(
    'dynamic route with page', 
    ({page}) => `/dynamic/route/[param]${page ? '/[page]' : ''}`, 
    ({param, page}) => `/dynamic/route/${param}${page ? `/${page}` : ''}`
  )
  
  // For absolute control, the first function can pass back an object with both href and as fields.
  .add('super dynamic route', (params) => {
    /* ... do stuff ... */
    return {
      href,
      as,
    }
  })
```

4. Use `<Link />` and `Router` in your application!

### Using `<Link />`

Import `<Link />` through `routes.js`

```jsx
import { Link } from '../routes'

const Nav = () => (
  <div>
    <Link route="blog">
      <a>Blog</a>
    </Link>
    <Link route="blog" params={{ category: 'news' }}>
      <a>Latest News</a>
    </Link>
  </div>
)
```
Accepted props:

- `route` - Name of route.
- `params` - Object containing params passed to path resolving functions.
- All other `next/link` props. Use of `route` will override `href` and `as`, however.


### Using `Router`

Router has three additional functions. `.pushRoute()`, `.replaceRoute()`, and `.prefetchRoute()`.


To use them, import `Router` through `routes.js`

```javascript
import { Router } from '../routes'

const gotoBlog = () => {
  Router.pushRoute('blog')
}

const gotoNews = () => {
  Router.pushRoute('blog', { category: 'news' })
}
```

All three functions have the same arguments:
 - `Route` - Name of Route.
 - `Params` - Object containing params passed to path resolving functions. (Optional if route is static)
 - `Options` - Options passed to `next/router`'s options field. (Optional)


## Migrating from `next-routes`

Coming from `next-routes`? Welcome! While we do not provide the exact same API, it should feel quite similar in use. If you use route names to resolve routes, then no adjustment to your code outside of `routes.js` should be neccessary.

This should **NOT** be considered a simple drop-in replacement for `next-routes`. Page routing is handled entirely by Next.js, NOT `next-dynamic-router`. This library simply provides a convienence wrapper for working with the built-in solution.

1. Follow setup as above, making adjustments to your `routes.js` file as needed.
2. remove `next-routes` from your server router. In most cases this just involves removing the 
3. remove `next-routes` from your project!

### Limitations from `next-routes`
- `.add()`'s API differs drastically from `next-routes`. This was done on purpose. We found that using functions which build the `href` and `as` fields from params had greater value than limiting it to a pre-defined pattern.
- Resolving routes via pre-calculated path strings (e.g. `/blog/1234552`) was too expensive to support in this library. We recommend using route names anyway. (even when using `next-routes`!)
- Using the `Route` prop/argument as an alias for `href` will still work, but it will not attempt to resolve your path to a defined route.

[next-routes]: https://github.com/fridays/next-routes
