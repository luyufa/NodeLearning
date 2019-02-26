## tail grep
> 查看、编辑



###### tail
> 显示文件末尾内容

 1. `-n` 显示行数
 2. `-f` 循环显示
 3. 例如
 ```
 tail -n 5 error.log //查看error日志最后5行
 tail -n +5 error.log //从第5行开始显示日志
 ping www.baidu.com & tail -f ping.log  // 实时显示ping的最新结果
 ```


###### grep
> 文本搜索,支持正则匹配

1. `-c` 统计匹配个数
2. `-n` 显示行号
3. `-i` 忽略大小写
3. 例如
```
grep 深入学习 study.log   //匹配study.log文件中“深入学习”
grep -c 深入学习 study.log   //匹配study.log文件中“深入学习”次数
grep -n 深入学习 study.log     //匹配study.log文件中“深入学习”,并展示行号
grep 深度学习 a.log b.log  //从多个文件中查找
cat study.log|grep 深入学习
cat study.log|grep ^深入学习 匹配已深入学习开头
```


###### 基本vi操作

 1. 打开

     * `vi new.log` 创建一个或者打开new.log文件
     * `vi -R new.log` 已只读方式打开new.log文件

 2. 退出

     * `q!` 强制退出不保存
     * `q` 提示保存
     * `wq` 保存文件且退出

 3. 编辑模式和命令模式切换
     * `i` 从命令模式切换至编辑模式
     * `Enter` 从编辑模式切换至命令模式