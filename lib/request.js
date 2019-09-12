const http = require('http');
const getAssertions = require('./assertions');

function onResponse(res, body, cb){
    let r = {
        status: res.statusCode,
        headers: res.headers,
        body: body
    }

    r.assert = getAssertions(r);
    cb(r);
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
                port: url.port,
                path: url.pathname + url.search,
                method, timeout,
                headers: assembleHeaders(method, headers, data)
            };
            let req = http.request(options, res => {
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
