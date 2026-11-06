---
public: true
title: "IEEE 802 与局域网概述"
series: "大二下期末复习"
subject: "计算机网络"
section: "局域网"
slug: "semester/networks/notes/ieee-802-与局域网概述"
order: 138
---

> 来源：谢希仁《计算机网络》第3章

---

<div id="section-1" class="note-anchor"></div>

## 一、局域网的特点

| 特点 | 说明 |
|------|------|
| 覆盖范围小 | 几米到几公里 |
| 传输速率高 | 10Mbps ~ 10Gbps |
| 误码率低 | $10^{-8} \sim 10^{-11}$ |
| 为一个单位拥有 | 自建自管 |

---

<div id="section-2" class="note-anchor"></div>

## 二、IEEE 802 标准

| 标准 | 内容 |
|------|------|
| **IEEE 802.2** | 逻辑链路控制 (LLC) |
| **IEEE 802.3** | CSMA/CD 以太网 |
| **IEEE 802.5** | 令牌环 |
| **IEEE 802.11** | 无线局域网 (Wi-Fi) |

---

<div id="section-3" class="note-anchor"></div>

## 三、LLC 子层与 MAC 子层

数据链路层分为两个子层：

- **LLC**（逻辑链路控制）：与物理介质无关，向上提供统一接口
- **MAC**（介质访问控制）：与物理介质相关，控制信道访问

---

<div id="section-4" class="note-anchor"></div>

## 考试重点

1. IEEE 802.3 = 以太网，IEEE 802.11 = Wi-Fi
2. LLC/MAC 两个子层的分工
