---
title: "Clickhouse物化Mysql"
date: 2022-09-22 15:23:45
draft: false
image: http://numbernone.oss-cn-hangzhou.aliyuncs.com/f8b4d2179682c362ab4922cacf5ca536.png
description: 
categories:
  - 分享境
tags:
  - Clickhouse
  - Mysql
  - MaterializedMySQL
---

最近项目中用到了Clickhouse，使用了MaterializedMySQL对Mysql表做映射，虽然使用的是阿里云的集群且阿里云已经为你准备好了一切。但是我还是觉得有必要自己实践一下，是如何操作的。  
因为物理设备的限制，所以选择在Docker环境进行开发。

ClickHouse在20.8.2版本之后增加了MaterializeMySQL物化引擎，该引擎可以将MySQL中某个库下的所有表数据全量及增量实时同步到ClickHouse中，可以高效地对数据进行分析。  

MaterializeMySQL物化引擎实时同步MySQL中数据原理是将ClickHouse作为MySQL副本，读取MySQL binlog日志实时物化MySQL数据，在ClickHouse中会针对MySQL映射库下的每一张表都会创建一张ReplacingMergeTree表引擎。

1.持全量和增量同步，首次创建数据库引擎时进行一次全量复制，之后通过监控binlog变化进行增量数据同步。  
2.兼容支持MySQL中Insert、update、delete、alter、create、drop、truncate等大部分常用的DDL操作，不支持修改表名、修改列操作。支持添加列、删除列。  
3.使用的是MySQL的GTID复制模式。

## 安装Clickhouse以及Mysql
### 安装Clickhouse并配置
```shell
docker run -d --name test-clickhouse-server -P --ulimit nofile=262144:262144 clickhouse/clickhouse-server

docker cp test-clickhouse-server:/etc/clickhouse-server/config.xml E:\clickhouse

docker cp test-clickhouse-server:/etc/clickhouse-server/users.xml E:\clickhouse
```

修改配置文件

> --ulimit nofile=262144:262144，修改Linux单个进程最大打开文件句柄数。

### 安装Mysql并配置
```shell
docker run --name test-mysql -e MYSQL_ROOT_PASSWORD=123456 -d -P mysql --default-authentication-plugin=mysql_native_password --gtid-mode=on --enforce-gtid-consistency=on
```
> --default-authentication-plugin=mysql_native_password，ClickHouse物化Mysql支持该验证类型  
> --gtid-mode=on，Mysql开启主从复制功能  
> --enforce-gtid-consistency=on，保证主从复制一致性  
> 这些是必要参数，不然无法开启物化

## 执行物化

```clickhouse
SET allow_experimental_database_materialized_mysql = 1

CREATE DATABASE mysql_1 
    ENGINE = MaterializedMySQL('10.0.0.103:32772', 'hyperf', 'root', '123456') 
    SETTINGS materialized_mysql_tables_list = 'company'
```

至此物化MySQL就完成了。
