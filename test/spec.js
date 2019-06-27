const assert = require('assert');
const muhb = require('../lib/index.js');
const HTTPBIN_URL = process.env.HTTPBIN_URL || 'http://localhost';

describe('Verbs', function(){

    it('should properly reach a GET endpoint', async function(){
        let r = await muhb.get(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(typeof o.args, 'object');
    });

    it('should properly reach a GET endpoint', async function(){
        let r = await muhb.head(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        assert.strictEqual(r.body, '');
    });

    it('should properly reach a POST endpoint', async function(){
        let r = await muhb.post(HTTPBIN_URL + '/post', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.post(HTTPBIN_URL + '/post', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('should properly reach a PUT endpoint', async function(){
        let r = await muhb.put(HTTPBIN_URL + '/put', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.put(HTTPBIN_URL + '/put', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('should properly reach a PATCH endpoint', async function(){
        let r = await muhb.patch(HTTPBIN_URL + '/patch', 'balela');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(o.data, 'balela');
        r = await muhb.patch(HTTPBIN_URL + '/patch', {'thak-thek': 'that'});
        o = JSON.parse(r.body);
        assert.strictEqual(o.headers['Thak-Thek'], 'that');
    });

    it('should properly reach a DELETE endpoint', async function(){
        let r = await muhb.delete(HTTPBIN_URL + '/delete');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers, 'object');
        let o = JSON.parse(r.body);
        assert.strictEqual(typeof o.args, 'object');
    });

    it('should properly reach a GET endpoint', async function(){
        let r = await muhb.options(HTTPBIN_URL + '/get');
        assert.strictEqual(r.status, 200);
        assert.strictEqual(typeof r.headers.allow, 'string');
        assert.strictEqual(r.body, '');
    });

});

describe('Automatic Headers', function(){

    it('should generate automatic headers', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post');
        let o = JSON.parse(body);
        assert(o.headers.Date);
        assert(!o.headers['Content-Type']);
        assert(!o.headers['Content-Length']);
    });

    it('should generate content length and type headers when body is present', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', 'haha');
        let o = JSON.parse(body);
        assert(o.headers.Date);
        assert.strictEqual(o.headers['Content-Type'], 'application/octet-stream');
        assert.strictEqual(o.headers['Content-Length'], '4');
    });

    it('should priorize user headers', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', {'Content-Type': 'text/plain'}, 'haha');
        let o = JSON.parse(body);
        assert.strictEqual(o.headers['Content-Type'], 'text/plain');
    });

    it('should not generate automatic headers when specified', async function(){
        let { body } = await muhb.post(HTTPBIN_URL + '/post', {'--no-auto': true}, 'haha');
        let o = JSON.parse(body);
        assert(!o.headers.Date);
        assert(!o.headers['Content-Type']);
        assert(!o.headers['Content-Length']);
    });

});
