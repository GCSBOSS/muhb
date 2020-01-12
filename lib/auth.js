const crypto = require('crypto');

const md5 = input =>  crypto.createHash('md5').update(input).digest('hex');

const methods = {

    digest(auth, opts, data) {

        // TODO This must be strong random
        let cnonce = 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ';

        // TODO add support to other algorithms
        let ha1 = md5(`${auth.username}:${data.realm}:${auth.password}`);
        //if(data.algorithm && data.algorithm.toLowerCase() === 'md5-sess')
        //    ha1 = md5(ha1 + ':' + data.nonce + ':');

        let ha2 = md5(opts.method + ':' + opts.path);

        let [qop] = data.qop.split(/[, ]+/);

        // TODO add support for no QOP
        let response = md5(`${ha1}:${data.nonce}:00000001:${cnonce}:${qop}:${ha2}`);
        //qop ? ... : md5(`${ha1}:${data.nonce}:${ha2}`);

        return {
            username: auth.username, response, realm: data.realm, nc: '00000001',
            nonce: data.nonce, cnonce, uri: opts.path, qop,
            opaque: data.opaque, algorithm: data.algorithm
        };
    }

};

module.exports = function build(auth, opts, input){
    let [type] = input.split(' ');

    let inData = {}
    let regex = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
    while(true){
        let m = regex.exec(input);
        if(!m)
            break;
        inData[m[1]] = m[2] || m[3];
    }
    let fn = methods[type.toLowerCase()];
    let outData = fn(auth, opts, inData);

    let props = [];
    for(let k in outData)
        props.push(`${k}="${outData[k]}"`);

    return type + ' ' + props.join(', ');
};
