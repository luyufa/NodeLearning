function MVVm(options) {
    this.$options = options || {};
    const data = this._data = this.$options.data;
    const that = this;

    //数据代理 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(key => {
        that._proxyData(key)
    });

    //计算属性
    this._initComputed();

    //监听数据
    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)//收集依赖 且监听变化->更新视图
}

MVVm.prototype = {
    $watch: function (key, cb, options) {
        new Watcher(this, key, cb);
    },
    _proxyData: function (key) {
        const that = this;
        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return that._data[key];
            },
            set: function proxySetter(newVal) {
                that._data[key] = newVal;
            }
        });
    },
    _initComputed: function () {
        const that = this;
        const computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(key => {
                Object.defineProperty(that, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: function () {

                    }
                })
            })
        }
    }
};