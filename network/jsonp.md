## JSONP
> 由于`<script>`标签不会受浏览器同源策略影响，调用跨域服务器上的动态js文件,客户端传递一个`callback`函数过去，服务端把要返回的`json`数据使用`callback包裹`起来，便形成了一种传输协议即`JSONP`。


上代码

server(逻辑处理完后返回数据用callback包裹形成字符串反回客户端解析执行)

```
app.get('/api', function (req, res, next) {
    const callback = req.query.callback;

    ...TODO

    return res.send(`
    ${callback}({
    code: 200,
    data: [
        {
            name: 'luyufa',
            age: 23
        }
    ]
   });
    `)
});
```

client(脚本加载完后会回调getUsers便拿到服务端返回的数据了)

```
<script type="text/javascript">
    function getUsers(users) {
        console.log('client', users)
    }
</script>
<script type="text/javascript" src="http://cors/api?callback=getUsers"></script>
```

