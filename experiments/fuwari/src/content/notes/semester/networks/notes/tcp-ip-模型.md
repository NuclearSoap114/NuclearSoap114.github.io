---
title: "TCP/IP 模型"
series: "大二下期末复习"
subject: "计算机网络"
section: "计算机网络基础"
slug: "semester/networks/notes/tcp-ip-模型"
order: 129
---

> 来源：谢希仁《计算机网络》第1章 — OSI与TCP/IP对比几乎每年都考

---

<div id="section-1" class="note-anchor"></div>

## 一、TCP/IP四层结构

| 层次 | 名称 | 对应OSI | 核心协议 |
|:----:|------|---------|----------|
| 4 | **应用层** | 应用+表示+会话 | HTTP、DNS、FTP、SMTP |
| 3 | **传输层** | 传输层 | TCP、UDP |
| 2 | **网际层** | 网络层 | IP、ICMP、ARP |
| 1 | **网络接口层** | 数据链路+物理 | Ethernet、PPP、WiFi |

---

<div id="section-2" class="note-anchor"></div>

## 二、OSI vs TCP/IP 对比

| 对比维度 | OSI七层 | TCP/IP四层 |
|----------|---------|------------|
| 层次数量 | 7层 | 4层 |
| 设计理念 | 先有模型后有协议（理论驱动） | 先有协议后有模型（实践驱动） |
| 表示层/会话层 | 独立两层 | 合并到应用层 |
| 物理层/数据链路层 | 独立两层 | 合并为网络接口层 |
| 实际应用 | 教学参考 | Internet实际标准 |

> **核心区别**
> OSI 是理论模型，TCP/IP 是事实标准。OSI 模型更细致（七层），但 Internet 实际用的是 TCP/IP 四层模型。

---

<div id="section-3" class="note-anchor"></div>

## 三、五层参考模型（教学折中）

为教学方便，常将 TCP/IP 拆开为五层：

**应用层 → 传输层 → 网络层 → 数据链路层 → 物理层**

既保留了 TCP/IP 的核心思想，又不丢失物理层和数据链路层的细节。

---

<div id="section-4" class="note-anchor"></div>

## 四、协议三要素

| 要素 | 含义 | 举例 |
|------|------|------|
| **语法** | 数据与控制信息的结构/格式 | IP数据报头部格式 |
| **语义** | 控制信息的含义和响应 | ACK表示确认 |
| **时序** | 事件实现顺序 | TCP三次握手顺序 |

---

<div id="section-5" class="note-anchor"></div>

## 经典例题

**比较 OSI 参考模型和 TCP/IP 参考模型的异同。**

相同点：都采用分层体系结构；都有应用层、传输层、网络层。
不同点：① 层数不同（7 vs 4）；② OSI 区分表示层和会话层，TCP/IP 合并到应用层；③ OSI 先有模型，TCP/IP 先有协议；④ OSI 用于教学，TCP/IP 是实际标准。

---

<div id="section-6" class="note-anchor"></div>

## 考试重点

1. TCP/IP 四层名称及对应协议 — 必背
2. OSI vs TCP/IP 对比 — 常考简答
3. 协议三要素
4. 五层教学模型
