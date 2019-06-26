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

[ 'get', 'post', 'patch', 'put', 'delete', 'head', 'options' ].forEach( m => {
    module.exports[m] = (url, headersOrBody, body) =>
        request(url, headersOrBody, m.toUpperCase(), body || headersOrBody);
});

module.exports.request = request;
module.exports.del = module.exports.delete;
