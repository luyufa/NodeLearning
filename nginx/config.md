`基本使用`
 * nginx -t 检测配置文件是否正确
 * nginx -v 版本
 * start nginx 启动
 * nginx -s stop     nginx -s reload    pkill -9 nginx
 * 添加至linux service管理


`nginx.conf`
```
pid logs/pid;  进程pid

worker_process auto; 默认为1 可以设置为cpu核心数

worker_cpu_affinity 0001 0010 0100 1000; 设置cpu粘性，降低cpu切换消耗

worker_rlimit_nofile 65535; 打开的最大文件数(最大连接数) 默认为65535（TCP数据报端口使用16位存储，即2^16-1）

events {

    worker_connections 2048;每一个worker可以处理的最大并发数
    1. 当nginx作为反向代理时，最大连接数为:worker_process * worker_connections / 4
    2. 当nginx作为服务器时,最大连接数为:worker_process * worker_connections / 2

    use epoll; 轮询方法 select poll epoll

    multi_accept on; 在接受一个连接时尽可能多的接收连接，如果开启则将所有当前需处理连接放入队列；否则由其他worker依次接受
}

http {
    include mime.types;

    default_type application/octet-stream; 当文件mime类型不存在时的默认类型，的方式字节流处理(浏览器直接下载)

    send_file on; 普通应用设置为on；重磁盘应用设置为off(平衡网络与磁盘的处理速度)

    keepalive_time 60; 长连接(多个http复用一个tcp)释放时间，单位秒
    短了易频繁创建tcp连接增加消耗
    长了导致连接无法释放，会造成open many files错误
    整个通信过程为 http请求->建立tcp连接(syn)->传输数据->超时时间到，nginx发送fin断开tcp连接

    client_header_timeout 10;
    客户端端向nginx发送完整header的超时时间，10s内未收到完整header，则返回408

    client_body_timeout 10;
    客户端向nginx发送body的超时时间，连续10s内未向客户端发送1字节，则返回408

    client_max_body_size 20m; 最大body大小，超过限制返回413

    client_body_buffer_size 1024k; 请求body的缓冲区大小，如果请求body大于缓冲区，则写入临时目录

    client_header_buffer_size 1k;
    请求头的缓冲区大小，超过则写入更大的缓冲区(large_client_header_buffers)

    large_client_header_buffers 4 32k;
    分配4个8k的缓冲区，如果请求头大于8k则返回414(解决超长url)

    send_timeout 10; 发送数据至客户端超时时间，连续10s内未向客户端发送1字节，则关闭连接


    keepalive_requests 100;
    默认100，一个与客户端的长连接可以处理的最大请求数，达到这个该值时，则nginx会强行关闭这个长连接。导致nginx端出现TIME_WAIT



    //http_proxy

    proxy_connect_timeout 10; nginx连接upstream的超时时间

    proxy_read_timeout 5;
    nginx接收upstream超时时间，连续5s内未接收到upstream的1字节，则断开连接

    proxy_send_timeout 2;
    nginx发送数据至upstream超时时间，连续2s内没有发送1字节，则断开连接

    proxy_buffering on;（默认on）
    on开启情况下，缓冲upstream返回来的数据，边收边传给客户端，如果大小超缓冲区大小，则写入磁盘
    off关闭，则是每次都返回proxy_buffer_size大小

    proxy_pass http://xxxx:3001; 反向代理地址

    proxy_redirect off;
    如果上游服务器返回的是重定向请求，此处可以重设location或refresh字段

    proxy_http_version 1.1; 使用http1.1版本（支持长连接）
    proxy_set_header Connection "";
    启用http1.1长连接，若未开启导致后端server每次关闭连接，高并发下容易出现TIME_WAIT


    proxy_set_header Host $host;
    使后端服务器可以获取客户端的真实host,依次使用如下值
    1. 请求行host
    2. 请求头header中的host
    3. server_name

    proxy_set_header X-Real-Ip $remote_addr;
    仅一层代理模式(Client-Nginx-Server)下获取客户端真实ip

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    追加来源ip（$remote_addr），例如经过C-proxy1-proxy2-Server，那么
    X-Forwarded-For:CIp, proxy1Ip  。注意proxy2与Server直接相连，在proxy2处追加proxy1Ip，表示请求来自于proxy1

    // ngx_http_realip_module ，将用户真实ip赋值$remote_addr
    set_real_ip_from 129.1.1.1;上级代理服务器ip段

    real_ip_header X-Forwarded-For;

    real_ip_recursive on; 递归检索


    // http_gzip

    gzip on; 开启压缩功能

    gzip_min_length 1k; 触发压缩的最小字节数

    gzip_http_version 1.1; http版本

    gzip_comp_level 6; 1(压缩比最低)~9(压缩比最高，耗CPU)

    gzip_types text/html text/css text/javascript;压缩类型


    //负载均衡

    upstream backend { 默认采用round-robin算法轮询
        ip_hash;
        server sdk.biaoqing.sogou; weight=5
        server sdk.biaoqing.sogou:5002; max_fails=1
        server 192.168.1.1:5002; backup

        keepalive 300;
        空闲时最大keep alive数量，超过此值时最近最少使用的连接将被关闭
        需要的长连接数量 = qps * 响应时间s * 30%
        此值设置过小，造成nginx频繁关闭，最终导致nginx端出现TIME_WAIT
    }

    weight=5 权重默认为1

    max_fails=1 默认1 fail_timeout=30 默认10s
    如果1次失败，则该服务器不可达，且在之后30秒内不再访问。之后没30秒最多尝试1次。

    backup 备选服务器，当没有被标记为backup、down的服务器都不可达时，分配至此

    down 当前服务器永不可达

    ip_hash 根据ip分配至不同的服务器

    keepalive 300 保持到后端服务器的长连接数


    // 虚拟主机

    server {
        listen 80; 监听端口

        server_name luyufa.com; 虚拟主机域名

        root /root/apps/r;
        指定根目录，请求结果是 root+location
        例如:请求url是/lu/1.html-->/root/apps/r/lu/1.html


        //日志

        log_format main_xxx 日志xxx格式(默认combined)

        $remote_addr 客户端ip
        $time_local 请求时间
        $request 请求行
        $status 状态码
        $body_bytes_sent 返回的body字节数
        $request_time 请求耗时
        $http_user_agent 客户端信息
        $http_x_forwraded_for 代理ip
        $http_referer 请求来源

        access_log off; 关闭日志

        access_log logs/access.log main_xxx buffer=32k flush=5s
        日志存储路径  格式  缓冲区满32k写入文件 5s内必定写入一次

        error_log logs/error.log error
        错误日志存储路径 级别(debug info warn error)


        location /api {
            proxy_pass http://backend;

            deny 192.1.1.1; 禁止
            allow 182.1.1.1; 允许
            deny all; 禁止所有ip访问，自上而下匹配

            alias /root/apps/a/
            指定根目录，结尾必须以"/"结尾，请求结果是alias路径替换location路径，仅能存在于location下
            例如:请求url是/lu/1.html-->/root/apps/a/1.html
        }

        //location规则

        location = /url 精确匹配url,匹配即停止

        location ^~ /url 前缀匹配，特殊，匹配即停止

        location ~ 区分大小写的正则匹配,匹配即停止

        location ~* 不区分大小写的正则匹配,匹配即停止

        location /url 前缀匹配

        location / 通用匹配

    }
}

```

