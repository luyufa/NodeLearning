## RESTful API
> 把url当作资源,通过method(`GET` `POST` `DELETE` `PUT`)对资源做不同的动作。


`url`作为资源，其中不应该包含动词。

`api`版本号可以放在`request headers`



||CURD|是否幂等|
|---|---|---|
|GET| 查询|是|
|POST|添加|否|
|PUT| 修改|是|
|DELETE|删除|是|


四个动词方法从本质来说没有差别，协议是一种约定俗成。

