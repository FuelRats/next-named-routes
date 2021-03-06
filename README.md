# @fuelrats/next-named-routes

Named route definitions for Next.js 9+ dynamic routes.

* Easy to use API to simplify routing within your app.
* Generate URLS automatically from parameters.
* Prevent errors in your routing with strict validation.





<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Defining routes in your application](#defining-routes-in-your-application)
  - [Function routes](#function-routes)
- [Using `<Link />`](#using-link-)
  - [`route` as a defined route name](#route-as-a-defined-route-name)
  - [`route` as a file path](#route-as-a-file-path)
  - [Handling parameters](#handling-parameters)
- [Using `Router`](#using-router)
- [Providing a Custom `Link` and `Router`](#providing-a-custom-link-and-router)
- [Migrating from `next-routes`](#migrating-from-next-routes)
  - [Differences from `next-routes`](#differences-from-next-routes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Installation

1. Install via: `yarn add @fuelrats/next-named-routes` or `npm i @fuelrats/next-named-routes`
2. Structure your `pages` directory for [Next.js dynamic routes][nextdocs-dynamic-routes].
3. Create a `routes.js` file in your project similar to this:

```javascript
import routes from '@fuelrats/next-named-routes'


// Destructure what you need
const { Link, Router, useRouter, withRouter } = routes()
  .add('about', '/about-us') // define your routes
  .add('profile', '/profile/[tab]')
  .add('cms', '/cms/[...cmsPath]')


// export what you need
export { Link, Router, useRouter, withRouter }
```

4. Use `<Link />` and `Router` in your application!





## Defining routes in your application

In large applications routes can get long and complex. You can use the `.add()` function to alias your routes into simple names.

Route definitions are completely optional. You can use a normal `href` value to refer to your page without issue!

to use `.add()`, just tag the function onto the end of your `routes()` call:

```javascript
const { /* ... */ } = routes()
  .add(name, href)
```

`.add()` accepts two arguments:
* **`name`** - The name of your route. This will be used to refer back to the given path. Can be a string or symbol.
* **`href`** - The path inside your `pages` directory. Identical to `href` used in `next/link` and `next/router`. Also accepts a [function](#function-routes).

If successful, it will return the current instance of `routes()` so you can chain route definitions together.

See [Using `<Link />`](#using-link-) and [Using `Router`](#using-router) below for more details on using defined routes.


### Function routes

`.add()` also accepts a callback for ultimate control over how your route definition behaves. This is good for when you want to process objects into path slugs, or if you want to control what page the route leads to based upon the value of a parameter.

The callback is passed a single parameter:

* **`params`** - object given to `<Link />` or `Router` call

and is expected to return an object with the following properties:

* **`href`** - The path inside your `pages` directory.
* **`as`** - The path that will be rendered in the browser URL bar.
* **`query`** - object of parameters to be transformed into a query string (optional)

```javascript
const { /* ... */ } = routes()
.add('forum post', ({ publishDate, slug, ...query }) => {
  const year = publishDate.getUTCFullYear()
  const month = publishDate.getUTCMonth()
  const day = publishDate.getUTCDate()

  return {
    href: '/forum/[year]/[month]/[day]/[slug]',
    as: `/forum/${year}/${month}/${day}/${slug}`,
    query,
  }
})
```

Another example:

```javascript
.add('forum list', ({ category, page, ...query }) => {
  let href = '/forum'
  let as = '/forum'

  if (category) {
    href += '/cat/[category]'
    href += `/cat/${category}`

    if (page) {
      href += '/[page]'
      as += `/${page}`
    }
  }


  return { href, as, query }
})
```





## Using `<Link />`

The provided `<Link />` component is a wrapped `next/link` which lets you reference defined routes by their names, and generate the final URL via parameters.

* **`route`** - Defined route name or a path in your `pages` directory.
* **`params`** - Parameters used to generate the URL and query string.
* All other props of [`next/link`][nextdocs-link], however `href` and `as` are overwritten by `route` if it's defined.

### `route` as a defined route name

```javascript
import { Link } from '../routes'

const Nav = () => (
  <div>
    {/*
      * Equivalent to:
      * <Link
      *   href="/forums" />
      */}
    <Link route="forum list">
      <a>forums</a>
    </Link>

    {/*
      * Equivalent to:
      * <Link
      *   href="/forums/[year]/[month]/[day]/[slug]"
      *   as="/forums/2015/06/01/out-of-fuel-explorer-rescue-service-the-fuel-rats" />
      */}
    <Link route="forum post" params={{ year: '2015', month: '06', day: '01', slug: 'out-of-fuel-explorer-rescue-service-the-fuel-rats' }}>
      <a>Forum post</a>
    </Link>

    {/*
      * Equivalent to:
      * <Link
      *   href="/cms/[...cmsPath]"
      *   as="/cms/legal/terms-of-service" />
      */}
    <Link route="cms" params{{ cmsPath: [ 'legal', 'terms-of-service' ] }}>
        <a>Terms of Service</a>
    </link>
  </div>
)
)
```


### `route` as a file path

You can also refer to routes not defined in `routes.js` by using page's path in your `pages` directory.

```javascript
    {/*
      * Equivalent to:
      * <Link
      *   href="/profile/[tab]"
      *   as="/profile/overview" />
      */}
    <Link route="/profile/[tab]" params={{ tab: 'overview' }}>
      <a>Your Profile</a>
    </Link>
```


### Handling parameters

The route compiler is smart about what parameters are used by your dynamic routes. for example:

Unused parameters will be passed as a querystring to your page.
```javascript
    {/*
      * Equivalent to:
      * <Link
      *   href="/profile/[tab]?welcome=true"
      *   as="/profile/overview?welcome=true" />
      */}
    <Link route="/profile/[tab]" params={{ tab: 'overview', welcome: true }}>
      <a>Your Profile</a>
    </Link>
```

Missing parameters will cause an error.
```javascript
    {/* ERROR! "tab" is required */}
    <Link route="/profile/[tab]" params={{ welcome: true }}>
      <a>Your Profile</a>
    </Link>
```





## Using `Router`

The `Router` object ia a modified `next/router` with three additional functions.

* **`.pushRoute()`** - wrapped `.push()`
* **`.replaceRoute()`** - wrapped `.replace()`
* **`.prefetchRoute()`** - wrapped `.prefetch()`

All three accept the same parameters and behave like their `next/router` counterparts

```javascript
import Router from '../routes'

Router.pushRoute(route, params, options)
```

* **`route`** - Defined route name or a path in your `pages` directory.
* **`params`** - Parameters used to generate the URL and query string.
* **`options`** - `next/router` options object.

`route` and `params` arguments accept the same values as the corresponding `<Link />` props above.


## Providing a Custom `Link` and `Router`

You can provide your own `Link` and `Router` instances if you wish to extend functionality futher, however there is one major caveat. the `Router` object **MUST** be an object which provides both the main Router API object and the `useRouter()` hook.


Pass `Link` and `Router` to routes like the following:

```javascript
const RouterObj = {
  default: CustomRouter
  useRouter: customRouterHook
}

const {Link, Router} = routes(CustomLink, RouterObj)
```

While inconvienent, we require both of these things to be able to provide the wrapped `useRouter()` hook and `withRouter()` HoC.

The custom `Router` is **NOT** required to pass a custom `Link` component. One can exist without the other.

## Migrating from `next-routes`

Coming from [`next-routes`][next-routes]? Welcome! While we do not provide the exact same API, it should feel familiar to use.

This library is **NOT** a simple drop-in replacement for `next-routes`. Some work is required to transition your route definitions to dynamic route string format, and most advanced regex matches are not possible since `next.js` does not use `path-to-regexp`.

1. Follow the setup as above, making adjustments to your `routes.js` file as needed.
2. remove `next-routes` from your server router. In most cases this just involves removing the `next-routes` handler wrapper, and the library import itself.
    - If you only implemented a custom server for dynamic routing, chances are you could remove it altogether!
3. remove `next-routes` via `yarn remove next-routes` or `npm r -S next-routes`


### Differences from `next-routes`
* Arguments for `routes.add()` differs significantly from `next-routes`. For more information see the [Configuring `routes()`](#configuring-routes) section above.
    * `name` is now required.
    * `pattern`, which we call `href`, is a `Next.js` dynamic route path instead of a `path-to-regexp` pattern.
    * `page`, or the path to the page file, is no longer needed as the file system will always reflect the `href` value.


---

Brought to you by [The Fuel Rats!][fuelrats] ⛽🐀

[fuelrats]: https://fuelrats.com/
[next-routes]: https://github.com/fridays/next-routes
[nextdocs-dynamic-routes]: https://nextjs.org/docs/routing/dynamic-routes
[nextdocs-link]: https://nextjs.org/docs/api-reference/next/link
