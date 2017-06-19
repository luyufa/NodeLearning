function timeout(ms) {
    // return new Promise((resolve, reject)=> {
    //     setTimeout(function () {
    //         resolve(1);
    //     }, ms);
    // })
    throw  new Error('error');
}


const test = async function (ms) {
    return await timeout(ms);
};
try {
    test(1000)
} catch (err) {
    console.log(err)
}