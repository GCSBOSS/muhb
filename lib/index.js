const assert = require('assert');
const http = require('http');

function assembleHeaders(method, headers, data){
    headers = typeof headers == 'object' ? headers : {};

    if(headers['--no-auto'] === true){
        delete headers['--no-auto'];
        return headers;
    }

    headers.date = headers.date || (new Date()).toUTCString();

    if(data.length > 0){
        headers['Content-Type'] = headers['Content-Type'] || 'application/octet-stream';
        headers['Content-Length'] = headers['Content-Length'] || Buffer.from(data).length;
    }

    return headers;
}

function applyMethods(context, root){
    root = root || '';
    [ 'get', 'post', 'patch', 'put', 'delete', 'head', 'options' ].forEach( m => {
        context[m] = (url, headersOrBody, body) =>
            request(root + url, headersOrBody, m.toUpperCase(), body || headersOrBody);
    });
}

function root(url){
    assert.strictEqual(typeof url, 'string');
    let context = {};
    applyMethods(context, url);
    return context;
}

function request(url, headers, method, data){
    data = typeof data == 'undefined' ? '' : String(data);
    return new Promise(function(resolve, reject){
        url = new URL(url);
        let options = {
            hostname: url.hostname,
            port: url.port,
            method: method,
            path: url.pathname + url.search,
            headers: assembleHeaders(method, headers, data)
        };
        let req = http.request(options, res => {
            res.on('error', reject);
            res.setEncoding('utf8');
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({
                status: res.statusCode,
                headers: res.headers,
                body: body
            }));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

applyMethods(module.exports);

module.exports.request = request;
module.exports.del = module.exports.delete;

module.exports.root = root;
