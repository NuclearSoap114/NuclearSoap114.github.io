---
public: true
title: "PV 操作"
series: "大二下期末复习"
subject: "操作系统"
section: "习题解析"
slug: "semester/operating-systems/exercises/pv-操作"
order: 60
---

<div id="section-1" class="note-anchor"></div>

## 一、考点概述

PV操作是OS大题中最难的一类。考试给一个并发场景（如生产者-消费者、读者-写者），要求**写出完整的PV同步算法**。

---

<div id="section-2" class="note-anchor"></div>

## 二、核心概念

<div id="section-3" class="note-anchor"></div>

### 信号量（Semaphore）

| 类型 | 含义 | 初始值 | 操作 |
|------|------|:------:|------|
| **互斥信号量** (mutex) | 保护临界区，同一时刻仅一个进程访问 | **1** | P(mutex) / V(mutex) |
| **同步信号量** (empty/full) | 控制进程间的执行顺序/资源计数 | 取决于资源数 | P(full) 消费 / V(empty) 生产 |

> **P/V 的含义（必背）**
> - **P(S)**（wait / 荷兰语 Proberen"测试"）：S = S - 1，若 S < 0 则阻塞
> - **V(S)**（signal / 荷兰语 Verhogen"增加"）：S = S + 1，若 S ≤ 0 则唤醒一个等待进程

<div id="section-4" class="note-anchor"></div>

### 解题三步法

```
❶ 找临界资源 → 每个临界资源设一个 mutex（初值1）
   临界资源 = 同一时刻只能被一个进程使用的资源
   （如：共享缓冲区、共享变量、打印机）

❷ 找制约关系 → 每个制约关系设一个同步信号量
   "缓冲区空" → empty（初值 = 缓冲区大小 N）
   "缓冲区有数据" → full（初值 = 0）

❸ 写代码：
   进入临界区前 → P(mutex)
   离开临界区后 → V(mutex)
   生产前 → P(empty)  // "等空位"
   生产后 → V(full)   // "通知有数据"
   消费前 → P(full)   // "等数据"
   消费后 → V(empty)  // "通知有空位"

   ⚠️ P操作顺序：先P同步信号量，再P互斥信号量（防死锁）
   ⚠️ V操作顺序：先V互斥信号量，再V同步信号量
```

---

<div id="section-5" class="note-anchor"></div>

## 三、经典模型1：生产者-消费者

<div id="section-6" class="note-anchor"></div>

### 问题

一组生产者向缓冲区放产品，一组消费者从缓冲区取产品。缓冲区大小为N。

<div id="section-7" class="note-anchor"></div>

### 信号量设置

```
semaphore mutex = 1;   // 互斥访问缓冲区
semaphore empty = N;   // 缓冲区空位数（初始N个全空）
semaphore full  = 0;   // 缓冲区产品数（初始0个）
```

<div id="section-8" class="note-anchor"></div>

### 代码（必背模板）

```c
// 生产者
Producer() {
    while (1) {
        生产一个产品;
        P(empty);       // ① 等空位
        P(mutex);       // ② 进入临界区
        将产品放入缓冲区;
        V(mutex);       // ③ 离开临界区
        V(full);        // ④ 通知"有产品了"
    }
}

// 消费者
Consumer() {
    while (1) {
        P(full);        // ① 等有产品
        P(mutex);       // ② 进入临界区
        从缓冲区取出产品;
        V(mutex);       // ③ 离开临界区
        V(empty);       // ④ 通知"有空位了"
        消费产品;
    }
}
```

> **常见错误**
> - 把 P(empty) 和 P(mutex) 写反 → 可能导致**死锁**（生产者占着mutex等empty，消费者占着mutex等full）
> - 忘记 V 操作 → 其他进程永远阻塞
> - mutex 的初始值写错 → 互斥必须初始为1

---

<div id="section-9" class="note-anchor"></div>

## 四、经典模型2：读者-写者

<div id="section-10" class="note-anchor"></div>

### 问题

多个读者可同时读，但写者必须独占访问。

<div id="section-11" class="note-anchor"></div>

### 信号量设置

```
semaphore rw_mutex = 1;  // 写者互斥（读写互斥、写写互斥）
semaphore mutex = 1;     // 保护读者计数器 read_count
int read_count = 0;      // 当前读者数
```

<div id="section-12" class="note-anchor"></div>

### 代码

```c
// 读者
Reader() {
    while (1) {
        P(mutex);                // 保护 read_count
        read_count++;
        if (read_count == 1)
            P(rw_mutex);         // 第一个读者锁住写者
        V(mutex);

        读操作;

        P(mutex);
        read_count--;
        if (read_count == 0)
            V(rw_mutex);         // 最后一个读者释放写者
        V(mutex);
    }
}

// 写者
Writer() {
    while (1) {
        P(rw_mutex);             // 申请写权限
        写操作;
        V(rw_mutex);             // 释放写权限
    }
}
```

> **读者优先 vs 写者优先**
> - 以上是**读者优先**——只要有读者在读，写者就等
> - **写者优先**：需要额外信号量限制读者不能"插队"

---

<div id="section-13" class="note-anchor"></div>

## 五、经典模型3：哲学家就餐问题

<div id="section-14" class="note-anchor"></div>

### 问题

5位哲学家围坐圆桌，5根筷子放在两人之间。哲学家要么思考，要么吃饭。吃饭需同时拿起**左右两根筷子**。

<div id="section-15" class="note-anchor"></div>

### 信号量方案（防止死锁）

```
semaphore chopstick[5] = {1, 1, 1, 1, 1};  // 每根筷子一个信号量
semaphore mutex = 1;  // 限制同时拿筷子的人数（最多4人）
```

```c
// 方法一：限制同时就餐人数 ≤ 4（防死锁）
Philosopher_i() {
    while (1) {
        思考;
        P(mutex);                // 检查是否可进入（最多4人）
        P(chopstick[i]);         // 拿左边
        P(chopstick[(i+1)%5]);   // 拿右边
        V(mutex);
        
        吃饭;
        
        V(chopstick[i]);         // 放左边
        V(chopstick[(i+1)%5]);   // 放右边
    }
}
```

```c
// 方法二：奇数先左后右，偶数先右后左（防死锁）
Philosopher_i() {
    while (1) {
        思考;
        if (i % 2 == 1) {        // 奇数号
            P(chopstick[i]);     // 先左
            P(chopstick[(i+1)%5]); // 后右
        } else {                 // 偶数号
            P(chopstick[(i+1)%5]); // 先右
            P(chopstick[i]);     // 后左
        }
        吃饭;
        V(chopstick[i]);
        V(chopstick[(i+1)%5]);
    }
}
```

> **死锁原因与解决**
> - **死锁原因**：5人同时拿起左边的筷子 → 每人都在等右边的 → 死锁
> - **解法1**：限制最多4人同时拿筷子（破坏环路等待）
> - **解法2**：奇偶编号拿筷子顺序不同（破坏环路等待）
> - **解法3**：同时拿两根（用AND型信号量）

---

<div id="section-16" class="note-anchor"></div>

## 六、同类练习题

<div id="section-17" class="note-anchor"></div>

### 练习1：苹果橘子问题

> **题目**：有一个盘子，父亲每次放一个苹果，母亲每次放一个橘子，儿子只吃苹果，女儿只吃橘子。盘子一次只能放一个水果。用PV操作实现同步。

**解析**：

**资源分析**：
- 盘子是临界资源（一次一个水果）→ plate = 1（空位）
- 苹果信号量 → apple = 0
- 橘子信号量 → orange = 0

```c
semaphore plate = 1;   // 盘子空位
semaphore apple = 0;   // 有苹果？
semaphore orange = 0;  // 有橘子？

Father() {
    while (1) {
        拿一个苹果;
        P(plate);        // 等盘子空
        放苹果;
        V(apple);        // 通知"有苹果了"
    }
}

Mother() {
    while (1) {
        拿一个橘子;
        P(plate);
        放橘子;
        V(orange);       // 通知"有橘子了"
    }
}

Son() {
    while (1) {
        P(apple);        // 等苹果
        从盘子取苹果;
        V(plate);        // 盘子空了
        吃苹果;
    }
}

Daughter() {
    while (1) {
        P(orange);       // 等橘子
        从盘子取橘子;
        V(plate);
        吃橘子;
    }
}
```

> **验证**：
> - 父亲放苹果后 V(apple) → 儿子才能 P(apple)
> - 儿子取走苹果后 V(plate) → 父亲/母亲才能 P(plate)
> - 四个进程不会死锁 ✓

---

> **PV题得分要点**
> 1. **信号量声明+初值**必须写清楚（有分）
> 2. **P操作的顺序**是关键（先同步后互斥）
> 3. **V操作的顺序**相对灵活，但一般为先互斥后同步
> 4. 代码中要体现**循环**（while(1)）
> 5. 注释标注每步的作用
