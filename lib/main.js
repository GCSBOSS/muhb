const { request } = require('./request');
const getContextFunction = require('./context');

const HTTP_VERBS = [ 'get', 'post', 'patch', 'put', 'delete', 'head', 'options' ];

function muhb(method, url, headers, body){
    body = body || headers;
    return request({ method, url, headers, body });
}

module.exports = muhb;

for(let m of HTTP_VERBS)
    module.exports[m] = muhb.bind(null, m.toUpperCase());
module.exports.del = module.exports.delete;
module.exports.context = getContextFunction(HTTP_VERBS, muhb);
module.exports.request = request;
