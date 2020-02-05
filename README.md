# MUHB

**M**ethod, **U**RL, **H**eaders and **B**ody

- Easy to read HTTP requets.
- Run over promises.
- Built-in assertion functionality.
- Send request bulks with pooling strategy.

## Usage

Install with: `npm i muhb`.

Getting NodeJS homepage:

```js
const muhb = require('muhb');

var { status, headers, body } = await muhb('get', 'https://nodejs.org/en/');
```

### Shorthands

MUHB exposes a short signature for all HTTP verbs:

`method ( String url [, Object headers] [, String body] )`

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
    { 'no-auto': true, myHeader: 'example' },
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

If you need to access the nodejs `res` object, all muhb methods return it modified
to have our `status` and `body` keys.

```js
const { get } = require('muhb');
let res = await get('https://nodejs.org/en/');
```

### Assertions
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
    .length(2)
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

### Authentication

> As of now the only auth method supported is MD5 Digest.

You must ensure your server responds with `401` and a `WWW-Authenticate` header
so muhb knows to perform the auth.

Then just send your credentials in the headers object as follows:

```js
let { body } = await post('http://example.com', {
    auth: { username: 'my-user', password: 'my-pass' }
});
```

Or use the user and password syntax (they will be stripped from the URL before being sent).

```js
let { body } = await post('http://my-user:my-pass@example.com');
```

### Pooling

Define a pool with a max size of 10 requests and a timeout of 2 seconds:

```js
const { Pool } = require('muhb');
let myPool = new Pool({ size: 10, timeout: 2000 });
```

Then run the pool over an array of say request bodies:

```js
let bodies = 'abcdefghijklmnopqrstuvwxyz'.split('');
bodies.forEach( body => myPool.post('http://localhost/fail', body) );
```

Wait until all requests recive responses.

```js
// With promises
let responses = await myPool.done();

// With events
myPool.on('finish', responses => console.log(responses));
```

Wait for a single request in the pool to finish.

```js
let res = await myPool.post('http://localhost/fail');
```

Act on every request that is responded.

```js
myPool.on('response', (req, res) => {
    console.log(res.status);
});
```

## Contributing
We will be delighted to receive your [issues](https://gitlab.com/GCSBOSS/muhb/issues/new)
and [MRs](https://gitlab.com/GCSBOSS/muhb/merge_requests/new).
