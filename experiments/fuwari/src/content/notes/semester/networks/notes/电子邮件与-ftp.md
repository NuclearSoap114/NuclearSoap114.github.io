---
public: true
title: "电子邮件与 FTP"
series: "大二下期末复习"
subject: "计算机网络"
section: "Internet 基础"
slug: "semester/networks/notes/电子邮件与-ftp"
order: 157
---

> 来源：谢希仁《计算机网络》第7章

---

<div id="section-1" class="note-anchor"></div>

## 一、电子邮件协议

| 协议 | 端口 | 方向 | 功能 |
|------|:----:|------|------|
| **SMTP** | 25 | 发送 | 客户端→服务器 / 服务器间转发 |
| **POP3** | 110 | 接收 | 下载到客户端（默认删服务器副本） |
| **IMAP** | 143 | 接收 | 服务器上管理（多设备同步） |

> MIME：扩展 SMTP 支持非 ASCII 文本和附件

---

<div id="section-2" class="note-anchor"></div>

## 二、FTP

| 特征 | 说明 |
|------|------|
| **控制连接** | TCP 21，持续存在，传命令 |
| **数据连接** | TCP 20，按需建立，传文件 |
| **模式** | 主动(PORT) / 被动(PASV) |

---

<div id="section-3" class="note-anchor"></div>

## 考试重点

1. SMTP/POP3/IMAP 端口与功能对比
2. FTP 双连接（21控制 + 20数据）
