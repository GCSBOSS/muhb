const http = require('http');

function request(url, headers, method, data){
    return new Promise(function(resolve, reject){
        url = new URL(url);
        let options = {
            hostname: url.hostname,
            port: url.port,
            method: method,
            path: url.pathname + url.search,
            headers: typeof headers == 'object' ? headers : {}
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
        if(typeof data == 'string')
            req.write(data);
        req.end();
    });
}

module.exports = {
    get(url, headers){
        return request(url, headers || {}, 'GET', false);
    },

    post(url, headersOrBody, body){
        body = body || headersOrBody;
        return request(url, headersOrBody, 'POST', body);
    },

    patch(url, headersOrBody, body){
        body = body || headersOrBody;
        return request(url, headersOrBody, 'PATCH', body);
    },

    delete(url, headers){
        return request(url, headers, 'DELETE', false);
    },

    put(url, headersOrBody, body){
        body = body || headersOrBody;
        return request(url, headersOrBody, 'PUT', body);
    },

    head(url, headers){
        return request(url, headers || {}, 'HEAD', false);
    },

    options(url, headers){
        return request(url, headers || {}, 'OPTIONS', false);
    },

    request: request
};
