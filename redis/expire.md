## 生存时间
> 可以给键设置一个生存时间，到期后Redis自动删除

如果WATCH监控了一个拥有到期时间的键，并且到期后自动删除了，WATCH并不会认为该键被改变了。

1. `EXPIRE key seconds` 给key设置seconds秒后删除
2. `PEXPIRE key milliseconds` 给key设置seconds毫秒后删除
3. `TTL key` 查询`key`的生存时间
4. `PERSIST key` 取消键的生存时间,`SET`命令也会取消键的生存时间
5. `EXPIREAT key unix` 给key设置到期时间，单位为秒
6. `PEXPIREAT key unix` 给key设置到期时间，单位为毫秒


#### 实现频率访问限制60S内最多100次

```
if(EXISTS ip){
  INCR ip
  if(GET ip >100){
  console.log(`超出限制`)
  }
}else{
 MULTI
 INCR ip
 EXPIRE ip 60
 EXEC
}
```

#### 实现缓存

```
if(GET cache){
  return GET cache
}else{
  MULTI
  SET cache value
  EXPIRE cache seconds
  EXEC
}
```

如果大量设置缓存且生存时间过长会导致redis内存占满，如果设置的较低则缓存不容易命中，为此可以设置Redis最大使用内存并且按照一定的策略来淘汰溢出的key

Redis支持的淘汰键规则

|规则|说明|
|----|---|
|volatile-lru|使用LRU算法删除一个键（仅对设置了生存时间的键生效）|
|allkeys-lru| 使用LRU算法删除一个键 |
|volatile-random| 随机删除一个键（仅对设置了生存时间的键生效）|
|allkeys-random |随机删除一个键|
|volatile-ttl|删除生存时间最短的一个键|
|noeviction|不删除键，返回错误|


一旦内存超过限制则按照指定策略删除键直到内存小于限制未知

事实上Redis并不会准确按照最久未被使用的键来删除，而是随机取三个键，删除这三个键中最久未被使用的键，而这个`三`可以在配置文件中修改