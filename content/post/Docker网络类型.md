---
title: "Docker网络类型"
date: 2020-12-24 13:52:45
draft: false
image: http://numbernone.oss-cn-hangzhou.aliyuncs.com/0af4938a83c13f28f4025115d2ea4a17.png
description: Docker的四种网络类型解释
categories:
- 分享境
tags:
- Docker
---

最近在使用Docker开发环境，对Docker的网络类型有点模糊，写个文章梳理一下，方便以后进行复盘。

## 概述

| 类型 | 解释                        |
| --- |---|
| Host | 容器没有自己的网卡，直接使用宿主机的IP以及端口  |
| Bridge| Docker默认的网络模式，挂载在虚拟出来的网桥设备 |
| None | 禁用容器的网络功能                 |
| Container | 容器没有自己的网络，和其他容器共享网络、IP、端口 |

## Bridge网络

Docker容器默认的网络模式，这种模式下会自动创建一个虚拟网桥，新创建的容器都会自动挂载到这个网桥上面，挂载在上面的网卡之间都能自动转发数据包。

默认情况下，会创建一对veth/eth0接口，将宿主机上的所有容器都连接到这个内部网络上。

![](http://numbernone.oss-cn-hangzhou.aliyuncs.com/7262065ca7a019a4ac5acfbfcf4b8c4f.png)

## Host网络

使用host网络模式的容器，是直接使用宿主机的IP和外界进行通信，同时容器也直接使用宿主机的端口，这个时候要避免端口冲突问题。  
这种网络模式的好处是少了网络转换，外部主机可以直接和容器进行通信，但是缺少了隔离性。

![](http://numbernone.oss-cn-hangzhou.aliyuncs.com/e9464ee235971768216bd4ee00f92792.png)

## None网络

none网络模式是指禁用网络，只有localhost接口。  
none网络模式下部位容器创建任何的网络环境，容器内部只能使用回环地址，不能和外部通信。

## Container没落

container网络是一种比较特殊的网络模式，处于该模式下的容器会共享一个网络，多个容器之间可以直接通过localhost进行通信。

![](http://numbernone.oss-cn-hangzhou.aliyuncs.com/658a598d5621d3ac5277634c14737130.png)