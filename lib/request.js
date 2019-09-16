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

module.exports = {

    request({ method, url, headers, body, timeout }){
        var data = typeof body == 'undefined' ? '' : String(body);
        return new Promise(function(resolve, reject){
            url = new URL(url);
            let options = {
                hostname: url.hostname,
                port: url.port, method, timeout,
                path: url.pathname + url.search,
                headers: assembleHeaders(method, headers, data)
            };
            let client = url.protocol === 'https:' ? https : http;
            let req = client.request(options, res => {
                res.on('error', reject);
                res.setEncoding('utf8');
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => onResponse(res, body, resolve));
            });
            req.on('error', reject);
            req.on('timeout', () => {
                req.abort();
                reject(new Error('Request timeout ' + timeout + 'ms'));
            });
            req.write(data);
            req.end();
        });
    }

}
