function console() {
    function toString(o) {
        if (Object.prototype.toString.call(o) === '[object Array]') {
            let str = '[ ';
            o.forEach(item=> {
                str += toString(item) + ',';
            });
            str = str.slice(0, str.length - 1);
            str += ' ]';
            return str;
        }
        else if (Object.prototype.toString.call(o) === '[object Object]') {
            let str = '{ ';
            Object.keys(o).forEach(key=> {
                str += key + ':' + toString(o[key]) + ',';
            });
            str = str.slice(0, str.length - 1);
            str += ' }';
            return str;
        }
        else {
            return o;
        }
    }

    let totalLength = 0;
    const bufferList = (Array.prototype.slice.apply(arguments) || []).map(item=> {
        let buf = Buffer.from(toString(item));
        totalLength += buf.length;
        return buf;
    });

    process.stdout.write(Buffer.concat(bufferList, totalLength));
    process.stdout.write('\n');
}
