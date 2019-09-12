
const assert = require('assert');

function getArrayFunctions(oBody){
    assert(Array.isArray(oBody));

    return {
        match(i, v){
            assert.strictEqual(oBody[i], v);
            return this;
        },

        includes(v){
            assert(oBody.includes(v));
            return this;
        },

        empty(){
            assert.strictEqual(oBody.length, 0);
            return this;
        }
    }
}

function getJSONFunctions(body){
    try{ var oBody = JSON.parse(body); }
    catch(e){}

    assert.strictEqual(typeof oBody, 'object');

    return {
        object: oBody,

        hasKey(expected){
            assert(expected in oBody);
            return this;
        },

        match(k, v){
            assert.strictEqual(oBody[k], v);
            return this;
        },

        empty(){
            assert.strictEqual(Object.keys(oBody).length, 0);
            return this;
        },

        get array(){ return getArrayFunctions(this.object); }
    }
}

function getHeaderFunctions(headers){
    return {
        has(expected){
            assert(expected in headers);
            return this;
        },

        match(k, v){
            assert.strictEqual(headers[k], v);
            return this;
        }
    };
}

module.exports = function(data){

    return {
        status: {
            is: expected => assert.strictEqual(data.status, expected),
            in: expected => assert(expected.includes(data.status)),
            not: unwanted => assert(data.status != unwanted),
            notIn: unwanted => assert(!unwanted.includes(data.status)),
            type: expected =>
                assert.strictEqual(String(data.status).charAt(0), String(expected)),
            notType: unwanted =>
                assert(String(data.status).charAt(0) != String(unwanted))
        },

        body: {
            exactly: expected => assert.strictEqual(data.body, expected),
            contains: expected => assert(data.body.indexOf(expected) > -1),
            match: expected => assert(expected.test(data.body)),

            type(expected){
                assert.strictEqual(data.headers['content-type'], expected);
                return this;
            },

            length(expected){
                assert.strictEqual(data.headers['content-length'], String(expected));
                return this;
            },

            get json(){ return getJSONFunctions(data.body); }
        },

        headers: getHeaderFunctions(data.headers)
    }

}
