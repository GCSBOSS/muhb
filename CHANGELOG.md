# MUHB Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.0.3] - 2020-04-27

### Added
- support to timeout through headers object
- support to cookies through settings object

## [v3.0.2] - 2020-04-26

### Changed
- response body handling to output buffer for binary mime-types

## [v3.0.1] - 2020-03-01

### Fixed
- bug that made all pool methods become POST

## [v3.0.0] - 2020-02-05

### Added
- new pooling interface featuring OO, promises, events and pause/resume functionality
- support for sending authentication user and password via URL
- function to assert the length of JSON array response bodies

### Removed
- simple pooling interface (`muhb.pool()`)

## [v2.1.1] - 2020-01-14

### Fixed
- digest auth 'undefined' in header when server omits any field in the challenge

## [v2.1.0] - 2020-01-12

### Added
- support for MD5 Digest auth
- sending body from Buffer object
- support for primitives and objects as request body

### Removed
- already deprecated '--no-auto' header directive in favor of 'no-auto'

## [v2.0.3] - 2019-10-16

### Added
- URI decoding/encoding to cookie values when parsing or stringifying

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
[v2.0.3]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.0.3
[v2.1.0]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.1.0
[v2.1.1]: https://gitlab.com/GCSBOSS/muhb/-/tags/v2.1.1
[v3.0.0]: https://gitlab.com/GCSBOSS/muhb/-/tags/v3.0.0
[v3.0.1]: https://gitlab.com/GCSBOSS/muhb/-/tags/v3.0.1
[v3.0.2]: https://gitlab.com/GCSBOSS/muhb/-/tags/v3.0.2
[v3.0.3]: https://gitlab.com/GCSBOSS/muhb/-/tags/v3.0.3
