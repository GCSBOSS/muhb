const http = require('http');
const https = require('https');
const getAssertions = require('./assertions');

function parseCookies(cookies){
    let r = {};

    if(Array.isArray(cookies))
        for(let c of cookies){
            let [ key, value ] = c.split(';')[0].split('=');
            r[key] = decodeURIComponent(value);
        }

    return r;
}

function stringifyCookies(cookies){
    let r = '';
    for(let name in cookies)
        r += name + '=' + encodeURIComponent(cookies[name]) + '; ';
    return r;
}

function onResponse(res, cb){
    res.status = res.statusCode;
    res.assert = getAssertions(res);
    res.cookies = parseCookies(res.headers['set-cookie']);
    this.resolve(res);
}

function getAutomaticHeaders(data){
    let headers = { Date: (new Date()).toUTCString() };
    if(data.length > 0){
        headers['Content-Type'] = 'application/octet-stream';
        headers['Content-Length'] = Buffer.from(data).length;
    }
    return headers;
}

function setupHeaders(headers, settings, body){
    headers = { ... headers };
    if(!settings.autoHeaders)
        delete headers['no-auto'];
    else
        headers = { ...getAutomaticHeaders(body), ...headers };

    if(settings.cookies){
        headers.Cookie = stringifyCookies(settings.cookies);
        delete headers.cookies;
    }

    return headers;
}

function prepareBody(body){
    let t = typeof body;
    if(t == 'undefined' || body === null)
        return '';
    if(body instanceof Buffer)
        return body;
    if(t == 'object')
        return JSON.stringify(body);
    return String(body);
}

function prepare(input){
    let url = new URL(input.url);
    let payload = prepareBody(input.body);

    input.headers = typeof input.headers == 'object' ? input.headers : {};
    let settings = {
        autoHeaders: !input.headers['no-auto'] || false,
        cookies: input.headers.cookies || false,
        auth: input.headers.auth || false,
        timeout: input.timeout || false
    };

    let headers = setupHeaders(input.headers, settings, payload);

    let client = url.protocol === 'https:' ? https : http;

    let options = {
        headers,
        method: input.method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search
    };

    if(settings.timeout)
        options.timeout = settings.timeout;

    return { input, options, settings, client, payload };
}

function onTimeout(req){
    req.abort();
    this.reject(new Error('Request timeout ' + this.settings.timeout + 'ms'));
}

module.exports = {

    request(input){
        let ctx = prepare(input);

        return new Promise(function(resolve, reject){
            ctx.resolve = resolve;
            ctx.reject = reject;
            let req = ctx.client.request(ctx.options, res => {
                res.body = '';
                res.setEncoding('utf8');
                res.on('error', reject);
                res.on('data', chunk => res.body += chunk);
                res.on('end', onResponse.bind(ctx, res));
            });
            req.on('error', reject);
            req.on('timeout', onTimeout.bind(ctx, req));
            req.write(ctx.payload);
            req.end();
        });
    }

}
