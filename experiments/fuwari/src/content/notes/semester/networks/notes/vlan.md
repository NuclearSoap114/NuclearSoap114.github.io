---
public: true
title: "VLAN"
series: "大二下期末复习"
subject: "计算机网络"
section: "局域网"
slug: "semester/networks/notes/vlan"
order: 139
---

> 来源：谢希仁《计算机网络》第3章

---

<div id="section-1" class="note-anchor"></div>

## 一、VLAN 概念

在物理局域网中划分出**逻辑隔离**的虚拟局域网。同一 VLAN 内可通信，不同 VLAN 间默认不能直接通信。

---

<div id="section-2" class="note-anchor"></div>

## 二、VLAN 优点

| 优点 | 说明 |
|------|------|
| **广播域隔离** | 缩小广播域，减少广播风暴 |
| **安全性** | 不同 VLAN 默认隔离 |
| **灵活性** | 不依赖物理位置 |

---

<div id="section-3" class="note-anchor"></div>

## 三、VLAN 划分方式

| 方式 | 说明 |
|------|------|
| **基于端口** | 交换机端口划分到不同 VLAN（最常用） |
| **基于 MAC 地址** | 按 MAC 地址划分 |
| **基于协议** | 按网络层协议划分 |

---

<div id="section-4" class="note-anchor"></div>

## 四、802.1Q 帧格式

在 MAC 帧中插入 **4 字节 VLAN 标签**：
- TPID：0x8100，标识 802.1Q 帧
- VLAN ID：12 位，支持 4096 个 VLAN

---

<div id="section-5" class="note-anchor"></div>

## 考试重点

1. VLAN 的作用：隔离广播域
2. 最常用划分方式：基于端口
3. 802.1Q 标签
