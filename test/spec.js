const assert = require('assert');
const crypto = require('crypto');
const muhb = require('../lib/main.js');
const HTTPBIN_URL = process.env.HTTPBIN_URL || 'http://localhost:8066';

describe('Verbs', function(){

    it('Should properly reach a GET endpoint', async function(){
        let r = await muhb.get(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(typeof o.args, 'object');
    });

    it('Should properly reach a HEAD endpoint', async function(){
        let r = await muhb.head(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        assert.strictEqual(r.body, '');
    });

    it('Should properly reach a POST endpoint', async function(){
        let r = await muhb.post(HTTPBIN_URL + '/post', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.post(HTTPBIN_URL + '/post', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('Should properly reach a PUT endpoint', async function(){
        let r = await muhb.put(HTTPBIN_URL + '/put', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.put(HTTPBIN_URL + '/put', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('Should properly reach a PATCH endpoint', async function(){
        let r = await muhb.patch(HTTPBIN_URL + '/patch', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.patch(HTTPBIN_URL + '/patch', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('Should properly reach a DELETE endpoint', async function(){
        let r = await muhb.delete(HTTPBIN_URL + '/delete');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(typeof o.args, 'object');
    });

    it('Should properly reach an OPTIONS endpoint', async function(){
        let r = await muhb.options(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers.allow, 'string');
        assert.strictEqual(r.body, '');
    });

    it('Should reject when request fails', function(){
        assert.rejects(() => muhb.request({
            method: 'GET',
            url: 'http://10.4.5.254:8347',
            timeout: 2000
        }), /timeout/g);
    });

    it('Should send body from Buffer object', async function(){
        let { assert } = await muhb.post(
            HTTPBIN_URL + '/post',
            { 'Content-Type': 'application/json' },
            crypto.randomBytes(20)
        );
        assert.status.is(200);
        assert.body.contains('base64');
    });

});

describe('Automatic Headers', function(){

    it('Should generate automatic headers', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post');
        let o = JSON.parse(body);
        assert(o.headers.Date);
        assert(!o.headers['Content-Type']);
        assert(!o.headers['Content-Length']);
    });

    it('Should generate content length and type headers when body is present', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', 'haha');
        let o = JSON.parse(body);
        assert(o.headers.Date);
        assert.strictEqual(o.headers['Content-Type'], 'application/octet-stream');
        assert.strictEqual(o.headers['Content-Length'], '4');
    });

    it('Should priorize user headers', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', {'Content-Type': 'text/plain'}, 'haha');
        let o = JSON.parse(body);
        assert.strictEqual(o.headers['Content-Type'], 'text/plain');
    });

    it('Should not generate automatic headers when specified', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', {'no-auto': true}, 'haha');
        let o = JSON.parse(body);
        assert(!o.headers.Date);
        assert(!o.headers['Content-Type']);
        assert(!o.headers['Content-Length']);
    });

});

describe('Root Definition', function(){

    it('Should properly reach a rooted GET endpoint', async function(){
        let base = muhb.context(HTTPBIN_URL);
        assert('post' in base);
        assert('get' in base);
        let r = await base.get('/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(typeof o.args, 'object');
    });

});

describe('Assertions', function(){

    var ep = muhb.context(HTTPBIN_URL);

    it('Should be ok asserting truths over http status code', async function(){
        let { assert: ass } = await ep.get('/get');
        assert.doesNotThrow( () => ass.status.is(200) );
        assert.doesNotThrow( () => ass.status.in([200, 201])  );
        assert.doesNotThrow( () => ass.status.not(201) );
        assert.doesNotThrow( () => ass.status.notIn([202, 201]) );
        assert.doesNotThrow( () => ass.status.type(2) );
        assert.doesNotThrow( () => ass.status.notType(3) );
    });

    it('Should throw asserting falsehoods over http status code', async function(){
        let { assert: ass } = await ep.get('/get');
        assert.throws( () => ass.status.is(201) );
        assert.throws( () => ass.status.in([202, 201])  );
        assert.throws( () => ass.status.not(200) );
        assert.throws( () => ass.status.notIn([200, 201]) );
        assert.throws( () => ass.status.type(3) );
        assert.throws( () => ass.status.notType(2) );
    });

    it('Should be ok asserting truths over http headers', async function(){
        let { assert: ass } = await ep.get('/get');
        assert.doesNotThrow( () => ass.headers.has('content-length').has('date') );
        assert.doesNotThrow( () => ass.headers.match('content-type', 'application/json') );
    });

    it('Should throw asserting falsehoods over http headers', async function(){
        let { assert: ass } = await ep.get('/get');
        assert.throws( () => ass.headers.has('x-none') );
        assert.throws( () => ass.headers.match('content-type', 'text/html') );
    });

    it('Should be ok asserting truths over response body', async function(){
        let { assert: ass } = await ep.get('/user-agent');
        assert.doesNotThrow( () => ass.body.exactly('{\n  "user-agent": null\n}\n') );
        assert.doesNotThrow( () => ass.body.contains('user-agent') );
        assert.doesNotThrow( () => ass.body.match(/null/g) );
        assert.doesNotThrow( () => ass.body.type('application/json') );
        assert.doesNotThrow( () => ass.body.length(25) );
    });

    it('Should throw asserting falsehoods over response body', async function(){
        let { assert: ass } = await ep.get('/');
        assert.throws( () => ass.body.exactly('barfoo') );
        assert.throws( () => ass.body.contains('baz') );
        assert.throws( () => ass.body.match(/bah/) );
        assert.throws( () => ass.body.type('image/jpg') );
        assert.throws( () => ass.body.length(1) );
        assert.throws( () => ass.body.json );
    });

    it('Should be ok asserting truths over json response body', async function(){
        let { assert: ass } = await ep.get('/user-agent');
        let assJSON = ass.body.json;
        assert.doesNotThrow( () => assJSON.hasKey('user-agent') );
        assert.doesNotThrow( () => assJSON.match('user-agent', null) );
        delete assJSON.object['user-agent'];
        assert.doesNotThrow( () => assJSON.empty() );
    });

    it('Should throw asserting falsehoods over json response body', async function(){
        let { assert: ass } = await ep.get('/user-agent');
        let assJSON = ass.body.json;
        assert.throws( () => assJSON.hasKey('barfoo') );
        assert.throws( () => assJSON.match('user-agent', 'bah') );
        assert.throws( () => assJSON.empty(/bah/) );
        assert.throws( () => assJSON.array );
    });

    it('Should be ok asserting truths over json array response body', async function(){
        let { assert: ass } = await ep.get('/user-agent');
        let assJSON = ass.body.json;
        assJSON.object = [ 'foo', 'bar' ];
        let assArr = assJSON.array;
        assert.doesNotThrow( () => assArr.match(1, 'bar') );
        assert.doesNotThrow( () => assArr.includes('bar') );
        assert.doesNotThrow( () => assArr.length(2) );
        assJSON.object = [];
        assert.doesNotThrow( () => assJSON.array.empty() );
    });

    it('Should throw asserting falsehoods over json array response body', async function(){
        let { assert: ass } = await ep.get('/user-agent');
        let assJSON = ass.body.json;
        assJSON.object = [ 'bar', 'foo' ];
        let assArr = assJSON.array;
        assert.throws( () => assArr.match(1, 'bar') );
        assert.throws( () => assArr.includes('baz') );
        assert.throws( () => assArr.length(1) );
        assert.throws( () => assArr.empty() );
    });

});

describe('Timeout', function(){



});

describe('Pooling', function(){

    it('Should reach the endpoint the correct amount of times', function(done){
        this.timeout(5000);
        let p = new muhb.Pool();
        'abcd'.split('').forEach(b => p.post(HTTPBIN_URL + '/delay/2', b));

        p.on('finish', function(resArr){
            assert.strictEqual(resArr.length, 4);
            resArr.forEach( res => res.assert.status.is(200) );
            done();
        });
    });

    it('Should timeout requests according to pool rules', async function(){
        this.timeout(5000);

        let errs = 0;
        let p = new muhb.Pool({ size: 2, timeout: 2300 });
        '2232'.split('').forEach(
            d => p.post(HTTPBIN_URL + '/delay/' + d).catch(() => errs++ ));

        let resArr = await p.done();
        assert.strictEqual(resArr.length, 4);
        resArr[1].assert.status.is(200);
        assert(resArr[3].message.indexOf('timeout 2300ms') > -1);
        assert.strictEqual(errs, 1);
    });

    it('Should allow updating pool settings on the fly', async function(){
        this.timeout(4500);
        let p = new muhb.Pool({ size: 1 });
        await p.post(HTTPBIN_URL + '/delay/2', { 'X-Header': 'Coverage' });
        p.size = 3;
        p.post(HTTPBIN_URL + '/delay/2');
        p.post(HTTPBIN_URL + '/delay/2');
        p.post(HTTPBIN_URL + '/delay/2');
        await p.done();
    });

    it('Should stop processing queued requests when paused', async function(){
        let p = new muhb.Pool({ size: 2 });
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        await p.pause();
        assert.strictEqual(p.queue.length, 3);
    });

    it('Should finish processing when resuming a paused pool', async function(){
        this.timeout(3500);
        let p = new muhb.Pool({ size: 2 });
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        p.post(HTTPBIN_URL + '/delay/1');
        await p.pause();
        let r = await p.resume();
        assert.strictEqual(r.length, 3);
        assert.strictEqual(p.queue.length, 0);
    });

});

describe('HTTPS', function(){

    it('Should send HTTPS requests just fine', async function(){
        let r = await muhb.get('https://example.com');
        r.assert.status.is(200);
        r.assert.body.contains('Example Domain');
    });

});

describe('Cookies', function(){

    it('Should parse cookies set by the server', async function(){
        let { cookies } = await muhb.get(HTTPBIN_URL + '/cookies/set/test/foobar');
        assert.strictEqual(cookies.test, 'foobar');
    });

    it('Should send cookies given on input object', async function(){
        let { cookies } = await muhb.get(HTTPBIN_URL + '/cookies/set/test/foofoo');
        let { assert } = await muhb.get(HTTPBIN_URL + '/cookies', { cookies });
        assert.body.contains('foofoo');
    });

});

describe('Auth', function(){

    it('Should respond to MD5 Digest challenge', async function(){
        let { assert } = await muhb.get(
            HTTPBIN_URL + '/digest-auth/auth/my-user/my-pwd/MD5',
            { auth: { username: 'my-user', password: 'my-pwd' } }
        );
        assert.status.is(200);
        assert.body.json.match('authenticated', true);
    });

    it('Should accept user and password via URL', async function(){
        let url = HTTPBIN_URL.split('//').join('//usr:pwd@');
        let { assert } = await muhb.get(url + '/digest-auth/auth/usr/pwd/MD5');
        assert.status.is(200);
        assert.body.json.match('authenticated', true);
    });

});

describe('Regressions', function(){

    it('Should send all http methods through the pool', async function(){
        let p = new muhb.Pool();
        let r1 = await p.post(HTTPBIN_URL + '/post');
        let r2 = await p.put(HTTPBIN_URL + '/put');
        assert.strictEqual(r1.status, 200);
        assert.strictEqual(r2.status, 200);
    });

});

describe('Other Features', function(){

    it('Should return buffers for binary response bodies', async function(){
        let { body } = await muhb.get(HTTPBIN_URL + '/bytes/16');
        assert(body instanceof Buffer);
        assert.strictEqual(body.length, 16);
    });

    it('Should reject when response time exceeds setup timeout', async function(){
        await assert.rejects(() => muhb.request({
            method: 'GET',
            url: HTTPBIN_URL + '/delay/10000',
            timeout: 500
        }), /timeout/g);

        await assert.rejects(() => muhb.request({
            method: 'GET',
            url: HTTPBIN_URL + '/delay/10000',
            headers: { timeout: 500 }
        }), /timeout/g);
    });

});
