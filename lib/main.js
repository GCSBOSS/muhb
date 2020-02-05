const { request, METHODS } = require('./request');
const getContextFunction = require('./context');
const Pool = require('./pool');

function muhb(method, url, headers, body){
    body = body || headers;
    return request({ method, url, headers, body });
}

module.exports = muhb;

for(let m of METHODS)
    module.exports[m] = muhb.bind(null, m.toUpperCase());
module.exports.del = module.exports.delete;
module.exports.context = getContextFunction(METHODS, muhb);
module.exports.Pool = Pool;
module.exports.request = request;
