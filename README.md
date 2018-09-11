# MUHB

Muhb is a simple library for writing easy to read HTTP requet code.

It is recommended for writing test cases, and other unofficial purposes.

Muhb run over promises.

> Obs.: Do not use it in production.

## Method Signatures

- GET, DELETE, HEAD and OPTIONS: `method ( String url [, Object headers] )`
- POST, PUT and PATCH: `method ( String url [, Object headers] [, String body] )`

## Usage

Getting NodeJS homepage:

```js
const { get } = require('muhb');

var { status, headers, body } = await get('https://nodejs.org/en/');
```

Posting a random form:

```js
const { post } = require('muhb');

var { status, headers, body } = await post('https://nodejs.org/en/', 'key=value&key=value');
```

Sending headers:

```js
const { put } = require('muhb');

var { status, headers, body } = await put('https://nodejs.org/en/', { myHeader: 'example' }, 'key=value&key=value');
```

Having all available muhb methods:

```js
const muhb = require('muhb');

muhb.get //=> [function]
muhb.post //=> [function]
muhb.patch //=> [function]
muhb.delete //=> [function]
muhb.put //=> [function]
muhb.head //=> [function]
muhb.options //=> [function]
```

## Contributing
We will be delighted to receive your [issues](https://gitlab.com/GCSBOSS/muhb/issues/new) and [MRs](https://gitlab.com/GCSBOSS/muhb/merge_requests/new).
