---
public: true
title: "HTTP 与 WWW"
series: "大二下期末复习"
subject: "计算机网络"
section: "Internet 基础"
slug: "semester/networks/notes/http-与-www"
order: 156
---

> 来源：谢希仁《计算机网络》第7章

---

<div id="section-1" class="note-anchor"></div>

## 一、HTTP 特点

| 特点 | 说明 |
|------|------|
| **无状态** | 服务器不保存客户端历史 |
| **面向连接** | 使用 TCP（端口 80） |
| **请求-响应** | 客户端请求，服务器响应 |

---

<div id="section-2" class="note-anchor"></div>

## 二、HTTP 请求方法

| 方法 | 含义 |
|------|------|
| **GET** | 请求获取资源（只读） |
| **POST** | 提交数据，创建资源 |
| **PUT** | 更新资源 |
| **DELETE** | 删除资源 |

---

<div id="section-3" class="note-anchor"></div>

## 三、HTTP 状态码

| 状态码 | 含义 |
|--------|------|
| **200** | OK |
| **301** | 永久重定向 |
| **302** | 临时重定向 |
| **304** | 未修改（缓存有效） |
| **400** | Bad Request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **404** | Not Found |
| **500** | Internal Server Error |
| **502** | Bad Gateway |
| **503** | Service Unavailable |

> 2xx=成功，3xx=重定向，4xx=客户端错误，5xx=服务器错误

---

<div id="section-4" class="note-anchor"></div>

## 四、HTTPS

> HTTPS = HTTP + SSL/TLS
> 端口 **443**（HTTP 是 80）
> 提供：加密 + 认证 + 数据完整性

---

<div id="section-5" class="note-anchor"></div>

## 五、Cookie

HTTP 无状态 → Cookie 让服务器记住客户端。服务器生成，浏览器存储，每次请求自动携带。

---

<div id="section-6" class="note-anchor"></div>

## 考试重点

1. 常见状态码含义
2. HTTP vs HTTPS 区别（端口、加密）
3. HTTP 请求方法
