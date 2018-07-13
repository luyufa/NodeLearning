function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment)
    }
}

Compile.prototype = {
    init: function () {
        this.compileElement(this.$fragment)
    },

    compileElement: function (el) {
        const childNodes = el.childNodes;
        const that = this;
        Array.prototype.slice.call(childNodes).forEach(node => {
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/;

            if (that.isElementNode(node)) {
                that.compile(node)
            }
            else if (that.isTextNode(node) && reg.test(text)) {
                that.compileText(node, RegExp.$1)
            }

            if (node.childNodes && node.childNodes.length) {
                that.compileElement(node)
            }

        })
    },

    isElementNode: function (node) {
        //1 元素结点
        //2 属性结点
        //3 文本结点
        return node.nodeType === 1;
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') === 0;
    },
    isEventDirective: function (dir) {
        return dir.indexOf('on') === 0;
    },

    node2Fragment: function (el) {//dom结点转换为Fragment
        //1、原dom树中的结点添加到fragment中时会从dom树种删除
        //2、fragment中的结点不在dom树内
        //3、node.appendChild没添加一次便刷新一次页面  fragment.appendChild则不会
        let fragment = document.createDocumentFragment(), child;
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment;
    },
    compileText: function (node, exp) {
        compileUtil.text(node, this.$vm, exp)
    },
    compile: function (node) {
        const attrNodes = node.attributes;
        const that = this;
        Array.prototype.slice.call(attrNodes).forEach(attr => {
            const attrName = attr.name;
            if (that.isDirective(attrName)) {
                const exp = attr.value;//指令值
                const dir = attrName.substring(2);//指令
                if (that.isEventDirective(dir)) {//事件指令
                    compileUtil.eventHandler(node, that.$vm, exp, dir)
                } else {//普通指令
                    compileUtil[dir] && compileUtil[dir](node, that.$vm, exp)
                }

                node.removeAttribute(attrName)
            }
        })
    }
};

const compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    //v-html
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    //v-model
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, 'model');
        const that = this;
        let val = that._getVMVal(vm, exp)
        node.addEventListener('input', function (e) {
            const newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            that._setVMVal(vm, exp, newVal);
            val = newVal
        })
    },
    //v-class
    class: function (node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    },


    bind: function (node, vm, exp, dir) {
        const updaterFn = updater[`${dir}Updater`];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));//第一次初始化时

        new Watcher(vm, exp, function (value, oldValue) {//监听之后的变化
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    eventHandler: function (node, vm, exp, dir) {
        //dir  v-on:click
        //exp  add(item)
        const eventType = dir.split(':')[1];
        const fn = vm.$options.methods && vm.$options.methods[exp]
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
            //true 捕获阶段执行
            //false 冒泡阶段执行
        }
    },

    _getVMVal: function (vm, exp) {
        let val = vm;
        exp = exp.split('.');
        exp.forEach(k => {
            val = val[k]
        });
        return val;
    },
    _setVMVal: function (vm, exp, value) {
        const val = vm;
        exp = exp.split('.');
        exp.forEach((k, i) => {
            if (i < exp.length - 1) {
                val[k] = val;
            } else {
                //最后一个值
                val[k] = value
            }
        })
    }
};

const updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },

    classUpdater: function (node, value, oldValue) {
        let className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '')//删除老样式、替换末尾空白符
        const space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    },

    modelUpdater: function (node, value) {
        node.value = typeof value === 'undefined' ? '' : value
    }
};