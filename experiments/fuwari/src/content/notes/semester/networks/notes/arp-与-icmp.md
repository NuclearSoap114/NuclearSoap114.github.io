---
public: true
title: "ARP 与 ICMP"
series: "大二下期末复习"
subject: "计算机网络"
section: "网络互连与 IP"
slug: "semester/networks/notes/arp-与-icmp"
order: 144
---

> 来源：谢希仁《计算机网络》第5章

---

<div id="section-1" class="note-anchor"></div>

## 一、ARP（地址解析协议）

> **IP 地址 → MAC 地址**

<div id="section-2" class="note-anchor"></div>

### 工作过程

1. 查 ARP 缓存，有则直接用
2. 无 → **广播** ARP 请求："谁的 IP 是 xxx？"
3. 目标主机**单播** ARP 响应："我的 MAC 是 xxx"
4. 将映射写入 ARP 缓存（有过期时间）

> ARP 请求是广播，ARP 响应是单播。

---

<div id="section-3" class="note-anchor"></div>

## 二、ICMP（网际控制报文协议）

| 报文类型 | 用途 | 命令 |
|----------|------|------|
| **回显请求/应答** | 测试连通性 | **ping** |
| **超时(TTL=0)** | TTL过期通知 | **tracert** |
| **目的不可达** | 无法到达目标 | tracert |
| **重定向** | 更好的路由 | — |

---

<div id="section-4" class="note-anchor"></div>

## 三、Ping 与 Tracert

**Ping**：发送 ICMP 回显请求→等待回显应答→计算 RTT

**Tracert**：依次发 TTL=1,2,3... 的包→每跳返回 ICMP 超时→获知路径

---

<div id="section-5" class="note-anchor"></div>

## 考试重点

1. ARP 请求广播/响应单播
2. Ping 和 Tracert 的工作原理
3. ICMP 常见报文类型
