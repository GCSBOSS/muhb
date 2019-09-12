const assert = require('assert');

module.exports = function getContextFunction(verbs, muhb){

    return function context(url){
        assert.strictEqual(typeof url, 'string');
        url = url.replace(/\/?$/g, '/');

        let ctx = {};
        for(let m of verbs)
            ctx[m] = (u, h, b) => muhb(m.toUpperCase(), url + u, h, b);
        ctx.del = ctx.delete;
        return ctx;
    }

}
