---
public: true
title: "CPU 结构、寄存器与指令执行"
series: "大二下期末复习"
subject: "计算机组成原理"
section: "专题整理"
slug: "semester/computer-organization/topics/cpu-结构、寄存器与指令执行"
order: 42
---

> **> 本章对应：**
> - 老师综合题：单总线CPU指令执行分析
> - 期末复习PPT：CPU结构和功能
> - 历年卷：寄存器作用、取指过程、微操作分析
>
> 核心目标：
>
> **看到CPU题，知道每个寄存器干什么，知道数据怎么流动。**

---

<div id="section-1" class="note-anchor"></div>

## 一、考试考什么

|考点|题型|重要程度|
|-|-|-|
|CPU组成|选择/填空|⭐⭐⭐⭐|
|寄存器作用|选择/简答|⭐⭐⭐⭐⭐|
|取指周期|简答/综合|⭐⭐⭐⭐⭐|
|单总线数据通路|综合题|⭐⭐⭐⭐⭐|
|指令执行微操作|综合题|⭐⭐⭐⭐⭐|
|ALU作用|选择|⭐⭐⭐|

---

<div id="section-2" class="note-anchor"></div>

## 二、CPU基本组成

CPU主要包括：

```
运算器
控制器
寄存器组
```

---

<div id="section-3" class="note-anchor"></div>

### 1. 运算器

作用：

完成：

- 算术运算
- 逻辑运算

核心：

```
ALU
```

ALU：

Arithmetic Logic Unit

中文：

```
算术逻辑单元
```

---

<div id="section-4" class="note-anchor"></div>

### 2. 控制器

作用：

控制计算机各部件协调工作。

主要任务：

1. 取指令
2. 分析指令
3. 执行指令

---

<div id="section-5" class="note-anchor"></div>

## 三、CPU重要寄存器

<div id="section-6" class="note-anchor"></div>

### 1. PC（程序计数器）

作用：

保存：

```
下一条要执行指令的地址
```

关键词：

```
下一条指令地址
```

---

<div id="section-7" class="note-anchor"></div>

### 2. IR（指令寄存器）

作用：

保存：

```
当前正在执行的指令
```

关键词：

```
当前指令
```

---

<div id="section-8" class="note-anchor"></div>

### 3. MAR（地址寄存器）

作用：

保存：

```
访问主存的地址
```

关键词：

```
地址
```

---

<div id="section-9" class="note-anchor"></div>

### 4. MDR（数据寄存器）

作用：

保存：

```
从主存读出的数据
或
准备写入主存的数据
```

关键词：

```
数据
```

---

<div id="section-10" class="note-anchor"></div>

### 5. ACC（累加器）

作用：

保存：

```
运算结果
```

常用于：

加法、减法。

---

<div id="section-11" class="note-anchor"></div>

### 6. MQ（乘商寄存器）

作用：

用于：

```
乘法、除法
```

保存：

- 乘积
- 商

---

<div id="section-12" class="note-anchor"></div>

### 7. PSW（程序状态字）

保存：

```
状态信息
```

例如：

- 进位
- 溢出
- 符号
- 零标志

---

<div id="section-13" class="note-anchor"></div>

## 四、寄存器快速记忆

|寄存器|作用|
|-|-|
|PC|下一条指令地址|
|IR|当前指令|
|MAR|地址|
|MDR|数据|
|ACC|运算结果|
|MQ|乘除法|
|PSW|状态|

口诀：

```
PC管地址
IR管指令
MAR找地方
MDR搬数据
ACC存结果
PSW看状态
```

---

<div id="section-14" class="note-anchor"></div>

## 五、指令执行过程

CPU执行一条指令：

```
取指令
↓
分析指令
↓
执行指令
```

---

<div id="section-15" class="note-anchor"></div>

## 六、取指周期（必背）

固定流程：

<div id="section-16" class="note-anchor"></div>

### 第一步

PC送地址：

```
PC → MAR
```

---

<div id="section-17" class="note-anchor"></div>

### 第二步

访问主存：

```
M[MAR] → MDR
```

---

<div id="section-18" class="note-anchor"></div>

### 第三步

指令送IR：

```
MDR → IR
```

---

<div id="section-19" class="note-anchor"></div>

### 第四步

PC加1：

```
PC+1 → PC
```

---

完整：

```
PC → MAR
M[MAR] → MDR
MDR → IR
PC+1 → PC
```

---

<div id="section-20" class="note-anchor"></div>

## 七、为什么PC+1？

因为：

当前指令取出来后：

PC需要指向：

```
下一条指令
```

---

<div id="section-21" class="note-anchor"></div>

## 八、单总线CPU

<div id="section-22" class="note-anchor"></div>

### 什么是单总线？

CPU内部：

所有寄存器通过：

```
一条公共总线
```

交换数据。

---

优点：

结构简单。

缺点：

速度受限。

---

<div id="section-23" class="note-anchor"></div>

## 九、数据通路分析方法

看到：

```
某指令执行过程
```

不要乱写。

按照：

```
数据来源
↓
经过什么部件
↓
进入哪里
```

分析。

---

<div id="section-24" class="note-anchor"></div>

## 十、ADD指令执行

例如：

```
ADD X
```

含义：

```
ACC ← ACC + M[X]
```

---

执行过程：

<div id="section-25" class="note-anchor"></div>

### 1. 地址送MAR

```
X → MAR
```

---

<div id="section-26" class="note-anchor"></div>

### 2. 取操作数

```
M[MAR] → MDR
```

---

<div id="section-27" class="note-anchor"></div>

### 3. ALU计算

```
ACC + MDR → ACC
```

---

结果：

ACC保存加法结果。

---

<div id="section-28" class="note-anchor"></div>

## 十一、MOV指令执行

例如：

```
MOV R1,R2
```

含义：

```
R2 → R1
```

数据流：

```
R2 → 总线 → R1
```

---

<div id="section-29" class="note-anchor"></div>

## 十二、SUB指令执行

例如：

```
SUB X
```

含义：

```
ACC ← ACC - M[X]
```

流程：

```
X → MAR
M[MAR] → MDR
ACC-MDR → ACC
```

---

<div id="section-30" class="note-anchor"></div>

## 十三、题型识别

<div id="section-31" class="note-anchor"></div>

### 类型1：寄存器作用题

关键词：

```
PC作用？
MAR作用？
```

直接背表。

---

<div id="section-32" class="note-anchor"></div>

### 类型2：取指过程题

关键词：

```
CPU如何取一条指令？
```

直接写：

```
PC→MAR
M[MAR]→MDR
MDR→IR
PC+1→PC
```

---

<div id="section-33" class="note-anchor"></div>

### 类型3：指令微操作题

关键词：

```
执行ADD/MOV/SUB需要哪些微操作？
```

步骤：

1. 写指令含义
2. 分析数据来源
3. 写寄存器传送
4. 写ALU运算

---

<div id="section-34" class="note-anchor"></div>

## 十四、练习题

<div id="section-35" class="note-anchor"></div>

### 例题1（历年类型）

PC的作用是什么？

答案：

```
保存下一条指令地址
```

解析：

PC不是保存当前指令，当前指令在IR。

---

<div id="section-36" class="note-anchor"></div>

### 例题2（历年类型）

取指令过程中，正确顺序是什么？

答案：

```
PC→MAR
M[MAR]→MDR
MDR→IR
PC+1→PC
```

解析：

先根据PC找到地址，再取指令。

---

<div id="section-37" class="note-anchor"></div>

### 例题3（综合题）

执行：

```
ADD X
```

写主要微操作。

答案：

```
X→MAR
M[MAR]→MDR
ACC+MDR→ACC
```

解析：

ADD本质：

```
累加器+存储器数据
```

---

<div id="section-38" class="note-anchor"></div>

## 十五、易错点

<div id="section-39" class="note-anchor"></div>

### 1.

错误：

MAR存数据。

正确：

```
MAR存地址
```

---

<div id="section-40" class="note-anchor"></div>

### 2.

错误：

IR存下一条指令。

正确：

```
IR存当前指令
```

---

<div id="section-41" class="note-anchor"></div>

### 3.

错误：

PC存当前执行指令地址。

正确：

```
PC存下一条指令地址
```

---

<div id="section-42" class="note-anchor"></div>

### 4.

错误：

MDR存地址。

正确：

```
MDR存数据
```

---

<div id="section-43" class="note-anchor"></div>

## 十六、考前30秒速背

```
CPU三部分：
运算器、控制器、寄存器组

寄存器：
PC 下一条指令地址
IR 当前指令
MAR 地址
MDR 数据
ACC 结果
MQ 乘除
PSW 状态


取指：

PC→MAR
M[MAR]→MDR
MDR→IR
PC+1→PC


ADD：

地址→MAR
数据→MDR
ACC+MDR→ACC
```
