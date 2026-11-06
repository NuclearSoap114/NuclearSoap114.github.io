---
public: true
title: "郊区春游：Floyd 与状态压缩 DP"
series: "2026 暑假集训"
subject: "算法与竞赛"
section: "题解"
slug: "summer/algorithms/solutions/郊区春游-floyd-与状态压缩-dp"
order: 27
---

[牛客](https://ac.nowcoder.com/acm/contest/28259/C)
<div id="section-1" class="note-anchor"></div>

## 郊区春游——Floyd + 状压 DP 枚举访问顺序

> **存放建议  **
> **等级：** B 类·进阶模型题  
> **CF 等效评分：** 约 1600～1700（估计）  
> **理由：** 不仅需要状压 DP 枚举关键点访问顺序，还需要先用最短路消除原图路径细节，并正确处理关键点下标与原图节点编号的映射。

<div id="section-2" class="note-anchor"></div>

## 抽象题目

给定一个带正权的无向图和其中的 $r$ 个关键点，需要选择一个访问这 $r$ 个关键点的顺序。

起点可以是任意关键点，终点也可以是任意关键点，只计算相邻两个关键点之间的最短路费用，求最小总费用。

<div id="section-3" class="note-anchor"></div>

## 一句话本质

在原图上先求出关键点两两之间的最短距离，再求一条经过全部关键点、起点和终点均任意的最短访问顺序。

<div id="section-4" class="note-anchor"></div>

## 本题学到的具体东西

<div id="section-5" class="note-anchor"></div>

### 1. 用 lowbit 只枚举集合中实际存在的元素

对于一个二进制集合 `tmp`：

```cpp
int lowbit = tmp & -tmp;
int from = __builtin_ctzll(lowbit);
tmp ^= lowbit;
```

其中：

- `tmp & -tmp` 取出最低位的一个 `1`；
    
- `__builtin_ctzll(lowbit)` 得到这一位的位置编号；
    
- `tmp ^= lowbit` 删除已经枚举的这一位。
    

例如：

```text
tmp = 101100
```

第一次取出：

```text
lowbit = 000100
from = 2
```

删除后：

```text
tmp = 101000
```

这样能够只枚举集合中为 `1` 的位置，不需要每次循环检查所有 $r$ 位。

适用信号：

> 当前状态是一个集合，转移时需要枚举集合中已经存在的元素。

注意：`lowbit` 枚举的是集合中的每个元素，不是枚举集合的所有子集。

---

<div id="section-6" class="note-anchor"></div>

### 2. 把“怎么走”和“按什么顺序走”拆开

原问题同时包含两个问题：

1. 从一个关键点到另一个关键点怎么走最便宜；
    
2. 这些关键点按照什么顺序访问最便宜。
    

先用 Floyd 求出：

```cpp
dist[u][v]
```

表示原图中节点 `u` 到节点 `v` 的最短距离。

之后状压 DP 不再关心中间经过哪些普通节点，只使用：

```cpp
dist[plan[from]][plan[to]]
```

作为两个关键点之间的移动代价。

这个处理把复杂的图压缩成了一个只有 $r$ 个关键点的完全图。

适用信号：

> 原图较大，但真正需要决定访问顺序的特殊点只有十几个。

---

<div id="section-7" class="note-anchor"></div>

### 3. 区分压缩下标和原图编号

假设：

```cpp
plan[0] = 8;
plan[1] = 20;
```

那么：

- `0、1` 是关键点在 `plan` 中的压缩下标；
    
- `8、20` 是它们在原图中的真实编号。
    

因此：

```cpp
dp[mask][last]
```

中的 `last` 必须是压缩下标，范围是 `0～r-1`。

而查询原图最短距离时，必须写：

```cpp
dist[plan[from]][plan[to]]
```

正确转移是：

```cpp
dp[now][to] = min(dp[now][to],
    dp[pre][from] + dist[plan[from]][plan[to]]);
```

不能写成：

```cpp
dp[pre][plan[from]]
```

因为 `dp` 的第二维只开到了 `r`，原图节点编号可能达到 `n`，这样既破坏状态含义，也可能数组越界。

<div id="section-8" class="note-anchor"></div>

## 从朴素思路到关键转折

<div id="section-9" class="note-anchor"></div>

### 1. 朴素方法

最直接的方法是枚举 $r$ 个关键点的所有访问顺序。

访问顺序数量为：


$$
r!
$$


当 $r=15$ 时，$15!$ 已经无法计算。

<div id="section-10" class="note-anchor"></div>

### 2. 发现重复子问题

考虑两个不同的访问过程：

- 它们已经访问的关键点集合相同；
    
- 当前最后停留的关键点也相同。
    

那么后续尚未访问的点完全相同，当前所在位置也相同。

之前具体按照什么顺序到达这里，已经不会影响后面的最优选择，只需要保留其中费用最小的方案。

因此可以把大量排列合并为：

```cpp
dp[mask][last]
```

其中：

- `mask` 记录已经访问了哪些关键点；
    
- `last` 记录当前最后位于哪个关键点。
    

这就把复杂度从阶乘级降低到了指数级。

<div id="section-11" class="note-anchor"></div>

## 核心推导

<div id="section-12" class="note-anchor"></div>

### 1. 预处理原图最短路

定义：

```cpp
dist[u][v]
```

表示原图节点 `u` 到节点 `v` 的最短距离。

初始化：

```cpp
dist[i][i] = 0;
```

道路直接连接的两个点使用边权，其余位置初始化为 `inf`。

之后通过 Floyd：

```cpp
dist[i][j] = min(dist[i][j],dist[i][k] + dist[k][j]);
```

得到任意两点之间的最短距离。

这一步的目的是让后面的 DP 只处理关键点的访问顺序，不再重复计算原图路径。

<div id="section-13" class="note-anchor"></div>

### 2. 定义状压 DP 状态

定义：

```cpp
dp[mask][last]
```

表示：

> 已经访问了 `mask` 中的全部关键点，并且最后停在第 `last` 个关键点时的最小费用。

`mask` 的第 $i$ 位为 `1`，表示 `plan[i]` 已经访问。

例如：

```text
mask = 10110
```

表示已经访问了编号为 `1、2、4` 的三个关键点。

<div id="section-14" class="note-anchor"></div>

### 3. 初始化单点状态

任意关键点都可以作为第一个访问的位置。

题目不计算从学校前往第一个关键点的费用，因此：

```cpp
dp[1 << i][i] = 0;
```

这里第二维必须是 `i`，因为只访问第 `i` 个关键点时，最后位置也是第 `i` 个关键点。

不能写成：

```cpp
dp[1 << i][r] = 0;
```

`r` 是关键点数量，不是最后位置；当 `r=15` 时还会访问越界的 `dp[][15]`。

<div id="section-15" class="note-anchor"></div>

### 4. 枚举最后访问的关键点

假设当前状态为：

```cpp
dp[now][to]
```

并认为 `to` 是最后访问的关键点。

那么删除 `to` 后的集合为：

```cpp
int pre = now ^ (1 << to);
```

接着枚举 `pre` 中最后停留的关键点 `from`。

从前驱状态转移：

```cpp
dp[now][to] = min(dp[now][to],
    dp[pre][from] + dist[plan[from]][plan[to]]);
```

含义是：

1. 先访问完 `pre` 中的全部关键点；
    
2. 最后停在 `from`；
    
3. 再从 `plan[from]` 移动到 `plan[to]`。
    

<div id="section-16" class="note-anchor"></div>

### 5. 统计最终答案

全部关键点访问完成时：

```cpp
full = (1 << r) - 1;
```

最后一个访问的关键点可以是任意点，因为从最后一个关键点回学校的费用也不计算。

因此：

```cpp
ans = min(dp[full][last]);
```

枚举所有 `last` 取最小值。

<div id="section-17" class="note-anchor"></div>

## 为什么正确

任意一个合法访问方案都对应一个关键点排列。

考虑这个排列中的最后一个关键点 `to`。删除 `to` 后，前面访问的关键点构成集合 `pre`，并且一定存在一个倒数第二个关键点 `from`。

因此，这个方案一定会被以下转移覆盖：

```cpp
dp[pre][from] + dist[plan[from]][plan[to]]
```

转移枚举了：

- 所有访问集合 `now`；
    
- 所有可能的最后位置 `to`；
    
- 所有可能的前驱位置 `from`。
    

所以不会遗漏任何合法访问顺序。

当访问集合和最后位置相同时，后续决策只与：

- 哪些关键点尚未访问；
    
- 当前位于哪个关键点；
    

有关，不再需要之前的完整访问顺序。

因此每个状态只保存最小费用不会丢失最优解。

Floyd 求出的 `dist[u][v]` 是两点之间的最小可能费用，所以在固定访问顺序下，每一段都选择最短路一定不会比其他走法更差。

综上，DP 得到的就是所有访问顺序中的最小总费用。

<div id="section-18" class="note-anchor"></div>

## 复杂度

Floyd 使用三重循环：


$$
O(n^3)
$$


状压 DP 共有 $2^r$ 个集合状态，每个状态最多枚举：

- $r$ 个结束位置；
    
- $r$ 个前驱位置。
    

因此时间复杂度为：


$$
O(n^3+2^r r^2)
$$


空间复杂度为：


$$
O(n^2+2^r r)
$$


其中：

- `dist` 占用 $O(n^2)$；
    
- `dp` 占用 $O(2^r r)$。
    

`lowbit` 不改变最坏情况下的渐进复杂度，但能只枚举集合中实际存在的元素，减少无效判断。

<div id="section-19" class="note-anchor"></div>

## 识别信号

当题目出现以下结构时，可以考虑“最短路预处理 + 状压 DP”：

- 原图中有很多普通节点，但只有少量关键点必须访问；
    
- 关键点数量大约不超过 $15～20$；
    
- 需要决定关键点的访问顺序；
    
- 两个关键点之间允许经过任意普通节点；
    
- 一个部分方案对后续的影响只取决于“已访问集合”和“最后位置”；
    
- 起点或终点可以任意选择；
    
- 直接枚举排列是 $r!$，但相同集合和末尾位置会产生重复子问题。
    

<div id="section-20" class="note-anchor"></div>

## 适用边界

<div id="section-21" class="note-anchor"></div>

### 1. 关键点数量必须较少

当前方法需要枚举 $2^r$ 个集合。

如果 $r$ 增加到几十甚至上百，状压 DP 无法继续使用，需要寻找其他性质或近似算法。

<div id="section-22" class="note-anchor"></div>

### 2. Floyd 依赖原图点数较小

本题 $n$ 较小，可以使用 $O(n^3)$ 的 Floyd。

如果 $n$ 达到 $2\times10^5$，不能再使用 Floyd。正权图中可以从每个关键点分别运行一次 Dijkstra。

<div id="section-23" class="note-anchor"></div>

### 3. 起点固定时初始化会改变

如果题目要求必须从第 `s` 个关键点开始，不能把所有单点状态都初始化为 `0`，只能初始化：

```cpp
dp[1 << s][s] = 0;
```

<div id="section-24" class="note-anchor"></div>

### 4. 必须回到起点时答案会改变

当前题目不计算最后返回学校的费用。

如果要求最终回到固定起点，则需要计算：

```cpp
dp[full][last] + dist[plan[last]][start]
```

再对所有 `last` 取最小值。

<div id="section-25" class="note-anchor"></div>

### 5. 路径若受到额外限制，不能直接压缩

当前方法默认两个关键点之间可以沿原图任意行走。

如果题目要求途中不能经过某些节点，或者经过其他关键点会立即产生影响，那么普通的两点最短距离可能无法完整表示转移代价。

<div id="section-26" class="note-anchor"></div>

## 本题暴露的问题

<div id="section-27" class="note-anchor"></div>

### 1. 状态第二维含义没有保持一致

曾写成：

```cpp
dp[1 << i][r] = 0;
```

但 `dp` 的第二维表示最后停留的关键点下标，因此这里必须是：

```cpp
dp[1 << i][i] = 0;
```

这说明写初始化时，需要重新代入一次完整状态含义，而不能只根据数组形式填写下标。

<div id="section-28" class="note-anchor"></div>

### 2. 混用了压缩下标和原图编号

曾写成：

```cpp
dp[pre][plan[from]] + dist[from][plan[to]]
```

这里两部分都混用了编号：

- `dp` 应使用压缩下标 `from`；
    
- `dist` 应使用原图编号 `plan[from]`。
    

正确写法是：

```cpp
dp[pre][from] + dist[plan[from]][plan[to]]
```

以后出现映射数组时，应先明确写下：

```text
dp 使用压缩下标
dist 使用原图编号
```

<div id="section-29" class="note-anchor"></div>

### 3. Floyd 初始化遗漏自己到自己的距离

如果把所有 `dist[i][j]` 都初始化为 `inf`，那么 `dist[i][i]` 也会错误地成为不可达。

标准初始化应为：

```cpp
dist[i][j] = (i == j ? 0 : inf);
```

<div id="section-30" class="note-anchor"></div>

### 4. 最初没有完全按照题面顺序读入

本题在 `n,m,r` 后先给出关键点，再给出道路。

输入结构特殊时，需要先逐行确认题面，而不是根据常见图论输入习惯默认先读取边。

<div id="section-31" class="note-anchor"></div>

## 实现时最容易错的地方

- 输入顺序是先读 `plan`，再读 $m$ 条道路；
    
- Floyd 必须初始化 `dist[i][i] = 0`；
    
- 无向边要同时更新两个方向；
    
- 若存在重边，应保留最小边权；
    
- 单点状态是 `dp[1 << i][i] = 0`；
    
- `dp` 第二维使用关键点下标，不是原图编号；
    
- 原图距离必须访问 `dist[plan[from]][plan[to]]`；
    
- 只有当 `to` 位于 `now` 中时，才能把它作为最后访问点；
    
- `__builtin_ctzll` 不能传入 `0`，所以必须放在 `while(tmp)` 中；
    
- 最终答案要枚举所有结束位置，不能只取某个固定 `last`；
    
- 状态不可达时不要参与加法转移。
    

<div id="section-32" class="note-anchor"></div>

## 复习时反问

1. 为什么两个方案的访问集合和最后位置相同时，可以丢弃之前的具体访问顺序？
    
2. 为什么 `dp` 使用 `from`，而查询距离必须使用 `plan[from]`？
    
3. 如果起点固定并且最终必须回到起点，初始化和答案分别应该怎样修改？
    
4. `lowbit = tmp & -tmp` 为什么能够取出最低位的一个 `1`？
    

<div id="section-33" class="note-anchor"></div>

## 完整代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define rep(i,l,r) for(int i=(l);i<=(r);i++)
const int inf = 1e18,N = 200 + 10;

int T,n,m,r;
int dist[N][N],dp[1 << 15][15];

void O_o(){
    cin >> n >> m >> r;

    vector<int> plan(r);
    for(int &x : plan)cin >> x;

    rep(i,1,n){
        rep(j,1,n){
            dist[i][j] = (i == j ? 0 : inf);
        }
    }

    rep(i,1,m){
        int u,v,w;
        cin >> u >> v >> w;
        dist[u][v] = min(dist[u][v],w);
        dist[v][u] = min(dist[v][u],w);
    }

    rep(k,1,n){
        rep(i,1,n){
            rep(j,1,n){
                if(dist[i][k] == inf || dist[k][j] == inf)continue;
                dist[i][j] = min(dist[i][j],dist[i][k] + dist[k][j]);
            }
        }
    }

    rep(mask,0,(1 << r) - 1){
        rep(last,0,r - 1){
            dp[mask][last] = inf;
        }
    }

    // 第一个关键点之前的路费不计算
    rep(i,0,r - 1)dp[1 << i][i] = 0;

    rep(now,1,(1 << r) - 1){
        rep(to,0,r - 1){
            if(!(now & (1 << to)))continue;

            int pre = now ^ (1 << to);
            if(pre == 0)continue;

            int tmp = pre;
            while(tmp){
                int lowbit = tmp & -tmp;
                int from = __builtin_ctzll(lowbit);

                // dp 使用关键点下标，dist 使用原图节点编号
                if(dp[pre][from] != inf){
                    dp[now][to] = min(dp[now][to],
                        dp[pre][from] + dist[plan[from]][plan[to]]);
                }

                tmp ^= lowbit;
            }
        }
    }

    int full = (1 << r) - 1;
    int ans = inf;

    rep(last,0,r - 1){
        ans = min(ans,dp[full][last]);
    }

    cout << ans << '\n';
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    T = 1;
    while(T--)O_o();

    return 0;
}
```
