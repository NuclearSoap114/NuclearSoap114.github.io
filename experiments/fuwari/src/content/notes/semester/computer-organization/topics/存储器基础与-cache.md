---
public: true
title: "存储器基础与 Cache"
series: "大二下期末复习"
subject: "计算机组成原理"
section: "专题整理"
slug: "semester/computer-organization/topics/存储器基础与-cache"
order: 39
---

> **> 本章目标：**
>
> 看到题目能判断：
> - 是存储器容量题
> - 是地址线/数据线题
> - 是Cache命中率题
> - 是平均访问时间题
> - 是Cache地址划分题
>
> 来源：
> - 老师《自测题集》存储器章节
> - 老师《综合题》存储系统设计
> - 历年考试卷存储容量、Cache相关题

---

<div id="section-1" class="note-anchor"></div>

## 一、考试考什么

| 考点 | 题型 | 重要程度 |
|-|-|-|
| 存储器分类 | 选择/判断 | ⭐⭐⭐ |
| RAM、ROM区别 | 选择/填空 | ⭐⭐⭐ |
| 存储容量计算 | 计算题 | ⭐⭐⭐⭐⭐ |
| 地址线数量计算 | 计算题 | ⭐⭐⭐⭐⭐ |
| Cache命中率 | 计算题 | ⭐⭐⭐⭐⭐ |
| 平均访问时间 | 计算题 | ⭐⭐⭐⭐⭐ |
| Cache地址划分 | 综合题 | ⭐⭐⭐⭐ |
| DRAM刷新 | 选择/简答 | ⭐⭐⭐ |

---

<div id="section-2" class="note-anchor"></div>

## 二、存储系统基础

<div id="section-3" class="note-anchor"></div>

### 1. 存储器层次结构

速度从快到慢：

```
CPU寄存器
↓
Cache
↓
主存
↓
辅存
```

特点：

- 越靠近CPU，速度越快
- 容量越小
- 成本越高


---

<div id="section-4" class="note-anchor"></div>

## 三、RAM、ROM、Cache

<div id="section-5" class="note-anchor"></div>

### 1. RAM

随机存取存储器。

特点：

- 可读可写
- 断电丢失数据
- 用于主存


---

<div id="section-6" class="note-anchor"></div>

### 2. ROM

只读存储器。

特点：

- 主要用于存放固定程序
- 断电不丢失

例如：

系统固件。


---

<div id="section-7" class="note-anchor"></div>

### 3. Cache

高速缓冲存储器。

作用：

解决：

```
CPU速度 >> 主存速度
```

造成的速度差。

核心思想：

```
利用程序局部性原理
```

---

<div id="section-8" class="note-anchor"></div>

## 四、程序局部性原理

Cache有效的原因：

<div id="section-9" class="note-anchor"></div>

### 1. 时间局部性

刚访问的数据，可能马上再次访问。

例如：

循环变量。


<div id="section-10" class="note-anchor"></div>

### 2. 空间局部性

访问一个地址，附近地址可能也会访问。

例如：

数组连续存储。


---

<div id="section-11" class="note-anchor"></div>

## 五、存储容量计算

<div id="section-12" class="note-anchor"></div>

### 公式

```
容量 = 存储单元数量 × 每个单元存储位数
```

注意：

单位统一。

---

<div id="section-13" class="note-anchor"></div>

### 例题1

某存储器：

```
8K × 16位
```

表示：

- 8K个存储单元
- 每个单元16位


容量：

```
8K × 16bit
```

换算：

16bit=2Byte

所以：

```
容量=8KB×2=16KB
```

---

<div id="section-14" class="note-anchor"></div>

## 六、地址线数量计算（高频）

<div id="section-15" class="note-anchor"></div>

### 公式

如果有：

```
2^n 个存储单元
```

需要：

```
n根地址线
```

---

<div id="section-16" class="note-anchor"></div>

### 例题2

8K存储单元，需要多少地址线？

因为：

```
8K=2^13
```

所以：

答案：

```
13根地址线
```

---

<div id="section-17" class="note-anchor"></div>

## 七、数据线数量计算

数据线数量：

等于：

```
每个存储单元的数据位数
```

---

<div id="section-18" class="note-anchor"></div>

### 例题3

芯片：

```
16K×8位
```

问地址线和数据线：

地址：

```
16K=2^14
```

所以：

```
14根地址线
```

数据：

```
8根数据线
```

---

<div id="section-19" class="note-anchor"></div>

## 八、Cache命中率

<div id="section-20" class="note-anchor"></div>

### 1. 什么是命中率？

CPU访问Cache：

如果找到：

```
命中
```

否则：

```
未命中
```

公式：

```
H = Cache命中次数 / 总访问次数
```

---

<div id="section-21" class="note-anchor"></div>

### 例题4（典型）

访问Cache：

3800次

访问主存：

200次


总次数：

```
3800+200=4000
```


命中率：

```
H=3800/4000=0.95
```

答案：

```
95%
```

---

<div id="section-22" class="note-anchor"></div>

## 九、平均访问时间

这是最常考计算题。

---

<div id="section-23" class="note-anchor"></div>

### 方法1

如果题目给：

Cache访问时间 Tc

主存访问时间 Tm

命中率 H


公式：

```
T平均=H×Tc+(1-H)×Tm
```

---

<div id="section-24" class="note-anchor"></div>

### 方法2

如果强调：

先访问Cache，失败再访问主存：

公式：

```
T平均=Tc+(1-H)×Tm
```

考试看老师题目表达。


---

<div id="section-25" class="note-anchor"></div>

## 十、平均访问时间例题

<div id="section-26" class="note-anchor"></div>

### 例题5

已知：

Cache：

```
50ns
```

主存：

```
250ns
```

命中率：

```
95%
```


求平均访问时间。


计算：

```
T=0.95×50+0.05×250
```

第一部分：

```
47.5
```

第二部分：

```
12.5
```

结果：

```
60ns
```

---

<div id="section-27" class="note-anchor"></div>

## 十一、Cache效率

公式：

```
效率=Cache访问时间/平均访问时间
```


例：

Cache：

50ns

平均：

60ns


效率：

```
50/60=83.3%
```

---

<div id="section-28" class="note-anchor"></div>

## 十二、Cache地址划分

综合题常考。

一个主存地址通常分：

```
标记(Tag)
+
组号/行号
+
块内地址
```

---

<div id="section-29" class="note-anchor"></div>

## 十三、地址划分步骤

看到：

- 主存容量
- Cache容量
- 块大小
- 映射方式


按照：

<div id="section-30" class="note-anchor"></div>

### 第一步

求主存地址位数。


例如：

主存：

```
1MB
```

按字节编址：

```
1MB=2^20B
```

地址：

```
20位
```

---

<div id="section-31" class="note-anchor"></div>

### 第二步

求块内地址。

例如：

块大小：

```
16B
```

因为：

```
16B=2^4
```

所以：

块内地址：

```
4位
```

---

<div id="section-32" class="note-anchor"></div>

### 第三步

求Cache行数。

公式：

```
Cache容量/块大小
```

---

<div id="section-33" class="note-anchor"></div>

### 第四步

求标记位。

公式：

```
标记位=主存地址位-组号位-块内地址位
```

---

<div id="section-34" class="note-anchor"></div>

## 十四、直接映射、全相联、组相联

<div id="section-35" class="note-anchor"></div>

### 1. 直接映射

特点：

一个主存块只能放到固定Cache位置。


优点：

简单。

缺点：

冲突多。


地址：

```
标记+行号+块内地址
```


---

<div id="section-36" class="note-anchor"></div>

### 2. 全相联映射

特点：

任意位置都可以放。


优点：

冲突少。


缺点：

比较复杂。


地址：

```
标记+块内地址
```


---

<div id="section-37" class="note-anchor"></div>

### 3. 组相联映射

折中方案。

地址：

```
标记+组号+块内地址
```

---

<div id="section-38" class="note-anchor"></div>

## 十五、DRAM刷新（选择题）

DRAM需要刷新：

原因：

```
电容会漏电
```

刷新方式：

1. 集中刷新
2. 分散刷新
3. 异步刷新


---

<div id="section-39" class="note-anchor"></div>

## 十六、题型总结

<div id="section-40" class="note-anchor"></div>

### 类型1：容量题

关键词：

```
多少KB
多少MB
容量是多少
```

方法：

```
单元数×位数
```


---

<div id="section-41" class="note-anchor"></div>

### 类型2：地址线题

关键词：

```
需要多少根地址线
```

方法：

```
2^n=存储单元数
```


---

<div id="section-42" class="note-anchor"></div>

### 类型3：Cache命中率题

关键词：

```
命中次数
未命中次数
命中率
```

方法：

```
H=命中/总次数
```


---

<div id="section-43" class="note-anchor"></div>

### 类型4：平均访问时间

关键词：

```
Cache时间
主存时间
平均访问时间
效率
```

方法：

套公式。


---

<div id="section-44" class="note-anchor"></div>

## 十七、综合练习题

<div id="section-45" class="note-anchor"></div>

### 题1（历年题类型）

某存储器容量为：

```
8K×16位
```

求容量。


答案：

```
16KB
```

解析：

8K个单元，每个16bit=2Byte。

---

<div id="section-46" class="note-anchor"></div>

### 题2（历年题类型）

某Cache访问：

命中900次，

未命中100次。

求命中率。


答案：

```
90%
```

解析：

```
H=900/(900+100)
```

---

<div id="section-47" class="note-anchor"></div>

### 题3（模拟题）

Cache访问时间50ns。

主存访问时间250ns。

命中率0.8。

求平均访问时间。


答案：

```
T=0.8×50+0.2×250
=90ns
```

---

<div id="section-48" class="note-anchor"></div>

## 十八、易错点

<div id="section-49" class="note-anchor"></div>

### 1.

错误：

8K×16位认为是16KB。


正确：

先换算：

```
16bit=2Byte
```

所以：

```
8K×2=16KB
```


---

<div id="section-50" class="note-anchor"></div>

### 2.

错误：

地址线等于容量大小。


正确：

地址线看：

```
存储单元数量
```

---

<div id="section-51" class="note-anchor"></div>

### 3.

错误：

Cache命中率：

```
命中次数/未命中次数
```

正确：

```
命中次数/总访问次数
```


---

<div id="section-52" class="note-anchor"></div>

### 4.

错误：

Cache属于主存。

正确：

Cache属于CPU和主存之间的高速缓存。


---

<div id="section-53" class="note-anchor"></div>

## 十九、考前30秒速背

```
Cache解决CPU和主存速度差。

Cache有效靠局部性：
时间局部性+空间局部性。

地址线：
2^n=存储单元数。

容量：
单元数×每单元位数。

命中率：
命中次数/总访问次数。

平均访问时间：
H×Cache时间+(1-H)×主存时间。

标记位：
地址位-组号位-块内地址位。
```
