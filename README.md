# MUHB

**M**ethod, **U**RL, **H**eaders and **B**ody

- Is a simple library for writing easy to read HTTP requet code.
- It is recommended for writing test cases, and other "unofficial" purposes.
- Run over promises.

## Method Signatures

MUHB exposes the same signature for all available methods:

`method ( String url [, Object headers] [, String body] )`

## Usage

Install with: `npm i muhb`.

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

var { status, headers, body } = await put(
    'https://nodejs.org/en/',
    { myHeader: 'example' },
    'key=value&key=value'
);
```

If you would like MUHB to not generate automatic content and date headers, send
a ghost parameter like this:

```js
const { put } = require('muhb');

var { status, headers, body } = await put(
    'https://nodejs.org/en/',
    { '--no-auto': true, myHeader: 'example' },
    'key=value&key=value'
);
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

All in one:

```js
const muhb = require('muhb');

let response = await muhb('post', 'https://nodejs.org/en', { foo: 'bar' }, 'key=value&key=value');

## Assertions
Testing response data:

```js
var { assert } = await get('https://example.com');

// Assert about your reposnse body.
assert.body.exactly('foobar');
assert.body.contains('oba');
assert.body.match(/oo.a/);

// Mostly chainable.
assert.body.type('application/json').length(23);

// Test JSON bodies.
assert.body.json
    .hasKey('foo')
    .match('foo', 'bar')
    .empty(); // test for {}

// Test JSON array.
assert.body.json.array
    .match(1, 'bar')
    .includes('foo')
    .empty();

// Assert about response status code
assert.status.is(200);
assert.status.not(400);
assert.status.in([ 200, 203, 404 ]);
assert.status.notIn([ 500, 403, 201 ]);
assert.status.type(2); // Test for 2xx
assert.status.notType(5) // Test for NOT 5xx

// Assert about response headers
assert.headers
    .has('authorization')
    .match('connection', 'close');
```

## Contributing
We will be delighted to receive your [issues](https://gitlab.com/GCSBOSS/muhb/issues/new)
and [MRs](https://gitlab.com/GCSBOSS/muhb/merge_requests/new).
