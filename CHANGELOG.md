# MUHB Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.2] - 2019-09-17

### Added
- support for a cookies object in the request input headers
- cookies object to muhb output

### Deprecated
- '--no-auto' header directive in favor of 'no-auto'

## [v2.0.1] - 2019-09-16

### Added
- option for defining the pool method dynamically
- support for regular HTTPS requests

## [v2.0.0] - 2019-09-12

### Added
- function to send request bulks through pooling strategy
- timeout option to request method
- muhb main exported function with proper parameter order

### Changed
- 'request' method to receive an object as argument
- 'root' method name to 'context'
- main method to return the entire res object along with muhb custom keys

## [v1.0.0] - 2019-07-22

### Added
- response data assertion functionality to improve usage in test suites
- function to define a root url to prepend to all methods

## [v0.1.1] - 2019-06-27

### Added
- automatic generation of some required request headers

## [v0.1.0] - 2018-10-14
- Things were confusing back then.

[v0.1.0]: https://gitlab.com/GCSBOSS/muhb/-/tags/v0.0.1
[v0.1.1]: https://gitlab.com/GCSBOSS/muhb/-/tags/v0.1.1
[v1.0.0]: https://gitlab.com/GCSBOSS/muhb/-/tags/v1.0.0
[v2.0.0]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.0.0
[v2.0.1]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.0.1
[v2.0.2]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.0.2
