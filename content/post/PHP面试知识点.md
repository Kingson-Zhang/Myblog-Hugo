---
title: 网站建设知识点
tags:
  - 面试
  - PHP
categories:
  - 碎碎念
abbrlink: ee5dd5e6
date: 2018-08-24 11:50:05
updated: 2019-06-19 14:17:00
thumbnail: https://blog-1257454527.cos.ap-chengdu.myqcloud.com/php-1024x538.png
---

PHP面试知识点总结

<!--more-->

## 如何理解PHP

PHP是一种基于函数式编程的语言

## 匿名函数(也叫闭包函数)

匿名函数，也叫闭包函数，允许临时创建一个没有制定名称的函数。最经常用作回调函数参数的值。当然，也有其他应用。匿名函数通过Closure来实现的。

```php
<?php
    echo preg_replace_callback('~-([a-z])~', function($match){
        return strtoupper($match[1]);
    }, 'Hello-World')//输出helloword
    ?>
```

## OSI七层模型

从高到底分别是物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。

![OSI](https://images-1257454527.cos.ap-chengdu.myqcloud.com/b21bb051f8198618b8f0ae2b40ed2e738ad4e6ee.jpg)

## PHP中如何连接数据库并进行CURD

## ThinkPHP中的路由详解

