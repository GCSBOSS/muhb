const { EventEmitter } = require('events');
const { request, METHODS } = require('./request');

function getStandbyPromise(){
    let resolve, reject;
    let promise = new Promise((y, n) => {
        resolve = y;
        reject = n;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}

function workDone(action, req, res){
    this.busy--;
    this.emit(action == 'resolve' ? 'response' : 'failure', res);
    req.promise[action](res);
    this.responses.push(res);

    if(this.running && this.queue.length > 0)
        return this.pull();

    let remaining = this.busy + (this.running ? this.queue.length : 0);
    if(remaining == 0){
        this.workDone.resolve(this.responses);
        this.workDone = getStandbyPromise();
        this.emit('finish', this.responses);
        this.responses = [];
    }
}

module.exports = class Pool extends EventEmitter {

    constructor({ size = 100, timeout = 10000 } = {}){
        super();
        this.size = size;
        this.timeout = timeout;
        this.queue = [];
        this.busy = 0;
        this.workDone = getStandbyPromise();
        this.responses = [];
        this.running = true;
        METHODS.forEach(m => this[m] = this.push.bind(this, 'post'));
    }

    pull(){
        if(this.busy == this.size || !this.running)
            return false;

        let req = this.queue.shift();
        this.busy++;
        this.emit('request', req);

        request({ ...req, timeout: this.timeout }).then(
            res => workDone.bind(this)('resolve', req, res)
        ).catch(
            err => workDone.bind(this)('reject', req, err)
        );
        return true;
    }

    push(method, url, headers, body){
        body = typeof headers == 'object' ? body : headers;
        let promise = getStandbyPromise();
        let req = { method, url, headers, body, promise };
        this.queue.push(req);
        this.pull();
        return promise;
    }

    done(){
        return this.workDone;
    }

    pause(){
        this.running = false;
        return this.workDone;
    }

    resume(){
        this.running = true;
        while(this.pull());
        return this.workDone;
    }

};
