---
title: "腾讯云搭建frp实现内网穿透"
date: 2022-09-22 15:23:45
draft: true
image: https://cdn.kingsonzhang.com/84d2b7e745c17d5671a9bccd6f707125.jpg
description: 使用腾讯云轻量服务器搭建frp
categories: 
    - 分享境
tags: 
    - frp
    - 腾讯云
    - 内网穿透
---

摘自文档：frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议。可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。

## 准备
> [Termius](https://termius.com/)  
> 一台具有公网IP的服务器

## 腾讯云配置

Frps是基于Golang开发的，所以需要配置环境，这里直接使用Docker免去环境配置的步骤
`curl -sSL https://get.daocloud.io/docker | sh`
