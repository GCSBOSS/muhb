const http = require('http');
const https = require('https');
const getAssertions = require('./assertions');

function onResponse(res, body, cb){
    res.status = res.statusCode;
    res.body = body;
    res.assert = getAssertions(res);
    cb(res);
}

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

function getOptions({ url, method, timeout, headers, body }){
    url = new URL(url);
    return {
        client: url.protocol === 'https:' ? https : http,
        hostname: url.hostname,
        port: url.port, method, timeout,
        path: url.pathname + url.search,
        headers: assembleHeaders(method, headers, body)
    };
}

module.exports = {

    request(input){
        input.body = typeof input.body == 'undefined' ? '' : String(input.body);
        let opts = getOptions(input);
        return new Promise(function(resolve, reject){
            let req = opts.client.request(opts, res => {
                res.on('error', reject);
                res.setEncoding('utf8');
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => onResponse(res, body, resolve));
            });
            req.on('error', reject);
            req.on('timeout', () => {
                req.abort();
                reject(new Error('Request timeout ' + input.timeout + 'ms'));
            });
            req.write(input.body);
            req.end();
        });
    }

}
