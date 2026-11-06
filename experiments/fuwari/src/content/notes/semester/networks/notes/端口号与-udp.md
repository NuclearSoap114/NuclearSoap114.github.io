---
public: true
title: "端口号与 UDP"
series: "大二下期末复习"
subject: "计算机网络"
section: "传输层协议"
slug: "semester/networks/notes/端口号与-udp"
order: 154
---

> 来源：谢希仁《计算机网络》第6章

---

<div id="section-1" class="note-anchor"></div>

## 一、常见端口号

| 端口 | 协议 | 服务 |
|:----:|------|------|
| **21** | TCP | FTP（控制） |
| **22** | TCP | SSH |
| **23** | TCP | Telnet |
| **25** | TCP | SMTP（发邮件） |
| **53** | UDP/TCP | DNS |
| **67/68** | UDP | DHCP |
| **80** | TCP | HTTP |
| **110** | TCP | POP3（收邮件） |
| **143** | TCP | IMAP（收邮件） |
| **443** | TCP | HTTPS |
| **161** | UDP | SNMP |
| **520** | UDP | RIP |

> 端口范围：0~1023 知名端口，1024~49151 注册端口，49152~65535 动态端口

---

<div id="section-2" class="note-anchor"></div>

## 二、UDP 协议

<div id="section-3" class="note-anchor"></div>

### 特点

| 特点 | 说明 |
|------|------|
| **无连接** | 发送前不建立连接 |
| **不可靠** | 不保证交付、不保证顺序 |
| **面向报文** | 保留应用层报文边界 |
| **无拥塞控制** | 不因拥塞降低速率 |
| **首部小** | 仅 8 字节 |
| **支持广播/组播** | TCP 不支持 |

<div id="section-4" class="note-anchor"></div>

### UDP 首部（8 字节）

```
| 源端口(16) | 目的端口(16) |
| 长度(16)   | 检验和(16)   |
```

<div id="section-5" class="note-anchor"></div>

### 适用场景

DNS、实时音视频、DHCP、RIP

> UDP 适合对实时性要求高、能容忍少量丢包的应用。

---

<div id="section-6" class="note-anchor"></div>

## 考试重点

1. 常见端口号（HTTP/DNS/SMTP/POP3/FTP/HTTPS）— 选择/填空高频
2. UDP 的特点与适用场景
3. TCP vs UDP 对比
