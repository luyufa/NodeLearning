const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

const rs = new Readable({objectMode: true});
const ws = new Writable({objectMode: true});


rs._read = function () {
    this.push({"name": "luyufa"});
    this.push(null);
};
ws._write = function (chunk, enc, next) {
    try {
        console.log('chunk', chunk)
    } catch (err) {
        return next(err);
    }
    return next()
};
rs.pipe(ws);