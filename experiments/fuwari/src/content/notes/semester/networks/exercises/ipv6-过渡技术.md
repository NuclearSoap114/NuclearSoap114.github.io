---
title: "IPv6 过渡技术"
series: "大二下期末复习"
subject: "计算机网络"
section: "考试题整理"
slug: "semester/networks/exercises/ipv6-过渡技术"
order: 181
---

> 来源：第一套简答34（6分）

<div id="section-1" class="note-anchor"></div>

## 一、三种过渡技术

| 技术 | 核心思想 |
|------|----------|
| **双协议栈技术** | 设备同时运行 IPv4 和 IPv6 两个协议栈，根据对端能力选择使用哪个 |
| **隧道技术** | 将 IPv6 数据报封装在 IPv4 数据报中，通过 IPv4 网络传输 |
| **网络地址转换技术** | 在 IPv4 和 IPv6 网络边界进行地址/协议转换（NAT64/NAT-PT） |

<div id="section-2" class="note-anchor"></div>

## 二、各技术要点

<div id="section-3" class="note-anchor"></div>

### 双协议栈

- 同一设备同时支持 IPv4 和 IPv6
- 与 IPv4 通信走 IPv4，与 IPv6 通信走 IPv6
- 最直接但需要双地址配置

<div id="section-4" class="note-anchor"></div>

### 隧道技术

- IPv6 数据报作为 IPv4 的**载荷**传输
- 在 IPv4 网络中打通 IPv6 "隧道"
- 隧道两端需要支持双协议栈

<div id="section-5" class="note-anchor"></div>

### 网络地址转换

- IPv6 主机 ↔ IPv4 主机的转换
- 类似 NAT，但转换的是 IPv6 与 IPv4 之间
- NAT64：将 IPv6 地址转换为 IPv4 地址

> **记忆**
> 双栈 = 两个都装，隧道 = 包中包，NAT = 边界转换

<div id="section-6" class="note-anchor"></div>

## 三、扩展阅读

- IPv6 地址长度：**128 位**（IPv4 是 32 位）
- 首部固定 **40 字节**（IPv4 可变 20~60 字节）
- IPv6 没有首部校验和，路由器不能分片
