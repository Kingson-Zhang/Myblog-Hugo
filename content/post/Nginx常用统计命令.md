---
title: "Nginx常用统计命令"
date: 2021-07-26 11:45:58
draft: false
categories:
    - 分享境
tag: 
    - Nginx
    - Statistics
image: https://numbernone.oss-cn-hangzhou.aliyuncs.com/1d5e139f2c2df3cc3b5d42ead50b2523.jpeg
---

Nginx作为一个Web服务器，虽然本身具有非常强大的性能，但是部分场景下会出现请求过慢的情况，这个时候就需要对日志进行分析，查看接口性能分析。虽然有诸如[GoAccess](https://goaccess.io/)、[request-log-analyzer](http://request-log-analyzer.com/)等强大的日志分析工具，但是日常还是需要掌握一些进本的Nginx日志分析命令。


## IP统计相关

### 统计总共有多少IP访问

```shell
awk '{print $1}' access.log | sort -n | uniq | wc -l
```

### 统计特定时间段内访问量
```shell
grep "07/July/2021:[08-11]" access.log | awk '{print $1}' | sort -n | uniq | wc -l 
```

### 查看访问频率最高的前N个IP
```shell
awk '{print $1}' access.log | sort -n | uniq -c | sort -nr | head -n {$n}
```

### 查看访问次数大于N的IP

```shell
awk '{print $1}' access.log | sort -n | uniq -c | awk '{if($1 > {$n}) print $0}' | sort -rn
```

### 查询IP的接口访问频率

```shell
grep '8.8.8.8' access.log | awk '{print $7}' | sort | uniq -c | sort -rn
``` 
## 页面访问统计
### 查询访问频率前N的接口
```shell
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head n {$n}
```
### 排除指定接口查询访问频率前N的接口

```shell
grep -v "www.google.com" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head n {$n}
```
### 查询访问超过N次的接口
```shell
awk '{print $7}' access.log | sort | uniq -c | awk '{if ($1 > {$N}) print $0}' | less 
```
## 按时间维度统计访问量
### 统计前N个QPS
```shell
awk '{print $4}' access.log | cut -c 14-21 | sort | uniq -c | sort -nr | head -n {$N}
```
### 统计前N个QPM
```shell
awk '{print $4}' access.log | cut -c 14-18 | sort | uniq -c | sort -nr | head -n {$N}
```
### 统计前N个QPH
```shell
awk '{print $4}' access.log | cut -c 14-15 | sort | uniq -c | sort -nr | head -n {$N}
```
## 接口性能分析
该命令需要配置Nginx的log_format
### 统计请求超过N秒的接口
```shell
awk '{if($NF > {$N}) print $7}' access.log | sort | uniq -c | sort -nr | less 
```
### 统计请求超过N秒复合正则的接口
```shell
awk '{if($NF > {$N} && $7~/{pattern}/) print $7}' | sort | uniq -c | sort -nr | less
```
## TCP连接统计
### 查看当前活跃的TCP连接
```shell
netstat -tan | grep -i 'established' | grep ':443' | wc -l
```
