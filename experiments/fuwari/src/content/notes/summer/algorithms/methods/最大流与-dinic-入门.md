---
public: true
title: "最大流与 Dinic 入门"
series: "2026 暑假集训"
subject: "算法与竞赛"
section: "算法"
slug: "summer/algorithms/methods/最大流与-dinic-入门"
order: 35
---

> **专题定位  **
> **阶段：** 网络流入门  
> **核心算法：** Dinic 最大流  
> **现阶段目标：** 理解残量网络、反向边、分层图和当前弧优化；能独立写 Dinic；能完成二分图容量匹配、不相交路径、拆点、超级源汇等基础建模。  
> **暂不学习：** 最小费用最大流、上下界网络流、循环流、ISAP、HLPP、Push-Relabel、Gomory-Hu Tree。

---

<div id="section-1" class="note-anchor"></div>

## 抽象问题

给定一张有向图，每条边都有一个非负容量。流量从源点 $S$ 出发，经过图中的边到达汇点 $T$。

需要满足：

1. 每条边上的流量不能超过该边容量；
2. 除 $S,T$ 外，每个点流入多少，就必须流出多少；
3. 目标是让从 $S$ 到 $T$ 的总流量最大。

---

<div id="section-2" class="note-anchor"></div>

## 一句话本质

网络流是在一张带容量的图上，反复寻找还能增加流量的路径，并用反向边保留“撤销旧选择、重新分配流量”的能力。

---

<div id="section-3" class="note-anchor"></div>

## 一、本专题学到的具体东西

<div id="section-4" class="note-anchor"></div>

### 1. 反向边表示撤销旧流量

添加原边：

```text
u -> v，容量为 c
```

程序中实际加入：

```text
u -> v，剩余容量为 c
v -> u，剩余容量为 0
```

若从 $u$ 向 $v$ 推送 $x$ 单位流量：


$$
cap(u,v)\mathrel{-}=x
$$



$$
cap(v,u)\mathrel{+}=x
$$


正向边减少，表示继续向前能发送的量变少；反向边增加，表示以后最多可以撤销之前发送的 $x$ 单位流量。

反向边不是“水真的倒流”，而是算法的后悔机制。

---

<div id="section-5" class="note-anchor"></div>

### 2. BFS 和 DFS 分工不同

BFS 只负责分层：

```text
level[v] = v 在当前残量网络中距离 S 的最短边数
```

DFS 才真正推送流量，并且只允许走：


$$
level[v]=level[u]+1
$$


因此可以记成：

```text
BFS：规定本轮允许走哪些边
DFS：在这些边上尽可能推流
```

---

<div id="section-6" class="note-anchor"></div>

### 3. 建模时必须解释“一单位流量代表什么”

例如二分图匹配：

```text
S -> 人 -> 工作 -> T
```

一单位流量沿：

```text
S -> 人 i -> 工作 j -> T
```

表示把第 $i$ 个人分配给第 $j$ 个工作。

网络流建模时必须说清楚：

1. 点代表什么；
2. 边代表什么允许关系；
3. 容量代表什么上限；
4. 一单位流量代表原题中的什么选择；
5. 为什么合法流和合法方案能够互相对应。

---

<div id="section-7" class="note-anchor"></div>

## 二、基本概念

<div id="section-8" class="note-anchor"></div>

### 1. 源点与汇点

- 源点 $S$：流量从这里出发；
- 汇点 $T$：流量最终到达这里。

<div id="section-9" class="note-anchor"></div>

### 2. 容量限制

设边 $(u,v)$ 的容量为 $c(u,v)$，实际流量为 $f(u,v)$，必须满足：


$$
0\le f(u,v)\le c(u,v)
$$


<div id="section-10" class="note-anchor"></div>

### 3. 流量守恒

除 $S,T$ 外，每个普通点都满足：


$$
\text{流入量}=\text{流出量}
$$


<div id="section-11" class="note-anchor"></div>

### 4. 最大流的值

从 $S$ 流出的总流量，等于流入 $T$ 的总流量。目标是最大化它。

---

<div id="section-12" class="note-anchor"></div>

## 三、剩余容量与残量网络

假设：

```text
u --7--> v
```

当前已经发送 $4$ 单位流量，则：


$$
\text{正向剩余容量}=7-4=3
$$



$$
\text{反向剩余容量}=4
$$


残量网络只保留当前剩余容量大于 $0$ 的边。Dinic 的 BFS 和 DFS 都是在残量网络上运行。

---

<div id="section-13" class="note-anchor"></div>

## 四、为什么必须有反向边

所有边容量均为 $1$：

```text
S -> A
S -> B
A -> B
A -> T
B -> T
```

如果第一次选了：

```text
S -> A -> B -> T
```

此时看正向边，好像无法再找到第二条路。

但推流后会产生反向残量边：

```text
B -> A
```

于是可以沿：

```text
S -> B -> A -> T
```

调整旧方案，最终得到：

```text
S -> A -> T
S -> B -> T
```

最大流为 $2$。

没有反向边，算法可能被早期错误选择永久卡住。

---

<div id="section-14" class="note-anchor"></div>

## 五、增广路

在残量网络中，如果存在：

```text
S -> ... -> T
```

且路径上每条边剩余容量都大于 $0$，这条路径叫增广路。

例如：

```text
S --5--> A --3--> B --7--> T
```

该路径最多增加：


$$
\min(5,3,7)=3
$$


这个最小值叫瓶颈容量。

---

<div id="section-15" class="note-anchor"></div>

## 六、为什么没有增广路时就是最大流

当最终残量网络中 $S$ 无法到达 $T$ 时，从 $S$ 出发可达的点构成集合 $A$，不可达的点构成集合 $B$。

所有从 $A$ 指向 $B$ 的原边都已经满流，它们组成一个割。当前流量等于这个割的容量，而任何流都不可能超过任意割的容量，因此当前流就是最大流。

入门阶段先记结论：

> 残量网络中不存在从 $S$ 到 $T$ 的路径时，当前流就是最大流。

---

<div id="section-16" class="note-anchor"></div>

## 七、Dinic 的关键转折

朴素做法是每次随便找一条增广路，但可能反复走很差的路径。

Dinic 每轮做两件事：

1. BFS 构造层次图；
2. DFS 在层次图上尽可能推满，得到阻塞流。

当前层次图推不动后，再重新 BFS。

一般复杂度为：


$$
O(V^2E)
$$


现阶段不需要证明，只需要理解它比“随便找一条路”更有组织。

---

<div id="section-17" class="note-anchor"></div>

## 八、BFS 构造层次图

初始化：

```cpp
level[s] = 0;
```

若残量边 `u -> v` 满足：

```cpp
e.cap > 0
```

并且 `v` 未访问，则：

```cpp
level[v] = level[u] + 1;
```

DFS 只允许走：


$$
level[v]=level[u]+1
$$


如果 BFS 后：

```cpp
level[t] == -1
```

说明不存在增广路，算法结束。

---

<div id="section-18" class="note-anchor"></div>

## 九、DFS 推流

定义：

```cpp
dfs(u,t,f)
```

表示在当前层次图中，从 $u$ 出发，最多尝试向 $t$ 推送 $f$ 单位流量。

到达汇点：

```cpp
if(u == t)return f;
```

一条边可以使用，需要同时满足：

```cpp
e.cap > 0
level[e.to] == level[u] + 1
```

继续递归时最多能送：


$$
\min(f,e.cap)
$$


推流成功后：

```cpp
e.cap -= pushed;
g[e.to][e.rev].cap += pushed;
```

---

<div id="section-19" class="note-anchor"></div>

## 十、什么是阻塞流

一次 BFS 后，不是只 DFS 一次，而是反复 DFS：

```cpp
while(long long pushed=dfs(s,t,INF)){
    flow += pushed;
}
```

直到返回 $0$。

此时当前层次图中已经没有完整的 $S\to T$ 可用路径，这一轮推到的流叫阻塞流。

---

<div id="section-20" class="note-anchor"></div>

## 十一、当前弧优化

假设点 $u$ 有很多出边，前几条边已经检查过并且无法继续推流。下一次再到 $u$ 时，没有必要从头枚举。

维护：

```cpp
cur[u]
```

表示本轮 BFS 中，点 $u$ 下一次从哪条边开始检查。

常用写法：

```cpp
for(int &i=cur[u];i<(int)g[u].size();i++)
```

`i` 使用引用，所以检查失败后会永久向后移动。

每次重新 BFS 后都必须：

```cpp
fill(cur.begin(),cur.end(),0);
```

---

<div id="section-21" class="note-anchor"></div>

## 十二、手动模拟 Dinic

图：

```text
S -> A，容量 3
S -> B，容量 2
A -> B，容量 1
A -> T，容量 2
B -> T，容量 3
```

第一轮 BFS：

```text
level[S] = 0
level[A] = 1
level[B] = 1
level[T] = 2
```

本轮可以走：

```text
S -> A -> T，推 2
S -> B -> T，推 2
```

总流量变成 $4$。

第二轮 BFS 后：

```text
S -> A -> B -> T
```

仍可再推 $1$。

最终最大流：


$$
4+1=5
$$


这说明一次 BFS 只负责当前最短层次结构，不保证直接完成全部最大流。

---

<div id="section-22" class="note-anchor"></div>

## 十三、Dinic 完整顺序

```text
1. 建立正向边与反向边
2. BFS 构造层次图
3. 若 T 不可达，结束
4. cur 全部清零
5. 反复 DFS 推流，直到本轮推不动
6. 回到第 2 步
```

---

<div id="section-23" class="note-anchor"></div>

## 十四、代码变量含义

<div id="section-24" class="note-anchor"></div>

### `g[u]`

保存从点 $u$ 出发的所有残量边。

<div id="section-25" class="note-anchor"></div>

### `Edge::to`

边的终点。

<div id="section-26" class="note-anchor"></div>

### `Edge::cap`

当前剩余容量，不是原始容量。

<div id="section-27" class="note-anchor"></div>

### `Edge::rev`

对应反向边在 `g[to]` 中的下标。

<div id="section-28" class="note-anchor"></div>

### `level[u]`

本轮 BFS 中点 $u$ 的层数。

<div id="section-29" class="note-anchor"></div>

### `cur[u]`

本轮 BFS 中点 $u$ 下一次开始枚举的边下标。

<div id="section-30" class="note-anchor"></div>

### `dfs(u,t,f)` 返回值

本次调用实际成功推送的流量。

---

<div id="section-31" class="note-anchor"></div>

## 十五、基础建模

<div id="section-32" class="note-anchor"></div>

### 模型 1：直接最大流

题目直接给点、边、容量、源点和汇点，直接建图。

---

<div id="section-33" class="note-anchor"></div>

### 模型 2：二分图最大匹配

```text
S -> 左部点，容量 1
左部点 -> 右部点，容量 1
右部点 -> T，容量 1
```

一单位流量表示选择一对匹配。

---

<div id="section-34" class="note-anchor"></div>

### 模型 3：带容量的分配

例如每个学生最多选一门课，每门课最多接收 $c_j$ 人：

```text
S -> 学生 i，容量 1
学生 i -> 可选课程 j，容量 1
课程 j -> T，容量 c_j
```

若学生 $i$ 最多可选 $k_i$ 门，把源点到学生的容量改成 $k_i$。

---

<div id="section-35" class="note-anchor"></div>

### 模型 4：边不相交路径

原图每条边容量设为 $1$。

一条边最多通过一单位流量，因此最多被一条路径使用。最大流就是最多边不相交路径数。

---

<div id="section-36" class="note-anchor"></div>

### 模型 5：点不相交路径与拆点

把点 $u$ 拆成：

```text
u_in -> u_out
```

中间边容量设为 $1$。

所有原本进入 $u$ 的边连到 `u_in`，所有原本离开 $u$ 的边从 `u_out` 出发。

如果一个点最多能使用 $c_u$ 次，中间边容量设为 $c_u$。

---

<div id="section-37" class="note-anchor"></div>

### 模型 6：超级源点和超级汇点

多个起点时，新建超级源点 $S$：

```text
S -> s1
S -> s2
...
```

多个终点时，新建超级汇点 $T$：

```text
t1 -> T
t2 -> T
...
```

这样转化为普通单源单汇最大流。

---

<div id="section-38" class="note-anchor"></div>

## 十六、最小割现阶段学到什么程度

最小割表示删除一些边，使 $S$ 无法到达 $T$，并最小化删除边容量之和。


$$
\text{最大流}=\text{最小割容量}
$$


求完最大流后，在最终残量网络中从 $S$ 出发：

- 能到达的点属于集合 $A$；
- 不能到达的点属于集合 $B$。

原图中所有从 $A$ 指向 $B$ 的边组成一组最小割。

现阶段只做：

- 最小代价切断 $S,T$；
- 简单二选一代价模型。

---

<div id="section-39" class="note-anchor"></div>

## 十七、识别信号

当题目出现以下结构时，可以考虑网络流：

- 求最多完成多少次分配；
- 每个对象有使用次数上限；
- 左边对象与右边对象配对；
- 某种资源只能使用若干次；
- 求最多多少条互不冲突的路径；
- 边或点不能被多条路径重复使用；
- 多个位置提供资源，多个位置接收资源；
- 求切断两个区域的最小代价。

但不要只因为题目问“最大值”就套网络流。

---

<div id="section-40" class="note-anchor"></div>

## 十八、为什么正确

<div id="section-41" class="note-anchor"></div>

### 1. 容量合法

DFS 推送量不会超过当前剩余容量。

<div id="section-42" class="note-anchor"></div>

### 2. 流量守恒

增广路径上的每个中间点流入多少，就流出多少。

<div id="section-43" class="note-anchor"></div>

### 3. 反向边允许调整旧方案

之前推送 $x$ 后，反向边增加 $x$，所以旧选择可以被部分或全部撤销。

<div id="section-44" class="note-anchor"></div>

### 4. BFS 没有漏掉当前最短增广路

所有最短增广路都逐层前进，因此包含在层次图中。

<div id="section-45" class="note-anchor"></div>

### 5. 终止时最优

BFS 无法到达 $T$ 时，残量网络不存在增广路，根据最大流最小割定理，当前流就是最大流。

---

<div id="section-46" class="note-anchor"></div>

## 十九、复杂度

一般 Dinic：


$$
O(V^2E)
$$


空间复杂度：


$$
O(V+E)
$$


实际比赛中仍需结合点数、边数和图结构判断是否可用。

---

<div id="section-47" class="note-anchor"></div>

## 二十、现阶段不要学什么

暂时跳过：

1. 最小费用最大流；
2. 上下界网络流；
3. 有源汇上下界可行流；
4. 无源汇循环流；
5. ISAP；
6. HLPP；
7. Push-Relabel；
8. Gomory-Hu Tree；
9. 复杂最大权闭合子图；
10. 复杂网格割模型。

当前学习终点：

```text
普通最大流
-> 二分图容量匹配
-> 不相交路径
-> 拆点
-> 超级源汇
-> 基础最小割
```

---

<div id="section-48" class="note-anchor"></div>

## 二十一、本专题暴露的重点问题

网络流初学时，真正要先建立的三个认识：

1. `cap` 存的是当前剩余容量；
2. 反向边是撤销旧流量的工具；
3. 建模时必须解释一单位流量代表什么。

如果这三点不清楚，就容易出现：

- 模板会写但不知道为什么；
- 边方向写反；
- 容量不知道设为 $1$、次数还是 `INF`；
- 遇到变形题不会建图。

---

<div id="section-49" class="note-anchor"></div>

## 二十二、实现时最容易错的地方

<div id="section-50" class="note-anchor"></div>

### 1. 反向边下标

```cpp
Edge a{v,(int)g[v].size(),cap};
Edge b{u,(int)g[u].size(),0};
```

两条边的 `rev` 分别指向对方即将插入的位置。

<div id="section-51" class="note-anchor"></div>

### 2. DFS 中使用引用

正确：

```cpp
Edge &e = g[u][i];
```

不能复制边后再修改。

<div id="section-52" class="note-anchor"></div>

### 3. BFS 只走剩余容量大于 $0$ 的边

```cpp
if(e.cap == 0)continue;
```

<div id="section-53" class="note-anchor"></div>

### 4. 每轮 BFS 后重置 `cur`

```cpp
fill(cur.begin(),cur.end(),0);
```

<div id="section-54" class="note-anchor"></div>

### 5. `addEdge` 添加的是有向边

```cpp
addEdge(u,v,c);
```

表示原边 $u\to v$ 容量为 $c$，反向残量边初始容量为 $0$。

若原题允许两个方向独立流动，需要分别添加两条原边。

<div id="section-55" class="note-anchor"></div>

### 6. 容量与答案使用 `long long`

<div id="section-56" class="note-anchor"></div>

### 7. 多组数据重新建图

---

<div id="section-57" class="note-anchor"></div>

## 二十三、推荐学习顺序

<div id="section-58" class="note-anchor"></div>

### 第 1 步：手算残量网络

```text
找增广路
-> 求瓶颈
-> 正向减
-> 反向加
```

<div id="section-59" class="note-anchor"></div>

### 第 2 步：理解变量

```text
g、cap、rev、level、cur
```

<div id="section-60" class="note-anchor"></div>

### 第 3 步：普通最大流模板题

只练直接建图求最大流。

<div id="section-61" class="note-anchor"></div>

### 第 4 步：二分图容量匹配

练习人和任务、学生和课程、机器和工件。

<div id="section-62" class="note-anchor"></div>

### 第 5 步：不相交路径与拆点

记住：

```text
限制边 -> 给边容量
限制点 -> 拆成容量边
```

<div id="section-63" class="note-anchor"></div>

### 第 6 步：基础最小割

只学习最小代价断开 $S,T$。

---

<div id="section-64" class="note-anchor"></div>

## 二十四、复习时反问

1. 为什么推送 $x$ 单位流量后，反向边容量必须增加 $x$？
2. BFS 和 DFS 在 Dinic 中分别负责什么？
3. 为什么 `cur[u]` 只在一轮 BFS 中有效？
4. 二分图匹配中，一单位流量对应什么？
5. 为什么限制点使用次数时需要拆点？
6. Dinic 结束后如何从残量网络恢复一组最小割？

---

<div id="section-65" class="note-anchor"></div>

## 完整代码

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;

const ll INF = 1LL << 62;

// --------------- Dinic 最大流 ---------------
struct Dinic{
    // --------------- 边的定义 ---------------
    struct Edge{
        int to;
        int rev;
        ll cap;
    };

    int n;
    vector<vector<Edge>> g;
    vector<int> level;
    vector<int> cur;

    // --------------- 初始化 ---------------
    Dinic(int n){
        this->n = n;
        g.resize(n + 1);
        level.resize(n + 1);
        cur.resize(n + 1);
    }

    // --------------- 添加有向边 ---------------
    void addEdge(int u,int v,ll cap){
        Edge a{v,(int)g[v].size(),cap};
        Edge b{u,(int)g[u].size(),0};

        g[u].push_back(a);
        g[v].push_back(b);
    }

    // --------------- BFS 构造层次图 ---------------
    bool bfs(int s,int t){
        fill(level.begin(),level.end(),-1);

        queue<int> q;
        level[s] = 0;
        q.push(s);

        while(!q.empty()){
            int u = q.front();
            q.pop();

            for(const Edge &e : g[u]){
                if(e.cap == 0)continue;
                if(level[e.to] != -1)continue;

                level[e.to] = level[u] + 1;
                q.push(e.to);
            }
        }

        return level[t] != -1;
    }

    // --------------- DFS 在层次图中推流 ---------------
    ll dfs(int u,int t,ll flow){
        if(u == t)return flow;

        for(int &i=cur[u];i<(int)g[u].size();i++){
            Edge &e = g[u][i];

            if(e.cap == 0)continue;
            if(level[e.to] != level[u] + 1)continue;

            ll pushed = dfs(e.to,t,min(flow,e.cap));

            if(pushed == 0)continue;

            e.cap -= pushed;
            g[e.to][e.rev].cap += pushed;

            return pushed;
        }

        return 0;
    }

    // --------------- 计算最大流 ---------------
    ll maxflow(int s,int t){
        ll ans = 0;

        while(bfs(s,t)){
            fill(cur.begin(),cur.end(),0);

            while(true){
                ll pushed = dfs(s,t,INF);

                if(pushed == 0)break;

                ans += pushed;
            }
        }

        return ans;
    }
};

// --------------- 解决一组数据 ---------------
void O_o(){
    int n,m,s,t;
    cin >> n >> m >> s >> t;

    Dinic flow(n);

    for(int i=1;i<=m;i++){
        int u,v;
        ll cap;
        cin >> u >> v >> cap;

        flow.addEdge(u,v,cap);
    }

    cout << flow.maxflow(s,t) << '\n';
}

// --------------- 主函数 ---------------
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    O_o();

    return 0;
}
```

---

<div id="section-66" class="note-anchor"></div>

## 代码执行过程对照

```text
addEdge
    建立正向剩余边和反向剩余边

bfs
    在当前残量网络中分层

dfs
    只沿下一层边推流
    正向剩余容量减少
    反向剩余容量增加

maxflow
    一轮 BFS
    多次 DFS 推出阻塞流
    重复直到 T 不可达
```

---

<div id="section-67" class="note-anchor"></div>

## 参考资料

- OI-Wiki：网络流与最大流
- cp-algorithms：Maximum flow - Dinic's algorithm
- MIT 6.854：Flow computation notes
- Princeton COS 226：Maximum flow
- AtCoder Library：Maxflow
