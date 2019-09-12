const assert = require('assert');
const { request } = require('./request');

var evaluate = (thing, ctx) => typeof thing == 'function' ? thing(ctx) : thing;

function runPool({ sources, url, headers, body, method, timeout, size }, resolve) {

    var next = size;
    var done = 0;
    var results = [];
    var draw;

    var signalDone = (idx, data) => {
        results[idx] = data;
        done++;
        draw(next);
    };

    var toss = idx => {
        var context = sources[idx];
        var sigDone = signalDone.bind(null, idx);
        request({
            method, timeout,
            url: evaluate(url, context),
            headers: evaluate(headers, context),
            body: evaluate(body, context)
        }).then(sigDone).catch(sigDone);
    }

    draw = idx => {
        if(done >= sources.length)
            return resolve(results);
        if(next >= sources.length)
            return;
        next++;
        toss(idx);
    }

    for(let i = 0; i < Math.min(sources.length, size); i++)
        toss(i);
}

module.exports = function getPoolFunction(verbs) {

    return function getPool(size, timeout) {
        assert.strictEqual(typeof size, 'number');
        assert.strictEqual(typeof timeout, 'number');

        let ctx = {};
        for(let m of verbs)
            ctx[m] = (sources, url, headers, body) => new Promise(runPool.bind(null, {
                method: m.toUpperCase(),
                sources, url, headers, body: body || headers, timeout, size
            }));

        ctx.del = ctx.delete;
        return ctx;
    }

}
