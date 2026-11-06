---
public: true
title: "HDLC 协议"
series: "大二下期末复习"
subject: "计算机网络"
section: "广域网"
slug: "semester/networks/notes/hdlc-协议"
order: 142
---

> 来源：谢希仁《计算机网络》第4章

---

<div id="section-1" class="note-anchor"></div>

## 一、HDLC 三种帧类型

| 帧类型 | 控制字段 | 功能 |
|--------|----------|------|
| **信息帧(I帧)** | 第1位=0 | 传输用户数据 |
| **监督帧(S帧)** | 第1,2位=10 | 流量控制与差错控制 |
| **无编号帧(U帧)** | 第1,2位=11 | 链路建立与拆除 |

---

<div id="section-2" class="note-anchor"></div>

## 二、PPP vs HDLC

| 对比 | PPP | HDLC |
|------|-----|------|
| 面向 | 字节 | 比特 |
| 可靠性 | 不可靠（只检错） | 可靠（纠错+确认） |
| 寻址 | 无实际寻址 | 有地址字段 |
| 使用 | Internet 接入（当前主流） | 较老，已被 PPP 取代 |

---

<div id="section-3" class="note-anchor"></div>

## 考试重点

1. HDLC 三种帧类型
2. PPP vs HDLC 对比
