## redis清除大key
> where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash. Removing a single key that holds a string value is O(1)


前言是引用自reids官网的一段话，主要内容就是执行删除操作时，除了`string`是复杂度`O(1)`以外,`hash`、`list`、`set`、`sorted` `set`的复杂度都是`O(m)`,m为元素个数。也就是说key“足够大”，那么删除耗时便足够长。

这个key足够大可以从两个方面理解：
 1. 通过上文明确表明，这里的足够大应该指的是元素数量，而非所占内存大小，即一个string 200MB，删除的复杂度依然很快仅仅为O(1)。
 2. 删除效率是与元素个数成正相关的。

倘若直接`del key`，如果是一个1KW量级的key，将会导致redis阻塞10余秒，随后io瞬间被之前的命令打满，导致redis无法正常提供服务，进而影响数据库....最后的最后可能彻底蹦了。



##### 如何删除?
> 拆分慢慢删除。

* `sorted set` 使用`zremrangebyrank key 0 1000`，每次删除top 1000，循环删除
* `set` 使用`spop key 1000`，每次删除1000个元素，循环删除
* `list` 使用`ltrim key 0 -1000`，每次删除最后1000个元素，循环删除（负数表示从末端计数）
* `hash` 使用`hscan + hdel` ，先扫描，在一个一个依次删除


##### redis 4.0
> lazyfree ,仅逻辑删除，由后台线程慢慢删除

* `unlink`

* `config`
```
lazyfree-lazy-eviction no
内存使用达到maxmeory，并设置有淘汰策略时；在被动淘汰键时，
是否采用lazy free机制。开启lazy free, 可能使用淘汰键的内存释放不及时，导致redis内存超用，
超过maxmemory的限制

lazyfree-lazy-expire no
设置有TTL的键，达到过期后，被redis清理删除时是否采用lazy free机制

lazyfree-lazy-server-del no
针对有些指令在处理已存在的键时，会带有一个隐式的DEL键的操作。
如rename命令，当目标键已存在,redis会先删除目标键，如果这些目标键是一个big key,那就会引入阻塞删除的性能问题。
此参数设置就是解决这类问题，建议可开启。

slave-lazy-flush no
针对slave进行全量数据同步，slave在加载master的RDB文件前，会运行flushall来清理自己的数据场景，
参数设置决定是否采用异常flush机制。如果内存变动不大，建议可开启
```
