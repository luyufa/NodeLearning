## docker基础

###### Dockerfile

1. `FROM` 获取一个基础镜像，可以去[docker hub](https://hub.docker.com/)下载需要的镜像
2. `RUN` 执行一条命令用于构建镜像的一层
3. `WORKDIR` 容器运行时的工作目录
4. `COPY` 从当前目录复制文件至镜像目录内
5. `ADD` 基本用法和`COPY`一致，可以拷贝文件，更可以解压和从url直接下载
6. `CMD` 运行容器时执行的第一条命令



举个栗子
```
FROM node:10-alpine

COPY sources.list $CATALINA_HOME/
RUN cat $CATALINA_HOME/sources.list > /etc/apk/repositories

# Install yasm & ffmpeg
RUN apk update \
   && apk add yasm \
   && apk add ffmpeg

# Install bash
RUN apk add bash

# Create app directory
RUN mkdir -p /search/odin/yunbiaoqing-server
WORKDIR /search/odin/yunbiaoqing-server

# Install app dependencies
COPY package.json /search/odin/yunbiaoqing-server/package.json
RUN npm i --registry=https://registry.npm.taobao.org

CMD [ "node" ]
```

###### 基本指令

* 构建镜像

   `docker build [options] path`
   * `-t` 指定镜像[名称:版本]
   * `-f` 指定用于构建的`Dockerfile`文件

    `docker build -t luyufa:latest -f Dockerfile .`(注意这个`.`是当前目录)
* 运行容器

   `docker run [options] image`
   * `-d` 容器在后台运行
   * `-p` 容器暴露出的端口
   * `--name`容器名字

   `docker run --name yunbiaoqing -p 7001:7001 -d yunbiaoqing:latest`

* 查看镜像

   `docker images`

* 删除镜像

   `docker rmi image`

* 查看容器

   `docker ps -a`

* 启动容器

   `docker start container`

* 停止当前容器

   `docker kill container`

   `docker stop container`

* 删除容器

   `docker rm container`

* 查看容器输出日志

   `docker logs container -f`

* 快速批量删除无用镜像

   <code>docker rmi -f \`docker images | grep '<none>' | awk '{print $3}'\`</code>

* 快速批量删除无用容器

   <code>docker rm \`docker ps -a | grep Exited | awk '{print $1}'\` </code>



###### 参考：

*  [docker document](https://docs.docker.com/engine/reference/commandline/build/)
