---
title: "IPv6"
series: "大二下期末复习"
subject: "计算机网络"
section: "网络互连与 IP"
slug: "semester/networks/notes/ipv6"
order: 146
---

> 来源：谢希仁《计算机网络》第5章

---

<div id="section-1" class="note-anchor"></div>

## 一、为什么需要 IPv6

IPv4 地址耗尽：32 位 → 约 43 亿地址
IPv6：**128 位** → 约 $3.4 \times 10^{38}$ 个地址

---

<div id="section-2" class="note-anchor"></div>

## 二、IPv6 地址表示

8 组十六进制数，冒号分隔：
`2001:0db8:85a3:0000:0000:8a2e:0370:7334`

简化规则：
- 前导零可省略
- 连续零组可用 `::` 替代（仅一次）
- 简化后：`2001:db8:85a3::8a2e:370:7334`

---

<div id="section-3" class="note-anchor"></div>

## 三、IPv6 vs IPv4

| 对比 | IPv4 | IPv6 |
|------|------|------|
| 地址长度 | 32 位 | 128 位 |
| 首部长度 | 20-60 字节（可变） | 40 字节（固定） |
| 校验和 | 有首部校验和 | 无（交上层） |
| 分片 | 路由器可分片 | 只源节点分片 |
| NAT | 需要 | 不需要 |

---

<div id="section-4" class="note-anchor"></div>

## 考试重点

1. IPv6 地址长度（128位）
2. IPv6 地址简化规则
3. IPv6 首部固定 40 字节，无校验和
