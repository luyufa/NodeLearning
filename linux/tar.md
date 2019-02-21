## linux基本操作（一）安装Node、tar命令
> 本文主要涉及linux下如何安装或升级Node和Npm，以及常用命令tar的使用



##### Node安装
直接官网

1. 下载

    官网[Node下载](http://nodejs.cn/download/)
    `wget -c https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz`目标版本Node
2. 解压
   `tar -xvf node-v8.9.1-linux-x64.tar.xz`，因为我们下载的是已经编译好的，所以解压完成后即可
3. 软连
   这种方式安装的 Nodejs 有一个很大的缺陷是我们无法全局使用`node`和`npm`命令，我们需要建立两个软链接
   ```
   sudo ln -s 你的目录/nodejs/bin/node /usr/local/bin/node
   sudo ln -s 你的目录/nodejs/bin/npm /usr/local/bin/npm
   ```
4. 验证
   要验证是否安装成功最简单的方式是使用如下命令
   ```
   node -v
   npm -v
   ```

ps: 详情参考[（小白指南）在 Linux 服务器上安装 Nodejs、Nginx 以及部署 Web 应用](https://segmentfault.com/a/1190000012297511)


##### tar
> 压缩、解压缩、打包、解包

1.参数
  * `c` 新建压缩文件
  * `v` 显示操作过程
  * `f` 指定压缩文件
  * `x` 释放压缩文件
  * `z` 指定`gzip`压缩方式,类似还有`Z(compress)`、`j(bzip2)`等
  * `t` 显示压缩文件的内容
  * `p` 保留原始属性
  * `r` 追加内容至包中
  * `-C` 指定目录
  * `--exclude` 排除文件

2.例如
 * 打包 `tar cvf file.tar file`
 * 解包 `tar xvf file.tar`

 * 压缩 `tar cvzf file.tar.gz file`
 * 解压 `tar xvzf file.tar`

 * 查看tar包 `tar tvf file.tar`
 * 查看tar.gz包 `tar ztvf file.tar.gz`

 * 追加内容 `tar rvf file.tar a.log`

 * 释放文件至指定目录 `tar xvf file.tar -C ../tmpDir`
 * 打包指定目录下的文件 `tar cvf file.tar -C ../tmpDir ./files`

 * 排除html文件类型 `tar cvf file.tar /tmpDir/ --exclude=*.html`


ps: 详情参考[linux命令之tar](https://linux.cn/article-7802-1.html)


