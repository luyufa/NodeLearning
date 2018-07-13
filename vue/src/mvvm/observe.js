function Observer(data) {
    this.data = data;
    this.walk(data);
}

/*
数据劫持
get收集依赖
set触发更新
* */
Observer.prototype = {
    walk: function (data) {
        const that = this;
        Object.keys(data).forEach(key => that.convert(key, data[key]))
    },
    convert: function (key, value) {
        this.defineReactive(this.data, key, value)
    },
    defineReactive: function (data, key, value) {
        const dep = new Dep(key);
        let childObj = observe(value);//子属性监听

        Object.defineProperty(data, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (Dep.target) {//Watcher 实例
                    dep.depend();//收集依赖
                }
                return value;
            },
            set: function (newVal) {
                if (newVal === value) {
                    return;
                }
                value = newVal;
                childObj = observe(newVal);//新设置的属性可能是对象
                dep.notify();//通知视图更新
            }
        })
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
};
