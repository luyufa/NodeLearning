## pm2


启动 通过json或js配置文件 `pm2 satrt xxx.js`

     ```
     module.exports = exports = {
     apps: [{
        name: 'application name',

        cwd: __dirname,//application directory

        script: 'app.crawler.js',//application main

        args: 'a b c',//process.argv node app.js a b c

        // interpreter interpreter absolute path (default to node)

        exec_mode: 'fork',// cluster or fork(default)

        watch: false,//app reload when file change

        ignore_watch : ["node_modules"], //ignore files change

        max_memory_restart: '2G',// 10M 2G 100K app restart when

        memory overflow

        env: {
            NODE_ENV: 'development'
        },//progress.env

        error_file: 'error file path',

        out_file: 'out file path',

        autorestart: true,//default true ,if false app not restart
        when app exit

        restart_delay: 0,//wait 0ms before restart app

        max_restarts: 15,//max restart count

    }]
    };
     ```

`pm2 monit id`

`pm2 logs id`

`pm2 show id`

`pm2 restart` //重启

`pm2 reload` //重新加载

`pm2 stop` //暂停执行

`pm2 delete` //彻底删除应用



 * 参考[pm2 document](http://pm2.keymetrics.io/)

