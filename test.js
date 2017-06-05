

const module = {
    exports: {

    }
};
exports = module.exports;




exports.name = 'Alan';
exports.test = function () {
    console.log('hi')
};

// 给导出的对象添加属性，直接这样就好了
console.log(module) // { exports: { name: 'Alan', test: [Function] } }

exports = {
    name: 'Bob',
    add: function (a, b) {
        return a + b;
    }
}

// 不过 ① exports 是一个引用，直接赋值给它，只是让这个变量等于另外一个引用
console.log(exports) // { name: 'Bob', add: [Function] }
// 并不会修改到导出的对象
console.log(module) // { exports: { name: 'Alan', test: [Function] } }

module.exports = {
    name: 'Bob',
    add: function (a, b) {
        return a + b;
    }
}

// ∵① 所以 只有通过 module.exports 才能真正修改到 exports 本身
console.log(module) // { exports: { name: 'Bob', add: [Function] } }