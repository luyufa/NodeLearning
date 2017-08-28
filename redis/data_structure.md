## Redis五种数据结构

#### String字符串
> key value

 1. `SET key value` 赋值
 2. `GET key` 取值，key不存在时返回null
 3. `INCR key` 当存储的字符串是整数形式时，让当前键值自增1，当key不存在时，默认从0开始自增1
 4. `DECR key`,`INCRBY key increment`,`DECRBY key decrement`
 5. `APPEND key value` 向键值的末尾追加value
 6. `STRLEN key` 返回键值长度
 7. `MSET key value [key value ...]` 批量赋值
 8. `MGET key [key ...]` 批量取值


#### Hash散列
> key field value，不支持多级嵌套，即value只能是字符串

 1. `HSET key filed value` 赋值
 2. `HGET key filed` 取值
 3. `HMSET key filed value [filed value ...]` 批量赋值
 4. `HMGET key filed [filed ...]` 批量取值
 5. `HGETALL key` 获取key的所有字段
 6. `HEXISTS key filed` 判断字段是否存在
 7. `HSETNX key filed value` 字段不存在时赋值，存在什么都不做
 8. `HINCRBY key filed increment` 自增
 9. `HDEL key filed` 删除字段
 10. `HKEYS key` 获取所有字段名
 11. `HVALS key` 获取所有字段值
 12. `HLEN key` 获取字段数量

#### List列表
> key [] 使用双向链表实现，不支持多级嵌套，即value只能是字符串

1. `LPUSH key value [value ...]` 从左边添加元素
2. `RPUSH key value [value ...]` 从右边添加元素
3. `LPOP key` 从左边弹出元素
4. `RPOP key` 从右边弹出元素
5. `RPUSH+RPOP` 模拟栈操作
6. `RPUSH+LPOP` 模拟队列操作
7. `LLEN` 列表中元素个数
8. `LRANGE key start end` 范围内的元素(包含两端)
9. `LREM key count value` 删除count个值为value的元素
10. `LINDEX key index` 获得索引的元素值
11. `LSET key index value` 为索引为index的元素赋值value
12. `LTRIM key start end` 删除索引范围外的元素

