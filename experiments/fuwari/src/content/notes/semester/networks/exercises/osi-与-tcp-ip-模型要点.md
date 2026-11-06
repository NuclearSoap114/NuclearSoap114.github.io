---
title: "OSI 与 TCP/IP 模型要点"
series: "大二下期末复习"
subject: "计算机网络"
section: "考试题整理"
slug: "semester/networks/exercises/osi-与-tcp-ip-模型要点"
order: 182
---

> 来源：第一套填空5、选择19、28 + 第二套填空7-10、选择12-13

<div id="section-1" class="note-anchor"></div>

## 一、TCP/IP 四层模型

```
┌──────────────┐
│   应用层 (4)  │  ← HTTP/DNS/SMTP/FTP (对应 OSI 5-7层)
├──────────────┤
│   传输层 (3)  │  ← TCP/UDP (对应 OSI 第4层)
├──────────────┤
│   互联层      │  ← IP (对应 OSI 第3层)
├──────────────┤
│ 网络接口层    │  ← 对应 OSI **第1-2层** (物理层+数据链路层)
└──────────────┘
```

> **必背考点**
> - TCP/IP 共分了 **4 层**
> - 第 3、4 层分别是**传输层**、**应用层**

<div id="section-2" class="note-anchor"></div>

## 二、TCP/IP 与 OSI 对应关系

| TCP/IP 层 | 对应 OSI 层 |
|-----------|:----------:|
| 应用层 | 应用层 + 表示层 + 会话层 |
| 传输层 | 传输层 |
| 互联层 | **网络层** |
| 网络接口层 | **物理层 + 数据链路层**（1-2层） |

> **第二套关键考点**
> - TCP/IP 的**网络接口层**与 ISO **数据链路层**对应 → ❌ **错误**！（应同时对应物理层+数据链路层）
> - TCP/IP 的互联层与 ISO **网络层**对应 → ✅ 正确
> - TCP/IP 不是**政府标准** → 它是开放的工业标准

<div id="section-3" class="note-anchor"></div>

## 三、OSI 各层功能（简答必备）

| 层级 | 核心功能 |
|:----:|----------|
| 物理层 | 透明传输比特流 |
| 数据链路层 | 成帧、差错检测、MAC寻址 |
| **网络层** | **路由选择、拥塞控制与网络互连** |
| 传输层 | 端到端可靠传输 |
| 应用层 | 为应用程序提供网络服务 |

> **网络层功能三要素**
> 1. **路由选择**
> 2. **拥塞控制**
> 3. **网络互连**
>
> ≠ "提供可靠的端到端服务，透明地传送报文"（那是传输层）
> ≠ "在通信实体之间传送以帧为单位的数据"（那是数据链路层）
> ≠ "数据格式变换、数据加密与解密"（那是表示层）

<div id="section-4" class="note-anchor"></div>

## 四、三层交换技术

> 将局域网交换机的设计思想应用到路由器的设计中 → **三层交换机**
>
> 传统路由器通过**软件**实现路由选择，三层交换通过**硬件**实现。

详见 [网络设备与 OSI 模型](/notes/semester/networks/exercises/%E7%BD%91%E7%BB%9C%E8%AE%BE%E5%A4%87%E4%B8%8E-osi-%E6%A8%A1%E5%9E%8B/)

<div id="section-5" class="note-anchor"></div>

## 五、路由器功能

> 路由器不仅具有网桥的功能，还具有：
> - **路由选择**
> - 协议转换
> - 多路重发
> - 错误检测

详见 [网络设备与 OSI 模型](/notes/semester/networks/exercises/%E7%BD%91%E7%BB%9C%E8%AE%BE%E5%A4%87%E4%B8%8E-osi-%E6%A8%A1%E5%9E%8B/)

<div id="section-6" class="note-anchor"></div>

## 六、Web 和 FTP 默认端口

> Web 服务默认 TCP 端口：**80**
> FTP 服务默认 TCP 端口：**21**

详见 [协议缩写与端口](/notes/semester/networks/exercises/%E5%8D%8F%E8%AE%AE%E7%BC%A9%E5%86%99%E4%B8%8E%E7%AB%AF%E5%8F%A3/)
