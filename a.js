setImmediate(function () {
    console.log(7)
});
setTimeout(function () {
    console.log(1)
}, 0);
process.nextTick(function () {
    console.log(6)
    process.nextTick(function () {
        console.log(8)
    })
});
new Promise(function executor(resolve) {
    console.log(2);
    for (var i = 0; i < 10000; i++) {
        i == 9999 && resolve();
    }
    console.log(3);
}).then(function () {
    console.log(4);
});
console.log(5); 