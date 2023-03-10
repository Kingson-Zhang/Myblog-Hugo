---
title: Hexo搭建博客
tags:
  - 博客
  - Hexo
categories:
- 部落阁
abbrlink: 2b175fcf
date: 2018-08-24 10:44:14
lastmod: 2020-07-22 15:23:55
image: https://cdn.kingsonzhang.com/57be7727659a4d154e476ab2a5ed6084.jpg
description: "记录一下搭建Hexo博客的过程"
---

前段时间闲来无事，就想着自己搭建一个博客玩一玩。本来用的是[Wordpress](https://cn.wordpress.org/)的框架系统，但是奈何没有太好看的主题(好看的又要收费)，而且Wordpress相比于Hexo有点臃肿，加之VPS在国外，所以选择[Hexo](https://hexo.io)作为博客框架。

<!-- more -->

## 资源下载

- [XShell](https://www.lanzous.com/i2l6duh)
- [Nodejs](https://npm.taobao.org/mirrors/node/v10.8.0/node-v10.8.0-x64.msi)
- [Git](https://git-scm.com/downloads)

## 客户端配置

### 安装Git以及进行相关配置

1、首先通过前面提供的链接下载Git客户端，然后进行安装。

2、安装完成之后，打开`Git Bash`进行以下配置。(注：此处假定读者以在[github](https://github.com/)上注册了github账号。)  
(1)、输入以下代码设置用户名和邮箱:

```bash
    # 将此处的"yourname"替换成自己的用户名
    git config --global user.name "yourname"
    
    # 将此处的"youremail"替换成自己的邮箱
    git config --global user.email "youremail"
```

(2)、输入以下代码检查是否有SSH Key

```bash
    cd ~/.ssh
```

如果客户端暂无SSH Key，输入以下代码新建一个SSH Key。

```bash
	ssh-keygen
```

接着继续输入`cat ~/.ssh/id_rsa.pub`,然后将得到的秘钥先复制一下。

3、根据自己的需要配置端口号，在.ssh目录下新建config文件，根据服务的ssh端口号输入`port 端口号`

### 安装Nodejs

下载Nodejs，然后进行安装。

### 安装Hexo框架

首先，继续在刚刚打开的Git Bash里面输入以下代码，通过npm进行全局安装hexo框架。

```bash
    npm install -g hexo-cli
```

安装完hexo框架，选择一个目录存放你的博客文件，然后把Git Bash切换到那个目录。接着，输入`hexo init blog`进行初始化hexo。 

初始化完毕之后，打开博客根目录的package.json文件，在dependencies的配置中，追加一项：`"hexo-deployer-git": "^0.3.1"`，然后，在根目录中输入`npm install`

安装完包之后，接着在Git Bash输入：`hexo s`，然后在浏览器输入`localhost:4000`。

## 服务端配置

输入以下代码，进行系统更新：

```bash
    yum update -y
```

更新完系统，输入以下代码，可查看系统版本：

```bash
    cat /etc/centos-release
```

### 安装Nginx

1、配置Nginx官方源，输入以下代码，新建一个文件以配置Nginx源

```bash
    vi /etc/yum.repos.d/nginx.repo
```

在打开的文件中输入以下代码，输入完毕之后，按 “esc” 键退出编辑模式， 输入 “:wq” 保存退出。

```bash
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
```

2、安装最新版的Nginx ，输入以下代码进行安装。

    yum install nginx -y

3、启动Nginx并设置开机自启，输入以下代码:

```bash
    systemctl start nginx
    systemctl enable nginx
```

进行到这里，你已经可以把服务器ip复制到浏览器进行访问了  

4、配置Nginx  
接下来，需要修改一下nginx的相关配置，包括设置网站根目录以及配置域名。输入以下代码，打开Nginx的配置文件。

```bash
    vi /etc/nginx/conf.d/default.conf
```

将“/usr/share/nginx/html”改为“/usr/share/nginx/html/blog”。  

> 源码安装Nginx请移步至[VPS开箱](/p/vps开箱/)

### 安装Git以及进行相关配置

1、输入以下代码，进行Git的安装

```bash
    yum install git
```

2、创建git用户以及设置密码，输入以下代码：

```bash
    #创建用户,用户名为git
    adduser git
    #设置密码
    passwd git
```

3、把git用户添加到sudo用户组中，输入以下代码`sudo vi /etc/sudoers`，打开sudoers文件，输入`:/root`进行搜索，搜索到代码行`root ALL=(ALL) ALL`,然后在这一行下添加以下代码`git ALL=(ALL) ALL`。输入完毕之后，按`wq!`强制保存退出vi。  

4、切换到git用户，添加SSH Key文件并且设置相应的读写与执行权限。输入以下代码：

```bash
    # 切换用户
    su git
    # 创建目录
    mkdir ~/.ssh
    # 新建文件
    vim ~/.ssh/authorized_keys
```

把之前在客户端设置的SSH Key,复制到authorized_keys文件中，保存后退出。

把ssh目录设置为只有属主有读、写、执行权限。代码如下：

```bash
    chmod 600 ~/.ssh/authorized_keys
    chmod 700 ~/.ssh
```

设置完后，返回客户端，打开Git Bash，输入以下代码，测试是否能连接上服务器：

```bash
    # ServerIP为你自己服务器的ip
    ssh -v git@ServerIP
```

5、重新回到服务器，在网站根目录新建一个blog文件夹，用于客户端上传文件，并且把该文件授权给git用户。代码如下：

```bash
    # 使用sudo指令，需要输入git用户的密码
    sudo mkdir -p /usr/share/nginx/html/blog
    sudo chown -R git:git /usr/share/nginx/html/blog
```

6、在服务器上初始化一个git裸库，切换到git用户，然后切换到git用户目录，接着初始化裸库，代码如下：

```bash
    su git
    cd ~
    git init --bare blog.git
```

接着新建一个post-receive文件

```bash
    vim ~/blog.git/hooks/post-receive
```

然后在该文件中输入以下内容：

```bash
    #！/bin/sh
    git --work-tree=/usr/share/nginx/html/blog --git-dir=/home/git/blog.git checkout -f
```

保存退出之后，再输入以下代码，赋予该文件可执行权限。

```bash
    chmod +x ~/blog.git/hooks/post-receive
```

7、返回客户端，设置博客根目录下的_config.yml文件。

```bash
    deploy:
        type: git
        repo: git@SERVER:/home/git/blog.git       #此处的SERVER需改为你自己服务器的ip
        branch: master                            #这里填写分支
        message:                                  #提交的信息
```

保存后，在博客根目录打开Git Bash，输入以下命令：

```bash
   hexo clean
   hexo g
   hexo d
```

8、在浏览器输入IP地址或者输入配置好的域名就可以访问了！

> 还有其他更为方便的CI/CD方案，比如Circle ci等，本文更新时我已经使用Github自带的CI/CD服务。
