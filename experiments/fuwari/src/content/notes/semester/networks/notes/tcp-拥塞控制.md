---
public: true
title: "TCP 拥塞控制"
series: "大二下期末复习"
subject: "计算机网络"
section: "传输层协议"
slug: "semester/networks/notes/tcp-拥塞控制"
order: 152
---

> 来源：谢希仁《计算机网络》第6章

---

<div id="section-1" class="note-anchor"></div>

## 一、两个核心变量

| 变量 | 含义 |
|------|------|
| **cwnd**（拥塞窗口） | 发送方根据拥塞程度动态调整 |
| **ssthresh**（慢开始门限） | cwnd < 此值→慢开始，cwnd ≥ 此值→拥塞避免 |

> 发送窗口 = min(cwnd, rwnd)

---

<div id="section-2" class="note-anchor"></div>

## 二、四种算法

<div id="section-3" class="note-anchor"></div>

### 1. 慢开始 (Slow Start)
- 每收到一个确认，cwnd **翻倍**（指数增长）：1→2→4→8→16...
- cwnd ≥ ssthresh → 转入拥塞避免

<div id="section-4" class="note-anchor"></div>

### 2. 拥塞避免 (Congestion Avoidance)
- 每经过一个 RTT，cwnd **+1**（线性增长）
- 检测到**超时** → ssthresh = cwnd/2, cwnd = 1 → 重新慢开始

<div id="section-5" class="note-anchor"></div>

### 3. 快重传 (Fast Retransmit)
- 收到 **3 个重复 ACK** → 立即重传丢失报文（不等超时）
- ssthresh = cwnd/2, cwnd = cwnd/2

<div id="section-6" class="note-anchor"></div>

### 4. 快恢复 (Fast Recovery)
- 收到重复 ACK 时 cwnd + 1
- 收到新数据 ACK 后 cwnd = ssthresh → 转入拥塞避免

---

<div id="section-7" class="note-anchor"></div>

## 三、超时 vs 3 重复 ACK

> **这是区分四种算法的关键**

| 事件 | 严重程度 | cwnd 变化 | 下一阶段 |
|------|:--------:|-----------|----------|
| **超时** | 严重拥塞 | cwnd → 1 | 慢开始 |
| **3 个重复 ACK** | 轻度拥塞 | cwnd → cwnd/2 | 快恢复 |

---

<div id="section-8" class="note-anchor"></div>

## 经典例题

**描述 TCP 拥塞控制的四种算法。**

慢开始：cwnd 从1开始指数增长，达到 ssthresh 后转入拥塞避免。
拥塞避免：cwnd 线性增长（每 RTT +1）。
快重传：收到3个重复 ACK 立即重传。
快恢复：配合快重传，cwnd 减半后线性增长。

---

<div id="section-9" class="note-anchor"></div>

## 易错点

| 易错点 | 正确理解 |
|--------|----------|
| 超时 → 快恢复 | 超时是严重拥塞 → 慢开始（cwnd=1） |
| 3重复ACK → 慢开始 | 3重复ACK是轻度拥塞 → 快恢复（cwnd 减半） |
| 慢开始 cwnd 每次+1 | 慢开始是指数增长（翻倍） |

---

<div id="section-10" class="note-anchor"></div>

## 考试重点

1. 四种算法各自的操作和触发条件
2. 超时 vs 3 重复 ACK 的处理区别
3. 能画出 cwnd 变化曲线
