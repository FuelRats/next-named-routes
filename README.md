# @fuelrats/next-named-routes
Named routes for Next.js 9's built-in dynamic routing. Inspired by [`next-routes`][next-routes].

### ⚠ Use of this library is not yet recommended. We are still in testing stages! ⚠

## Motivation

The current API for routing to dynamic routes is rather cumbersome. As a result, refactoring routes can be costly in larger websites. Small mistakes in writing the `href` and `as` parameters are also very easy to make.

This library aims to provide a more convenient interface for routing in your Next.js website.

## Setup

1. Install via: `yarn add @fuelrats/next-named-routes` or `npm i @fuelrats/next-named-routes`

2. Structure your `pages` directory for [Next.js dynamic routes][nextdocs-dynamic-routes].

3. Create a `routes.js` file in your project similar to this:
    - Note the use of CommonJS import/export syntax here is **required**.

```javascript
const routes = require('@fuelrats/next-named-routes')

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
- All other `next/link` props. Use of `href` or `as` will override `route`.


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

### Using `useRouter` and `withRouter`

`next-named-routes` provides wrappers for both the `useRouter` hook and `withRouter` HoC! They are used just like the built in versions.

```jsx
import { useRouter } from '../routes'

const BlogListTitle = () => {
  const router = useRouter()
  const { category } = router.query

  return (<div>{category}</div>)
}

export default BlogListTitle
```

```jsx
import { withRouter } from '../routes'

const BlogListTitle = ({ router }) => {
  const { category } = router.query

  return (<div>{category}</div>)
}

export default withRouter(BlogListTitle)
```

## Migrating from [`next-routes`][next-routes]

Coming from `next-routes`? Welcome! While we do not provide the exact same API, it should feel similar in use. If you use route names to resolve routes, then very little work is required to migrate!

This should **NOT** be considered a simple drop-in replacement for `next-routes`. Page routing is handled entirely by Next.js, NOT `next-named-routes`. We only provide convienence functions for working with the built-in dynamic router introduced by Next.js 9.

1. Follow setup as above, making adjustments to your `routes.js` file as needed.
2. remove `next-routes` from your server router. In most cases this just involves removing the `next-routes` handler wrapper, and the library import itself.
    - If you only implemented a custom server for dynamic routing, chances are you could remove it altogether!
3. remove `next-routes` via `yarn remove next-routes` or `npm r -S next-routes`

### Limitations from `next-routes`
- `.add()`'s API differs drastically from `next-routes`. This was done on purpose. We found that using functions which build the `href` and `as` fields from params had greater value than limiting it to a pre-defined pattern.
- Resolving routes via pre-calculated path strings (e.g. `/blog/1234552`) was too expensive to support in this library. We recommend using route names anyway. (even when using `next-routes`!)
- Using the `Route` prop/argument as an alias for `href` will still work, but it will not attempt to resolve your path to a defined route.

[next-routes]: https://github.com/fridays/next-routes
[nextdocs-dynamic-routes]: https://github.com/zeit/next.js#dynamic-routing
