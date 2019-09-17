const http = require('http');
const https = require('https');
const getAssertions = require('./assertions');

function parseCookies(cookies){
    let r = {};

    if(Array.isArray(cookies))
        for(let c of cookies){
            let [ key, value ] = c.split(';')[0].split('=');
            r[key] = value;
        }

    return r;
}

function stringifyCookies(cookies){
    let r = '';
    for(let name in cookies)
        r += name + '=' + cookies[name] + '; ';
    return r;
}

function onResponse(res, body, cb){
    res.status = res.statusCode;
    res.body = body;
    res.assert = getAssertions(res);
    res.cookies = parseCookies(res.headers['set-cookie']);
    cb(res);
}

function getAutomaticHeaders(data){
    let headers = { Date: (new Date()).toUTCString() };
    if(data.length > 0){
        headers['Content-Type'] = 'application/octet-stream';
        headers['Content-Length'] = Buffer.from(data).length;
    }
    return headers;
}

function assembleHeaders(method, headers, data){
    headers = typeof headers == 'object' ? headers : {};

    if(headers['--no-auto'] || headers['no-auto']){
        delete headers['--no-auto'];
        delete headers['no-auto'];
    }
    else
        headers = { ...getAutomaticHeaders(data), ...headers };

    if(typeof headers.cookies == 'object'){
        headers.Cookie = stringifyCookies(headers.cookies);
        delete headers.cookies;
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
