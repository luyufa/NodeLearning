let uid = 0;

function Dep(key) {
    this.key = key;
    this.id = uid++;
    this.subs = [];
}

/*
收集Watcher实例
* */
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
        console.log(this.key, 'this.subs', this.subs)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    },
    removeSub: function (sub) {
        const index = this.subs.indexOf(sub);
        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    },
    depend: function () {
        //Dep.target为Watcher实例
        //调用Watcher的addDep方法，将自身(Dep实例)传递过去
        Dep.target.addDep(this);
    }
};
Dep.target = null;