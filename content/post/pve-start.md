---
title: "N5105软路由开箱"
date: 2023-01-07 15:23:45
draft: false
categories:
    - 分享境
tags:
    - 软路由
    - PVE
image: https://numbernone.oss-cn-hangzhou.aliyuncs.com/c1d4996340fc39805da35a2703c41403.jpg
description: N5105软路由安装PVE
---

前段时间突然心血来潮，想买个多网口的软路由搭建ALL IN ONE玩玩，遂买了个N5105软路由。

| 项目 | 价格 |
| --- | --- |
| N5105第四版 | 550 |
| 镁光DDR4 8Gx2 | 150 |
| 西数SN750 500G | 240 |

其实16G+500G的组合对于N5105这种性能不算太强的CPU来说有点性能过剩了，会导致瓶颈在CPU出现，但是本着只买最贵的不买最合适的精神，就配成了这种配置。

买了也算是有一段时间了，一直没去部署相关服务，现在记录一下部署的相关过程。

## 下载资源
[PVE](https://www.proxmox.com/en/downloads)  
[Termius](https://termius.com/)  
[OpenWrt镜像](https://github.com/stupidloud/nanopi-openwrt/releases)

> 部分软件需要科学上网才可正常下载！
> OpenWrt用的是Klever大佬编译的，也可以选用其他的镜像。

## 安装PVE
使用Rufus选择指定磁盘以及对应的ISO镜像，安装模式要选择DD模式，按如下图。
![Rufus](https://numbernone.oss-cn-hangzhou.aliyuncs.com/b8d9b131e7b468e9bbd7d9a0504329b0.png)

1.写入完成后插入软路由，BIOS设置为U盘启动。  
2.选择安装的磁盘。  
3.设置时区。  
4.设置密码。  
5.配置IP地址已经网桥端口。  
完成以上步骤等待安装完成就即可。

## 配置PVE
### 更换PVE源
```shell
wget https://mirrors.ustc.edu.cn/proxmox/debian/proxmox-release-bullseye.gpg -O /etc/apt/trusted.gpg.d/proxmox-release-bullseye.gpg
echo "#deb https://enterprise.proxmox.com/debian/pve bullseye pve-enterprise" > /etc/apt/sources.list.d/pve-enterprise.list
echo "deb https://mirrors.ustc.edu.cn/proxmox/debian/pve bullseye pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
```
### Debian换源
```shell
mv /etc/apt/sources.list /etc/apt/sources.list.bk
echo "deb http://mirrors.ustc.edu.cn/debian stable main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian stable main contrib non-free
deb http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free

# deb http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian stable-proposed-updates main contrib non-free" > /etc/api/sources.list
```
### 更新软件包
```shell
apt makecache && apt udpate -y $$ apt upgrade -y
```
### 引申
PVE，是基于Debian的Linux系统，虚拟机内核为KVM。而且大多数操作需要命令行完成，比较契合程序员的气质，故而选择PVE而不是EXSi。
## 安装OpenWrt
### 开启并配置硬件直通
BIOS中打开硬件直通（VT-d && VMX）  
编辑Grub  
`sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT=\"quiet\"/GRUB_CMDLINE_LINUX_DEFAULT=\"quiet intel_iommu=on\"/g' && update-grub`  
编辑完成后需要重启使引导生效。
### 使用命令确定物理接口和内部接口对应关系
1.安装ethtool
> apt install ethtool -y  

2.打开端口自动启动 & 重启系统
![enp2s0](https://numbernone.oss-cn-hangzhou.aliyuncs.com/d5fa796e5937255c77b63c0bbec9c2cd.png)
3.确认所有网卡位置
> lspci | grep -i 'eth'

![ethtool](https://numbernone.oss-cn-hangzhou.aliyuncs.com/778ea04ad6178903d8fa7dcebce9eaf0.png)

4.通过网口插拔确认设备位置
使用`ethtool -i enp5s0`确定网卡PCI位置，使用`ethtool enp5s0`确定enp5s0对应物理网口位置。
![ethtool](https://numbernone.oss-cn-hangzhou.aliyuncs.com/68587c7761009a1eebb79c3769cfa271.png)

下面是我确认出来的对照表：  

| 物理接口 | 内部接口 | PCI位置 |
| --- | --- | --- |
| ETH0 | enp2s0 | 02:00:0 |
| ETH1 | enp3s0 | 03:00:0 |
| ETH2 | enp4s0 | 04:00:0 |
| ETH4 | enp5s0 | 05:00:0 |

### 上传并安装OpenWrt
1.在local下上传ISO镜像
![op](https://numbernone.oss-cn-hangzhou.aliyuncs.com/55fe6dfad8f4bdc46c5a3b53f4a67673.png)

2.创建虚拟机，名称自定义，ISO镜像选择刚刚上传的镜像，系统配置默认，磁盘根据个人需要配置，也可以删除磁盘，CPU核心一般跟物理核心数量一样，内存按照需求设置，我设置为1GB了，网络选择默认，点击完成即可创建虚拟机。  

3.将网卡直通到OpenWrt  

选择OpenWrt虚拟机的硬件选项，添加PCI设备，将除了网桥链接的网口之外都直通到虚拟机。  
> 注意网卡添加的顺序，klever的镜像将第二个添加的网卡默认设置为wan口(网桥为第一个网卡)  

4.修改镜像类型
删除cdrom配置，添加cache=unsafe配置
![](https://numbernone.oss-cn-hangzhou.aliyuncs.com/117119214b083c2cbb90bd7f2ab0ec40.png)
5.启动OpenWrt
将ide2设置为第一启动项，并禁用其他启动项，点击控制台即可启动OpenWrt，此时OpenWrt还无法通过URL正常访问，需要在控制台确定LAN口的IP以及子网掩码，将PC接入网桥网口，手动设置IP为LAN口所属的IP以及子网掩码，即可正常访问。  
将其他网口设置为LAN口设备，并强制开启DHCP服务：
![](https://numbernone.oss-cn-hangzhou.aliyuncs.com/e318bb261908def895fea61808900a44.png)
将PC修改为DHCP获取IP后即可正常使用。

## 在LXC下安装Docker
### 安装Centos9-release
1.CT模板换源并下载
```shell
cp /usr/share/perl5/PVE/APLInfo.pm /usr/share/perl5/PVE/APLInfo.pm_back
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm

systemctl restart pvedaemon.service # 重启服务
```
在CT模板中选择centos9-release进行下载。
2.创建CT
选择指定镜像，根据个人需求修改对应的配置即可，完成后即可成功创建。
### 安装Docker
1.一件安装Docker
```shell
apt install curl -y
curl -sSL https://get.daocloud.io/docker | sh
```

2.安装portainer
```shell
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```

## 完成
输入IP:9000即可正常访问，至此PVE的安装就完成了，下面贴上网络拓补图。
![](https://numbernone.oss-cn-hangzhou.aliyuncs.com/5b290f85d4dc51131cf2b6cf2ef9d2d1.png)