## File&Dir操作
> `pwd` `mkdir` `ls` `rm` `cp` `mv`

#### 路径的表示

1. `.` 当前目录
2. `..`上级目录
3. `~` 用户目录`cd`默认等价于`cd ~`
4. `/` 系统根目录
5. `-` 刚刚那个目录


#### 关于目录常用指令

1. `pwd` 当前目录

2. `mkdir` 创建目录
   * `-p` 创建目录链
   * `-v` 显示创建信息
   * `-m` 指定权限
   * 例如
   ```
   mkdir test  //创建空目录
   mkdir -p a/b/c //递归依次创建a、b、c三个目录
   mkdir -m 777 test //创建权限为rwxrwxrwx的目录test
   ```

3. `rmdir`  删除空目录


4.  `ls` 列出文件详情
    * `-a` 全部文件包含隐藏文件
    * `-A` 全部文件包含隐藏文件，排除`.` `..`
    * `-l` 文件属性
    * `-t` 时间倒叙排序
    * `-d` 仅列出当前目录
    * `-R` 同时列出子目录层
    * `--color` 彩色目录列表
    * 例如
    ```
    ls -lR //列出当前文件夹下所有目录及其子目录所有文件
    ls
    ```
5.  `rm` 删除
    * `-i` 互动模式，删除会询问是否删除
    * `-r` 递归删除
    * `-f` 强制删除，不存在的文件不会出现警告
    * `-v` 显示删除过程
    * 例如
    ```
    rm -rf test //强制删除test文件夹及其下所有内容
    rm -i test.log //询问交互式删除test.log文件
    ```

6.  `cp source target` 复制
    * `-r` 递归复制
    * `-i` 覆盖前询问
    * `-n` 不覆盖
    * 例如
    ```
    cp test.log targetDir  //复制test.log文件至targetDir目录中
    cp -r test1 test2
    ```

7.  `mv` 移动文件或更名
    * `-i` 目标文件存在会询问是否覆盖
    * `-f` 目标文件存在会不会询问，直接覆盖
    * `-b` 覆盖时备份
    * 例如
    ```
    mv test.log test1.log //文件改名，将test.log名字改为test1.log
    mv b.log a.log testDir //将a.log、b.log移动至testDir目录
    mv aDir bDir  //将整个aDir目录及其子项移至bDir中
    mv * ../ //移动当前所有文件及其子项至上级目录
    mv a.log -b b.log //将a.log改名为b.log，并且询问覆盖b.log，且备份b.log
    ```

