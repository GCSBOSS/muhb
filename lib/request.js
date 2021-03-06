const http = require('http');
const https = require('https');
const getAssertions = require('./assertions');
const buildAuth = require('./auth');

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

function performAuth(res){

    this.options.headers.Authorization = buildAuth(
        this.settings.auth,
        this.options,
        res.headers['www-authenticate']
    );
    this.settings.auth = false;

    let req = this.client.request(this.options, res => {
        res.on('error', this.reject);
        res.setEncoding('utf8');
        res.body = '';
        res.on('data', chunk => res.body += chunk);
        res.on('end', () => onResponse.bind(this)(res));
    });
    req.on('error', this.reject);
    req.on('timeout', onTimeout.bind(this, req));
    req.write(this.payload);
    req.end();
}

function onResponse(res){
    if(res.statusCode == 401 && this.settings.auth)
        return performAuth.bind(this)(res);

    res.status = res.statusCode;
    res.assert = getAssertions(res);
    res.cookies = parseCookies(res.headers['set-cookie']);
    this.resolve(res);
}

function getAutomaticHeaders(data){
    let headers = { Date: new Date().toUTCString() };
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

    if(settings.auth){
        headers.Connection = 'keep-alive';
        delete headers.auth;
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

    let auth = input.headers.auth || {};
    let settings = {
        autoHeaders: !input.headers['no-auto'] || false,
        cookies: input.cookies || input.headers.cookies || false,
        timeout: input.timeout || input.headers.timeout || false,

        auth: auth.username || url.username ? {
            username: auth.username || url.username,
            password: auth.password || url.password
        } : false
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

function parseResponseBody(res){

    // TODO should rely on charset portion of content-type; breaking change.
    let ct = res.headers['content-type'];
    if(/(^text\/|\/json$)/.test(ct)){

        // TODO should parse JSON types; breaking change

        res.body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => res.body += chunk);
        return;
    }


    res.body = [];
    res.on('data', chunk => res.body.push(chunk));
    res.on('end', () => res.body = Buffer.concat(res.body));
}

module.exports = {

    request(input){
        let ctx = prepare(input);

        return new Promise(function(resolve, reject){
            ctx.resolve = resolve;
            ctx.reject = reject;
            let req = ctx.client.request(ctx.options, res => {
                res.on('error', reject);
                parseResponseBody(res);
                res.on('end', onResponse.bind(ctx, res));
            });
            req.on('error', reject);
            req.on('timeout', onTimeout.bind(ctx, req));
            req.write(ctx.payload);
            req.end();
        });
    },

    METHODS: [
        'get',
        'put',
        'head',
        'post',
        'trace',
        'patch',
        'delete',
        'connect',
        'options'
    ]

}
