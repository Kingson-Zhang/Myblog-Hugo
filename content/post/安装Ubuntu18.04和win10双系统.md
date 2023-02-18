---
title: 安装Ubuntu18.04和win10双系统以及卸载Ubuntu
tags:
  - ubuntu
categories:
  - 分享境
abbrlink: 85e2bf86
date: 2018-09-08 14:17:43
updated: 2019-06-19 14:13:00
thumbnail: https://blog-1257454527.cos.ap-chengdu.myqcloud.com/ubuntudualboot.png
---

前端时间安装了Ubuntu18.04和Win10双系统，将安装过程记录下来，顺便给大家一个参考。

<!--more-->

## 下载资源

[下载Ubuntu18.04](https://www.ubuntu.com/download/desktop/thank-you?version=18.04.1&architecture=amd64)

[下载Rufus](https://pan.baidu.com/s/1pBl9SGzoxHeiULXfE_Z9NQ)

## 为硬盘分区

我的电脑右键->管理->磁盘管理->为Ubunt分出一个大于40G的空闲分区(大小自己选择)

## 将镜像写入U盘

打开Rufus

![rufus](https://images-1257454527.cos.ap-chengdu.myqcloud.com/rufus.png)

## 安装Ubuntu

进入BIOS Menu中选择U盘启动项进入Ubuntu安装界面(在安装过程中不建议联网，因为会拖慢安装速度)。

- 语言选择中文简体

- 键盘布局选择英文(美国)

- 更新和其他软件选择最小安装

- 安装类型选择其他选项

- 选择之前分配的空闲分区，接下来就是关键的`分区`了

| 挂载点 | 大小 | 分区类型 | 分区位置 | 用于 | 备注 |
| - | - | - | - | - | - |
| /boot | 300M | 主分区 | 空间起始 | Ext4 | 引导分区 |
| / | 建议20G |  主分区 | 空间起始 | Ext4 | 主分区，软件安装位置 |
| /home | 用户自定义 | 逻辑分区 | 空间起始 | Ext4 | 用户存放文件 |
| Swap | 2048MB | 逻辑分区 | 空间起始 | 交换空间 | 内存交换空间 |

分区完成之后，直接点击安装即可

## 卸载Ubuntu

用磁盘管理软件将Ubuntu所占有的分区全部删除，这一步只是将系统文件删除，并没有将引导删除。

删除引导文件，在Windows管理员命令行下输入以下代码
```bash
diskpart #输入一行回车一次

list disk #列出所有磁盘

select disk 0 #选择引导文件所在的盘符

list partition #列出所有分区

select partition 0 #选择分区类型为系统的分区

assing letter=p #将分区挂载为P盘

exit #退出diskpart

p: #进入P盘，不要在此目录做其他操作，不然会导致不可预料的后果

cd Efi #进入引导文件夹

rmdir /s/q ubuntu #删除Ubuntu引导文件
```

如果安装过程中遇到什么问题可以直接咨询我。