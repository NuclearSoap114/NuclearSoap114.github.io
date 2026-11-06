---
public: true
title: "CSMA/CD 协议"
series: "大二下期末复习"
subject: "计算机网络"
section: "局域网"
slug: "semester/networks/notes/csma-cd-协议"
order: 137
---

> 来源：谢希仁《计算机网络》第3章 — 以太网核心协议

---

<div id="section-1" class="note-anchor"></div>

## 一、CSMA/CD 含义

**载波监听多点接入/碰撞检测**
(Carrier Sense Multiple Access with Collision Detection)

---

<div id="section-2" class="note-anchor"></div>

## 二、工作流程（四步）

> **先听后发 → 边发边听 → 冲突停发 → 随机重发**

1. 监听信道：空闲？
2. 发送数据并持续监听
3. 检测到碰撞 → 立即停止，发送强化冲突信号
4. 二进制指数退避算法计算等待时间，重新监听

> **CSMA/CD 只在半双工以太网中使用**
> 全双工交换式以太网不需要 CSMA/CD——发送和接收使用不同信道，不会碰撞。

---

<div id="section-3" class="note-anchor"></div>

## 三、争用期与最短帧长

**争用期** = $2\tau$（$\tau$ = 端到端传播时延）

也称为冲突窗口——在这段时间内可能发生碰撞。

**最短帧长** = 争用期 × 数据速率

- 10Mbps 以太网：争用期 51.2μs → 最短帧长 512 bit = **64 字节**

> 为什么需要最短帧长？
> 如果帧太短，发送完成前碰撞信号还没回来，发送方以为成功了，无法检测碰撞。

---

<div id="section-4" class="note-anchor"></div>

## 四、二进制指数退避

碰撞后等待时间：$T = k \times 2\tau$

- $k$ 随机取自 $\{0, 1, ..., 2^n - 1\}$
- $n = \min(\text{重传次数}, 10)$
- 最多重传 **16 次**后放弃

---

<div id="section-5" class="note-anchor"></div>

## 经典例题

**以太网速率 100Mbps，端到端距离 2km，传播速率 $2 \times 10^8$ m/s。求最短帧长。**

$\tau = 2000 / (2 \times 10^8) = 10\mu\text{s}$

争用期 $= 2\tau = 20\mu\text{s}$

最短帧长 $= 20 \times 10^{-6} \times 100 \times 10^6 = 2000\text{ bit}$

---

<div id="section-6" class="note-anchor"></div>

## 易错点

| 易错点 | 正确理解 |
|--------|----------|
| CSMA/CD 用在全双工以太网 | 全双工不需要——收发分离，无碰撞 |
| 争用期 = $\tau$ | 争用期 = $2\tau$（往返时间） |

---

<div id="section-7" class="note-anchor"></div>

## 考试重点

1. CSMA/CD 四个步骤
2. 争用期 = $2\tau$
3. 最短帧长 = 争用期 × 速率
4. 二进制指数退避
