---
public: true
title: "DNS 域名系统"
series: "大二下期末复习"
subject: "计算机网络"
section: "Internet 基础"
slug: "semester/networks/notes/dns-域名系统"
order: 155
---

> 来源：谢希仁《计算机网络》第7章

---

<div id="section-1" class="note-anchor"></div>

## 一、域名层次结构

```
根(.)
├── com
│   └── example.com
│       └── www.example.com
└── cn
    ├── edu.cn
    └── com.cn
```

---

<div id="section-2" class="note-anchor"></div>

## 二、DNS 解析过程

1. 客户端 → 本地 DNS 服务器（**递归查询**）
2. 本地 DNS → 根域名服务器 → 顶级域名服务器 → 权威域名服务器（**迭代查询**）
3. 返回结果给客户端

> **递归 vs 迭代**
> 递归：DNS 服务器替客户端完整查出最终结果
> 迭代：DNS 服务器返回下一级服务器地址，客户端继续查
> 客户端→本地DNS 用递归；本地DNS向上查用迭代

---

<div id="section-3" class="note-anchor"></div>

## 三、DNS 协议

- 端口：**53**
- 传输层：查询用 **UDP**，区域传输用 TCP
- DNS 缓存有 TTL，提高效率但可能导致更新延迟

---

<div id="section-4" class="note-anchor"></div>

## 考试重点

1. 域名层次结构（顶级/二级/三级）
2. 递归查询 vs 迭代查询
3. DNS 端口 53
