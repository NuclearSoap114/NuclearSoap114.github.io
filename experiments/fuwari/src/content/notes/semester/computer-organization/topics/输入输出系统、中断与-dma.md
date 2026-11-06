---
title: "输入输出系统、中断与 DMA"
series: "大二下期末复习"
subject: "计算机组成原理"
section: "专题整理"
slug: "semester/computer-organization/topics/输入输出系统、中断与-dma"
order: 45
---

> **> 本章对应：**
> - 老师综合题：DMA相关题
> - 老师PPT：I/O控制方式
> - 自测题：输入输出系统章节
> - 历年卷：I/O方式、中断、DMA区别
>
> 核心目标：
>
> 看到I/O题，能够判断：
>
> - 程序查询？
> - 中断方式？
> - DMA方式？
> - 各自优缺点？
> - DMA如何工作？

---

<div id="section-1" class="note-anchor"></div>

## 一、考试考什么

|考点|题型|重要程度|
|-|-|-|
|I/O控制方式|选择/简答|⭐⭐⭐⭐⭐|
|程序查询方式|选择|⭐⭐⭐|
|中断方式|选择/简答|⭐⭐⭐⭐|
|DMA方式|综合题|⭐⭐⭐⭐⭐|
|DMA流程|简答|⭐⭐⭐⭐⭐|
|三种方式比较|简答|⭐⭐⭐⭐⭐|

---

<div id="section-2" class="note-anchor"></div>

## 二、I/O系统基本概念

<div id="section-3" class="note-anchor"></div>

### 1. 输入输出系统作用

负责：

```
CPU与外部设备之间的数据交换
```

外设：

- 键盘
- 磁盘
- 打印机
- 网络设备

---

<div id="section-4" class="note-anchor"></div>

## 三、I/O控制方式

计算机管理外设主要有：

1. 程序查询方式
2. 程序中断方式
3. DMA方式
4. 通道方式

考试重点前三种。

---

<div id="section-5" class="note-anchor"></div>

## 四、程序查询方式

<div id="section-6" class="note-anchor"></div>

### 1. 原理

CPU不断查询设备状态：

```
CPU询问
↓
设备是否准备好？
↓
继续等待
```

---

<div id="section-7" class="note-anchor"></div>

### 2. 特点

优点：

- 控制简单
- 硬件少

缺点：

- CPU大量等待
- 效率低

---

<div id="section-8" class="note-anchor"></div>

### 3. 适用

适合：

- 低速设备
- 简单系统

---

<div id="section-9" class="note-anchor"></div>

## 五、中断方式

<div id="section-10" class="note-anchor"></div>

### 1. 原理

设备准备完成后：

主动通知CPU。

流程：

```
设备请求中断
↓
CPU响应
↓
执行中断服务程序
↓
返回原程序
```

---

<div id="section-11" class="note-anchor"></div>

### 2. 优点

相比程序查询：

CPU不用一直等待。

提高CPU利用率。

---

<div id="section-12" class="note-anchor"></div>

### 3. 缺点

CPU仍需要参与数据传送。

---

<div id="section-13" class="note-anchor"></div>

## 六、DMA方式（重点）

<div id="section-14" class="note-anchor"></div>

### 1. DMA是什么？

DMA：

Direct Memory Access

中文：

直接存储器访问。

作用：

让：

```
外设 ↔ 主存
```

直接交换数据。

CPU不用逐字节搬运。

---

<div id="section-15" class="note-anchor"></div>

## 七、DMA工作流程（必背）

<div id="section-16" class="note-anchor"></div>

### 第一步

设备提出DMA请求：

```
DMA请求
```

---

<div id="section-17" class="note-anchor"></div>

### 第二步

CPU响应：

- 保存现场
- 让出总线

---

<div id="section-18" class="note-anchor"></div>

### 第三步

DMA控制器接管总线。

---

<div id="section-19" class="note-anchor"></div>

### 第四步

数据传输：

```
外设 ↔ 主存
```

---

<div id="section-20" class="note-anchor"></div>

### 第五步

传输完成：

DMA通知CPU。

---

口诀：

```
请求
响应
接管
传输
结束
```

---

<div id="section-21" class="note-anchor"></div>

## 八、三种I/O方式比较（高频）

|方式|CPU参与|效率|特点|
|-|-|-|-|
|程序查询|最高|低|CPU一直等待|
|中断|较低|较高|设备通知CPU|
|DMA|最低|最高|设备和主存直接交换|

---

<div id="section-22" class="note-anchor"></div>

## 九、DMA为什么效率高？

因为：

程序查询：

```
CPU搬数据
```

中断：

```
CPU参与搬数据
```

DMA：

```
DMA控制器搬数据
```

所以：

CPU负担最低。

---

<div id="section-23" class="note-anchor"></div>

## 十、DMA周期窃取

<div id="section-24" class="note-anchor"></div>

### 什么是周期窃取？

DMA访问主存时：

占用CPU原本访问主存的周期。

所以叫：

```
窃取周期
```

---

<div id="section-25" class="note-anchor"></div>

### 影响

优点：

提高I/O速度。

缺点：

CPU速度受到影响。

---

<div id="section-26" class="note-anchor"></div>

## 十一、中断基础

<div id="section-27" class="note-anchor"></div>

### 1. 什么情况产生中断？

常见：

1. I/O完成
2. 外部设备请求
3. 程序异常
4. 定时器到时

---

<div id="section-28" class="note-anchor"></div>

### 2. 中断处理过程

```
中断请求
↓
中断判优
↓
保护现场
↓
执行中断服务程序
↓
恢复现场
↓
返回
```

---

<div id="section-29" class="note-anchor"></div>

## 十二、中断和DMA区别

|比较|中断|DMA|
|-|-|-|
|控制对象|CPU参与控制|DMA控制器|
|数据传送|CPU参与|DMA直接完成|
|适合|少量数据|大量数据|
|CPU负担|较高|较低|

---

<div id="section-30" class="note-anchor"></div>

## 十三、题型识别

<div id="section-31" class="note-anchor"></div>

### 类型1：问三种方式区别

关键词：

```
CPU参与程度
效率
```

直接比较表。

---

<div id="section-32" class="note-anchor"></div>

### 类型2：DMA流程题

关键词：

```
直接存储器访问
大量数据传输
```

写：

```
请求→响应→接管→传输→结束
```

---

<div id="section-33" class="note-anchor"></div>

### 类型3：为什么DMA快

答案：

因为DMA控制器直接完成外设和主存之间的数据交换，CPU只负责初始化和结束处理。

---

<div id="section-34" class="note-anchor"></div>

## 十四、练习题

<div id="section-35" class="note-anchor"></div>

### 例题1（历年类型）

哪种I/O方式CPU参与程度最低？

A. 程序查询  
B. 中断  
C. DMA  
D. 手动输入

答案：

```
C
```

解析：

DMA由控制器直接完成外设和主存数据交换。

---

<div id="section-36" class="note-anchor"></div>

### 例题2（简答）

比较程序查询、中断、DMA三种方式。

答案：

程序查询需要CPU不断查询设备状态，CPU利用率低；中断方式由设备主动通知CPU，提高效率；DMA方式由DMA控制器直接完成外设和主存数据传输，CPU参与最少，效率最高。

---

<div id="section-37" class="note-anchor"></div>

### 例题3（流程题）

写出DMA工作过程。

答案：

```
设备提出DMA请求
↓
CPU响应DMA请求
↓
DMA控制器接管总线
↓
外设与主存直接交换数据
↓
传输完成通知CPU
```

---

<div id="section-38" class="note-anchor"></div>

## 十五、易错点

<div id="section-39" class="note-anchor"></div>

### 1.

错误：

DMA完全不需要CPU。

正确：

DMA需要CPU初始化和结束处理。

---

<div id="section-40" class="note-anchor"></div>

### 2.

错误：

中断方式数据全部由设备完成。

正确：

CPU仍参与中断服务程序。

---

<div id="section-41" class="note-anchor"></div>

### 3.

错误：

程序查询效率最高。

正确：

DMA效率最高。

---

<div id="section-42" class="note-anchor"></div>

### 4.

错误：

DMA直接访问CPU寄存器。

正确：

DMA主要完成：

```
外设与主存
```

之间的数据交换。

---

<div id="section-43" class="note-anchor"></div>

## 十六、考前30秒速背

```
I/O方式：

程序查询：
CPU一直问，效率低

中断：
设备通知CPU

DMA：
外设和主存直接交换


效率：
DMA > 中断 > 程序查询


DMA流程：

请求
响应
接管总线
数据传输
结束通知


DMA优点：
CPU负担小，适合大量数据传输
