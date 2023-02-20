---
title: "VPS开箱"
date: 2018-08-02 12:30:33
lastmod: 2022-09-14 19:30:23
draft: false
tags: ["Nginx", "VPS",]
categories: ["技术栈",]
image: "https://numbernone.oss-cn-hangzhou.aliyuncs.com/44c07ecbdd5aa0fcc8e31b38ac8408f2.png"
description: "搬瓦工VPS折腾记"
---

前端时间购买了Banwagong提供位于洛杉矶的服务器，也算是部署得差不多了，总结一下过程。

## 准备
> 下载[Termius](https://termius.com/)

## VPS安装Nginx

使用Termius连接到VPS主机

### 安装GCC与dev库
```shell
yum update -y # 更新包信息

yum upgrade -y # 更新包

yum install gcc gcc-c++ \ 
pcre pcre-devel \
zlib zlib-devel \
openssl openssl-devel 
```

### 下载Nginx源码

我这里使用的是/opt目录，可以根据需要更改为指定的目录，使用  
`wget -o nginx.tar.gz http://nginx.org/download/nginx-{version}.tar.gz`  
对源码进行下载

### 执行configure

为了方便了解部分选项含义，注明了用到的参数及其含义：  
|  表头   | 表头  |
|  ----  | ----  |
| --prefix=PATH  | Nginx安装的路径 |
| --sbin-path=PATH | 指定Nginx二进制文件路径，默认和prefix关联 |
| --conf-path=PATH | config文件路径 |
| --error-log-pah=PATH | 错误日志路径 |
| --pid-path=PATH | 存储master的进程号 |
| --http-client-body-temp-path | 客户端请求临时位置 |
| --http-proxy-temp-path | 代理文件临时文件目录
| --user=USER | worker进程运行的用户 |
| --group=GROUP | worker进程运行的用户组 |
| --with-file-aio | 启用异步I/O |
| --with-threads | 开启线程池 |
| --with-http_addition_module | 在response前后追加内容 |
| --with-http_auth_request_module | 判断子请求是否为2xx状态码 |
| --with-http_mp4_module | 支持mp4视频流 |
| --with-http_realip_module | 获取反向代理的真实IP |
| --with-http_secure_link_module | 检查链接是否真实有效 |
| --with-http_slice_module | 将请求拆分为子请求 |
| --with-http_ssl_module | 启用https支持 |
| --with-http_sub_module | 替换response数据 |
| --with-http_v2_module | 启用http2支持 |
| --with-stream | 四层TCP/UDP协议的转发、代理、负载均衡 |
| --with-stream_realip_module | 获取stream转发的真实ip |
| --with-stream_ssl_module | stream开启https支持 |
```shell
./configure \
--prefix=/etc/nginx \
--sbin-path=/usr/sbin/nginx \
--config-path=/etc/nginx/nginx.conf \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--pid-path=/var/run/nginx.pid \
--http-client-body-temp-path=/var/cache/nginx/client_temp \
--http-proxy-temp-path=/var/cache/nginx/proxy_temp \
--user=nginx \
--group=nginx \
--with-file-aio \
--with-threads \
--with-http_addition_module \
--with-http_auth_request_module \
--with-http_mp4_module \
--with-http_realip_module \
--with-http_secure_link_module \
--with-http_slice_module \
--with-http_ssl_module \
--with-http_sub_module \
--with-http_v2_module \
--with-stream \
--with-stream_realip_module \
--with-stream_ssl_module
```
### 执行安装&配置系统服务

```shell
make &$ make install
```
在`/usr/lib/systemd/system`下新建`nginx.service`，文件内容：
```shell
[Unit]
Description=Nginx A web server
Documentation=http://nginx.org/en/docs/
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStartPost=/bin/sleep 1
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/usr/sbin/nginx -s stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
使用`systemctl status nginx`查看服务状态，检查是否有错误。如果出现`Failed to start Startup script for nginx service`使用`fuser -k 80/tcp && fuser -k 443/tcp`杀死占用端口的进程。  

`systemctl enable nginx`开启服务开机自启动，`systemctl start nginx`开启服务。  

访问IP地址，正常会出现如下结果：

![OK](https://numbernone.oss-cn-hangzhou.aliyuncs.com/377ca9c9bcb148f3a57d52573df96c81.png)

至此VPS就开箱好了。

### 引申: Nginx的优点

> 高扩展性：由不同模块组成，可以对单一模块进行修改或升级，专注于模块自身。  
> 高可靠性：采用master+worker的进程模型，worker进程间相对独立，可以快速拉起worker进程。  
> 热部署：得益于Nginx优秀的进程模型设计，Nginx可以不停机就更新配置项，命令：nginx -signal