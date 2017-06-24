## File权限
> linux哲学，一切皆文件

`linux`中对于文件把用户分为三类`拥有者`、`群组`、`其他人`,每种身份都有对应权限rwx

 ls -l 中第一个字段表示文件权限，共十位，如下：

![File权限字段](https://github.com/luyufa/NodeLearning/blob/master/linux/filePermission.png)


文件名前`.`表示隐藏文件

改变文件所属群组
`chgrp [-r] g1 file `

改变文件所属拥有者
`chown [-r] o1 file`

改变文件所属权限
`chmod [-r] u=rwx,g+w,o-x file`


#### 对于普通文件来说权限

1. R 可读取此文件的实际内容
2. W 更新文件内容（没有删除）
3. X 文件具有可执行权限

#### 对于目录文件来说权限
>可以看作文件清单

1. R 可以查看清单内容，不具备对某一个具体文件具体内容的读
2. W 修改清单内容，比如删除文件、新增文件
3. X 是否可以进入该目录，使之成为workspace


路径的表示

1. `.` 当前目录
2. `..`上级目录
3. `~` 用户目录
4. `/` 系统更目录


FHS（目录配置）
`dev`,`etc`,`lib`,`var`,`usr`,`bin`