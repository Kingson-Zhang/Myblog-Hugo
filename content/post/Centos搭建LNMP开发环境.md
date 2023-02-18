---
title: Centos搭建LNMP开发环境
tags:
  - 网站建设
  - LNMP
categories:
  - 实验室
abbrlink: 75f6c94a
date: 2018-09-11 18:26:04
updated: 2019-5-19 14:07:00
thumbnail: https://blog-1257454527.cos.ap-chengdu.myqcloud.com/lnmp_banner.png
---

因为需要部署ThinkPHP网站，所以就得在服务器上搭建LNMP网站环境，过程有点艰辛，把中途遇到的坑记录下来。

<!--more-->

## 资源下载

- [Xshell](<https://www.netsarang.com/zh/xshell/>)

## 安装Nginx

再centos7中安装依赖

```bash
yum -y install gcc gcc-c++ make zlib-devel pcre-devel openssl-devel
```

```bash
wget http://nginx.org/download/nginx-1.17.0.tar.gz
```

```bash
./configure
```







default.conf

```bash
server {
        server_name  your.domain;
        listen       443; ##这里自己选择
        ssl          on;
        ssl_certificate  /etc/nginx/conf.d/SSL/SSL.pem;
        ssl_certificate_key  /etc/nginx/conf.d/SSL/SSL.key;
        ssl_session_timeout 5m;
        root   "/usr/share/nginx/html/meme"; #网站目录
        location / {
            index  index.html index.htm index.php;
            #autoindex  on;
        }
        location ~ \.php(.*)$ {
            fastcgi_pass   unix:/var/run/php-fpm/php-fpm.sock;
            fastcgi_index  index.php;
            fastcgi_split_path_info  ^((?U).+\.php)(/?.+)$;
            fastcgi_param  SCRIPT_FILENAME  /usr/share/nginx/html/meme$fastcgi_script_name;
            fastcgi_param  PATH_INFO  $fastcgi_path_info;
            fastcgi_param  PATH_TRANSLATED  /usr/share/nginx/html/meme$fastcgi_path_info;
            include        fastcgi_params;
        }
}
```

php.in

```bash
cgi.fix_pathinfo=1 ##760行左右
```

www.conf

```bash
; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
; RPM: apache Choosed to be able to access some dir as httpd
user = nginx
; RPM: Keep a group allowed to write in log dir.
group = nginx
```

php-fpm.conf

```bash
include=/etc/php-fpm.d/*.conf #最后一行修改
```

## 安装PHP环境以及扩展程序

安装php以及php-fpm.

yum install php php-fpm -y

配置php-fpm支持nginx。

www.conf中将`user = apache; group =  apache`改成`user = nginx; group = nginx`

php.ini中`;cgi.fix_pathinfo=1`改成`cgi.fix_pathinfo=0`

## 安装MySQL

## 测试