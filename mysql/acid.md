## mysql [ACID](https://draveness.me/mysql-transaction)

##### 原子性
> 事务中的所有数据库操作都执行成功才算成功，有一个失败则回退到执行之前


##### 一致性
> 数据库从一种状态变为另一种状态后，完整性约束没有被破坏


##### 持久性
> 事务一旦提交，则其结果是永久的，及时宕机也可以恢复


##### 隔离性
> 一个事务的影响在提交前其他事务都不可见-通过锁实现



重做日志(redo)=重做日志缓冲区+重做日志文件

当我们在一个事务中尝试对数据进行修改时，它会先将数据从磁盘读入内存，并更新内存中缓存的数据，然后生成一条重做日志并写入重做日志缓存，当事务真正提交时，MySQL 会将重做日志缓存中的内容刷新到重做日志文件，再将内存中的数据更新到磁盘上的。即写数据前先写日志


回滚日志(undo)

所有事务进行的修改都会先记录到这个回滚日志中，然后在对数据库中的对应行进行写操作。回滚日志并不能将数据库物理地恢复到执行语句或者事务之前的样子；它是逻辑日志，当回滚日志被使用时，它只会按照日志逻辑地将数据库中的修改撤销掉看，可以理解为，我们在事务中使用的每一条 INSERT 都对应了一条  DELETE，每一条 UPDATE 也都对应一条相反的 UPDATE 语句



