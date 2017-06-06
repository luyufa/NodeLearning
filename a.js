function _require(modulePath) {
    const path = require('path');
    const absolutePath = path.resolve(modulePath);
    let module = require(absolutePath);

    function copy(module, newModule) {
        for (let key in module) {
            if (!newModule.hasOwnProperty(key)) {
                delete module[key];
            }
        }

        for (let key in newModule) {
            module[key] = newModule[key];
        }
    }

    setInterval(function () {
        if (require.cache[absolutePath]) {
            delete require.cache[absolutePath];
            let newModule = require(modulePath);
            copy(module, newModule);
        }
    }, 1000);
    return module;
}


const test = require('./test.json');
setInterval(function () {
    console.log(test);
}, 4000);

const fs = require('fs');
setInterval(function () {
    fs.writeFileSync('./test.json','{ "name":"' + Math.random() + '" }')
}, 5000);
