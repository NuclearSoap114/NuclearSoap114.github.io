---
title: "OSI 参考模型"
series: "大二下期末复习"
subject: "计算机网络"
section: "计算机网络基础"
slug: "semester/networks/notes/osi-参考模型"
order: 128
---

> 来源：谢希仁《计算机网络》第1章 — 最高频考点，必背

---

<div id="section-1" class="note-anchor"></div>

## 一、七层总览（从上到下）

| 层号 | 名称 | 英文 | 数据单位 | 典型协议/设备 |
|:----:|------|------|----------|--------------|
| 7 | **应用层** | Application | 报文 | HTTP、DNS、FTP、SMTP |
| 6 | **表示层** | Presentation | 报文 | 加密、压缩、JPEG |
| 5 | **会话层** | Session | 报文 | RPC、NetBIOS |
| 4 | **传输层** | Transport | **段** | TCP、UDP |
| 3 | **网络层** | Network | **数据报** | IP、路由器 |
| 2 | **数据链路层** | Data Link | **帧** | MAC、交换机、PPP |
| 1 | **物理层** | Physical | **比特** | 集线器、中继器、网线 |

---

<div id="section-2" class="note-anchor"></div>

## 二、各层功能

<div id="section-3" class="note-anchor"></div>

### 应用层
直接为用户应用程序提供网络服务接口（文件传输、电子邮件、WWW）

<div id="section-4" class="note-anchor"></div>

### 表示层
数据格式转换（编码/解码）、加密解密、压缩解压缩

<div id="section-5" class="note-anchor"></div>

### 会话层
会话的建立、管理和终止；在数据流中插入同步检查点

<div id="section-6" class="note-anchor"></div>

### 传输层
**端到端**（进程到进程）的可靠传输。差错检测、流量控制、拥塞控制（TCP）。通过**端口号**区分不同应用进程。

<div id="section-7" class="note-anchor"></div>

### 网络层
**路由选择**（选择最佳路径）、逻辑寻址（IP地址）、异构网络互连

<div id="section-8" class="note-anchor"></div>

### 数据链路层
**成帧**（将比特流封装成帧）、物理寻址（MAC地址）、差错检测（CRC）

<div id="section-9" class="note-anchor"></div>

### 物理层
定义机械、电气、功能、规程特性。只负责传输比特流，不关心比特含义。

---

<div id="section-10" class="note-anchor"></div>

## 三、数据封装过程（发送方）

```
应用层：数据
  ↓ 传输层：加 TCP 头 → 段 (Segment)
  ↓ 网络层：加 IP 头 → 数据报 (Datagram/Packet)
  ↓ 数据链路层：加 MAC 头尾 → 帧 (Frame)
  ↓ 物理层：比特流 (Bits)
```

> 封装 = 每层加自己的控制信息（头部/尾部）
> 解封装 = 每层剥离对应的控制信息

---

<div id="section-11" class="note-anchor"></div>

## 经典例题

**1. 简述 OSI 七层模型及各层功能。**

从上到下：应用层（提供网络服务接口）、表示层（数据格式转换/加密）、会话层（会话管理）、传输层（端到端可靠传输）、网络层（路由选择/IP寻址）、数据链路层（成帧/MAC寻址/差错检测）、物理层（比特流传输）。

**2. 路由器工作在哪一层？交换机呢？**

路由器工作在网络层（第3层），根据 IP 地址转发。交换机工作在数据链路层（第2层），根据 MAC 地址转发。

---

<div id="section-12" class="note-anchor"></div>

## 易错点

| 易错点 | 正确理解 |
|--------|----------|
| 传输层=TCP，网络层=IP | 传输层还有UDP，网络层还有ICMP、ARP等 |
| 交换机工作在网络层 | 普通交换机在数据链路层，只有三层交换机才涉及网络层 |
| 集线器和交换机一样 | 集线器在物理层（广播所有端口），交换机在数据链路层（按MAC转发） |

---

<div id="section-13" class="note-anchor"></div>

## 考试重点

1. 七层名称、顺序、数据单位 — 必须能默写
2. 每层核心功能（尤其是传输层、网络层、数据链路层）
3. 数据封装过程
4. 各设备工作在哪一层
