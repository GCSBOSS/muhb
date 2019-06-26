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
