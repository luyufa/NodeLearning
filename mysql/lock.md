## 常见索引问题

隔离级别 | 脏读 | 可否重复读 | 幻读
---|---|----|---
未提交读`Read uncommitted` | 可能|不可重复读|可能
已提交读`Read committed` | 不可能|不可重复读|可能
可重复读`Read Repeatable` | 不可能|可重复读|可能
可串性化`Serializable` | 不可能|不可能|不可能


* `脏读`:一个事务可以读取到另一个事务未提交的数据

```
session A:
begin
select * from Table
1 row
                            Session B:
                            begin
                            insert into Table
select * from Table
2 rows
commit
                            commit
```


* `不可重复读`:一个事务两次读取数据之间，另一个事务修改了数据(已提交)，导致两次读取结果不一致

```
session A:
begin
select * from Table
1 row a=1
                              Session B:
                              begin
                              update Table a=2
                              commit
select * from Table
1 row a=2
commit
```

* `幻读`:一个事务两次读取数据之间，另一个事务插入了数据(已提交)，导致两次读取结果数不一致

```
session A:
begin
select * from Table
1 row
                              Session B:
                              begin
                              insert into Table b
                              commit
select * from Table
2 rows
commit
```

1. 脏读与不可重复读的区别在于：读取的数据是否提交
2. 不可重复读与幻读的区别在于：前者是读取结果不一致，后者是读取数量不一致，从锁的角度来看就是对于前者只需锁满足条件的记录即可，但是对于后者需要锁住满足条件极其相近的记录



###### 锁的算法


* 二段锁协议:
    * 加锁阶段:在读取数据前加S锁，写数据前加X锁，加锁不成功则等待。
    * 解锁阶段:仅能进行释放锁操作

1. `Record lock` 单条索引记录上加锁，`record lock`锁住的永远是索引(没有的话就锁住隐式主键)，而非记录本身。如果一个条件无法通过索引快速过滤，存储引擎层面就会将所有记录加锁后返回，再由MySQL Server层进行过滤。


2. `Gap lock` 符合条件的已有数据记录的索引项加锁；对于键值在条件范围内但并不存在的记录，叫做“间隙。对于等值查询不仅锁住了相应的数据行；同时也在两边的区间，都加入了gap锁。

id | name
---|---
1 | L
2 | Y
3 | F
4 | G
5 | G

锁住`(2,Y)-(3,F) `   `(3,F)-(5,G) `
```
select * from Table where name=F for update
```


3. `Next-Key lock` `Gap`+`Recore` ,`RR`模式下的默认行锁定算法

mysql `RR`级别下采用此方式解决幻读

```
session A:
begin
select * from Table id > 5 :加锁(5,infinite )
1 row
                              Session B:
                              begin 阻塞直到SessionA释放
                              insert into (id=10) Table b
                              commit
                              time out error
select * from Table
1 rows
commit
```


###### 一致性的非锁定行读
> 通过多版本控制，读取当前执行时间的行，如果读取行正在进行写操作，此时读取操作并不会等待锁释放，而是读取该行的一个快照。

###### `Read uncommitted`
>任何操作都不加锁


###### `Read committed`
>读操作不加锁，写操作加锁

```
Session A:
begin
update Table A id=1
                                Session B:
                                begin
                                update Table B id=1

                                throw time out error
commit
```

假设id是有索引的即仅锁住id=1的行即可，但是如果id没索引，则会锁住全表，在Mysql server层过滤，释放哪些不满足记录的锁(违反二段锁协议)


###### `Read Repeatable`

```
Session A:
begin
select * from Table where id=1
2 rows a b

                                 Session B:
                                 begin
                                 update Table where id=1
                                 commit

                                 Session C:
                                 begin
                                 insert Table c id=1
                                 commit
select * from Table where id=1
2 rows a b
commit
```
在SessionA中两次读取数据，都读到一样的数据（期间sessionBC修改了数据），这是由于在`RR`级别下数据库会采用`next-key lock`算法，锁住索引范围内数据，避免不可重复读。


###### `Serializable`
> 读操作加S锁，写操作加X锁，读写互斥，并发能力查，顺序执行






###### 悲观锁
在整个数据处理过程中，将数据处于锁定状态。悲观锁的实现，往往依靠数据库提供的锁机制（也只有数据库层提供的锁机制才能真正保证数据访问的排他性）。在悲观锁的情况下，为了保证事务的隔离性，就需要一致性锁定读。读取数据时给加锁，其它事务无法修改这些数据。修改删除数据时也要加锁，其它事务无法读取这些数据。


###### 乐观锁

使用数据版本（Version）记录机制实现，这是乐观锁最常用的一种实现方式。何谓数据版本？即为数据增加一个版本标识，一般是通过为数据库表增加一个数字类型的 “version” 字段来实现。当读取数据时，将version字段的值一同读出，数据每更新一次，对此version值加一。当我们提交更新的时候，判断数据库表对应记录的当前版本信息与第一次取出来的version值进行比对，如果数据库表当前版本号与第一次取出来的version值相等，则予以更新，否则认为是过期数据





