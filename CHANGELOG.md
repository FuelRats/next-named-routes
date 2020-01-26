# Changelog

## [unreleased]

## 2.0.3 - 2020-01-26
* Hopefully fix this for real this time?

## 2.0.2 - 2020-01-25
* Realized Yarn 2 is a bit weird about prepublish. now we have a 2.0 release :P

## 2.0.1 - 2020-01-25
* Fix documentation error.

## 2.0.0 - 2020-01-25
* **BREAKING** Properly respect package boundaries by having the user provide what we need for us. (yay)
    - Refer to the updated example config in `README.md`.
* Convert to Yarn2 / PnP.
* Add better argument validation via our new validation utility library.

## 1.1.0

### Changes
* rewrite `withRouter` implementation. Solution: just use `hoist-non-react-statics`!

## 1.0.0

* Initial public release
