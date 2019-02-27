## find、ps
> 查!



###### find
> 目录及其子目录下搜索

 1. `-name` 按名称查找文件
 2. `-size` 按大小查找文件
 3. `-empty` 大小为0的文件或者空目录
 4. `-mtime` 按更改时间(天)查找文件
 5. 例如
 ```
 find -name test.*  //查找名为test开始的文件
 find -name a.log -o -name b.log  //查找名为a.log或者b.log的文件
 find /workspace -size +10k  //查找workspace目录下大于10Kb的文件
 find -size -10b  //查找当前目录下小于10Byte的文件
 find -empty 查找当前目录大小为0或者空目录
 find -mtime +10 10天之前改动过的文件
 find -mtime -5 5天之内(含5天)改动过的文件
 ```


###### ps
> 查看进程

 1. `-a` 不与terminal有关的所有进程
 2. `-A` 所有进程
 3. `-u` 和用户相关进程
 4. `-l` 进程信息包含PID
 5. 例如
 ```
 ps -al
 ```