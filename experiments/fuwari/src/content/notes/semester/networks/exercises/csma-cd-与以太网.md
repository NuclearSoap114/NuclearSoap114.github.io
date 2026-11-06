---
public: true
title: "CSMA/CD 与以太网"
series: "大二下期末复习"
subject: "计算机网络"
section: "习题解析"
slug: "semester/networks/exercises/csma-cd-与以太网"
order: 170
---

<div id="section-1" class="note-anchor"></div>

## 一、考点概述

CSMA/CD 是以太网的核心介质访问控制协议，属于数据链路层的 MAC 子层。常考：**工作原理、冲突检测、争用期、最短帧长**。

---

<div id="section-2" class="note-anchor"></div>

## 二、CSMA/CD 协议

<div id="section-3" class="note-anchor"></div>

### 全称

**Carrier Sense Multiple Access with Collision Detection**（载波监听多路访问/碰撞检测）

<div id="section-4" class="note-anchor"></div>

### 工作流程（四步法）

```
① 先听后说：发送前先监听信道——空闲则发送，忙则等待
② 边说边听：发送的同时持续监听——检测是否发生碰撞
③ 冲突则停：一旦检测到碰撞 → 立即停止发送
④ 随机重传：等待随机时间（二进制指数退避）后重新发送
```

<div id="section-5" class="note-anchor"></div>

### 核心概念

| 概念 | 含义 |
|------|------|
| **争用期** ($2\tau$) | 端到端往返时间，即 $2 \times$ 传播时延。在此时间内可能发生冲突 |
| **最短帧长** | 发送一帧的时间 ≥ 争用期，确保冲突能被检测到 |
| **截断二进制指数退避** | 冲突后等待时间 = $r \times 2\tau$，$r$ 从 $[0, 2^k-1]$ 随机取（$k = \min(\text{重传次数}, 10)$） |

---

<div id="section-6" class="note-anchor"></div>

## 三、最短帧长计算（必考公式）

> **核心公式**
> 
$$
\text{最短帧长} = \text{发送速率} \times 2\tau = \text{发送速率} \times \frac{2 \times \text{最大距离}}{\text{信号传播速度}}
$$


<div id="section-7" class="note-anchor"></div>

### 典型例题

> **例题**：1km 长的以太网，数据率 10Mbps，信号传播速度 $2 \times 10^8$ m/s。求最短帧长。

**解析**：

- $\tau = \frac{1000\text{m}}{2 \times 10^8\text{m/s}} = 5\mu\text{s}$
- 争用期 $2\tau = 10\mu\text{s}$
- 最短帧长 = $10 \times 10^6 \times 10 \times 10^{-6} = 100 \text{ bits}$

> 实际以太网最短帧长 = **64 字节**（512 bits），对应 2500m 的最大距离 + 中继器延迟。

<div id="section-8" class="note-anchor"></div>

### 公式变形

| 已知 | 求 | 公式 |
|------|:--:|------|
| 数据率 $R$、传播速度 $v$、最大距离 $D$ | 最短帧长 $L_{\min}$ | $L_{\min} = R \times \frac{2D}{v}$ |
| 最短帧长 $L_{\min}$、数据率 $R$ | 最大距离 $D$ | $D = \frac{L_{\min} \times v}{2R}$ |

---

<div id="section-9" class="note-anchor"></div>

## 四、MAC 帧格式

```
前导码  | 目的MAC | 源MAC | 类型/长度 |  数据  |  FCS
8字节   |  6字节  | 6字节 |  2字节   | 46~1500 | 4字节
```

> **帧长范围**
> - 最短：64字节（目的MAC 6 + 源MAC 6 + 类型2 + 数据 46 + FCS 4）
> - 最长：1518字节（数据字段最大1500字节）
> - 数据字段不足46字节 → **填充**

---

<div id="section-10" class="note-anchor"></div>

## 五、同类练习题

> **题目**：2.5km 以太网，数据率 100Mbps，信号传播速度 $2 \times 10^8$ m/s。求最短帧长。若工作站发送 400 bits 数据时会检测到冲突吗？

**解析**：

**（1）最短帧长**：
- $\tau = 2500 / (2 \times 10^8) = 12.5\mu\text{s}$
- 争用期 = $25\mu\text{s}$
- 最短帧长 = $100 \times 10^6 \times 25 \times 10^{-6} = 2500 \text{ bits}$

**（2）能不能检测**：
- 400 bits < 2500 bits（最短帧长）
- **不能保证检测到冲突**！帧太短，发完了还没收到冲突信号

> **记忆公式**
> 最短帧长 $L_{\min}$（bits） = 数据率（bps） × 争用期（s）
> 争用期 = 2 × 距离 ÷ 传播速度（即信号跑一个来回的时间）
