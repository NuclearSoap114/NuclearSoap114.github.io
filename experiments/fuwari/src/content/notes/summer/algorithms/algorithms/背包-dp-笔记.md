---
title: "背包 DP 笔记"
series: "2026 暑假集训"
subject: "算法与竞赛"
section: "算法"
slug: "summer/algorithms/algorithms/背包-dp-笔记"
order: 12
---

<div id="section-1" class="note-anchor"></div>

### 一、背包 DP 在解决什么问题

背包问题通常有以下特征：

- 有若干个物品；
- 每个物品有重量、价值或使用次数；
- 有一个容量或目标总和；
- 需要求最大价值、最小代价、可行性或方案数。

背包最重要的两个问题：

1. `dp[j]` 到底表示什么？
2. 内层容量应该正序还是倒序？

---

<div id="section-2" class="note-anchor"></div>

## 二、常见状态定义

<div id="section-3" class="note-anchor"></div>

### 1. 容量不超过 j 的最大价值

定义：

`dp[j] = 背包容量不超过 j 时能够获得的最大价值`

初始化：

```cpp
vector<int> dp(cap + 1, 0);
```

因为一个物品都不选时，所有容量的最大价值都是 `0`。

适合：

- 普通 01 背包；
- 不要求恰好装满；
- 求最大价值；
- 允许选择空集。

转移：

```cpp
dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
```

---

<div id="section-4" class="note-anchor"></div>

### 2. 总重量恰好为 j 的最大价值

定义：

`dp[j] = 总重量恰好为 j 时能够获得的最大价值`

初始化：

```cpp
const int INF = 1e18;

vector<int> dp(cap + 1, -INF);
dp[0] = 0;
```

为什么初始化为 `-INF`？

因为除了总重量 `0`，其他重量一开始都无法组成。

如果全部初始化为 `0`，就会把“无法组成”的状态误认为价值为 `0` 的合法状态。

适合：

- 必须恰好装满；
- 恰好凑出某个总和；
- 求恰好总和下的最大价值。

转移前最好判断：

```cpp
if(dp[j-v[i]] != -INF){
    dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
}
```

---

<div id="section-5" class="note-anchor"></div>

### 3. 总重量恰好为 j 的最小代价

定义：

`dp[j] = 总重量恰好为 j 时需要的最小代价`

初始化：

```cpp
const int INF = 1e18;

vector<int> dp(cap + 1, INF);
dp[0] = 0;
```

为什么初始化为 `INF`？

因为要求最小值，无法到达的状态不能初始化为 `0`，否则会错误地成为最优答案。

转移：

```cpp
if(dp[j-v[i]] != INF){
    dp[j] = min(dp[j], dp[j-v[i]] + cost[i]);
}
```

适合：

- 凑出目标总和的最小物品数；
- 最小花费；
- 最少操作次数；
- 最小代价恰好达到目标。

---

<div id="section-6" class="note-anchor"></div>

### 4. 总重量恰好为 j 的方案数

定义：

`dp[j] = 总重量恰好为 j 的选择方案数`

初始化：

```cpp
vector<int> dp(cap + 1, 0);
dp[0] = 1;
```

这里 `dp[0]=1` 表示：

`什么都不选，总和为 0，有一种方案`

转移：

```cpp
dp[j] += dp[j-v[i]];
```

适合：

- 统计子集和方案数；
- 统计凑出某个金额的方法数；
- 组合计数问题。

---

<div id="section-7" class="note-anchor"></div>

### 5. 能否组成总重量 j

定义：

`dp[j] = 是否能够组成总重量 j`

初始化：

```cpp
vector<bool> dp(cap + 1, false);
dp[0] = true;
```

转移：

```cpp
dp[j] = dp[j] || dp[j-v[i]];
```

适合：

- 判断子集和是否存在；
- 判断能否恰好装满；
- 判断目标总和是否可达。

---

<div id="section-8" class="note-anchor"></div>

## 三、为什么有时初始化为 0，有时是 -INF 或 INF

<div id="section-9" class="note-anchor"></div>

### 初始化为 0

一般用于：

`dp[j] = 容量不超过 j 时的最大价值`

因为不选择任何物品也是合法方案，价值为 `0`。

```cpp
vector<int> dp(cap + 1, 0);
```

---

<div id="section-10" class="note-anchor"></div>

### 初始化为 -INF

一般用于：

`dp[j] = 恰好组成 j 时的最大价值`

因为无法组成的状态不能参与 `max`。

```cpp
vector<int> dp(cap + 1, -INF);
dp[0] = 0;
```

---

<div id="section-11" class="note-anchor"></div>

### 初始化为 INF

一般用于：

`dp[j] = 恰好组成 j 时的最小代价`

因为无法组成的状态不能参与 `min`。

```cpp
vector<int> dp(cap + 1, INF);
dp[0] = 0;
```

---

<div id="section-12" class="note-anchor"></div>

### 初始化为 dp[0]=1

一般用于方案数：

```cpp
vector<int> dp(cap + 1, 0);
dp[0] = 1;
```

空集是后面所有方案转移的起点。

---

<div id="section-13" class="note-anchor"></div>

## 四、01 背包

每个物品最多选择一次。

二维状态：

`dp[i][j] = 使用前 i 个物品，容量为 j 时的最优答案`

转移：

`dp[i][j] = max(dp[i-1][j], dp[i-1][j-v[i]] + val[i])`

压缩为一维：

```cpp
for(int i=1;i<=n;i++){
    for(int j=cap;j>=v[i];j--){
        dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
    }
}
```

<div id="section-14" class="note-anchor"></div>

### 为什么倒序枚举

倒序保证计算 `dp[j]` 时，`dp[j-v[i]]` 仍然是第 `i-1` 层状态。

如果正序枚举，`dp[j-v[i]]` 可能已经在当前第 `i` 层被更新，导致当前物品被重复选择。

所以：

`01 背包：容量倒序枚举`

---

<div id="section-15" class="note-anchor"></div>

## 五、完全背包

每个物品可以选择无限次。

```cpp
for(int i=1;i<=n;i++){
    for(int j=v[i];j<=cap;j++){
        dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
    }
}
```

<div id="section-16" class="note-anchor"></div>

### 为什么正序枚举

计算 `dp[j]` 时，允许使用当前层已经更新过的 `dp[j-v[i]]`。

这意味着可以在已经选择当前物品的基础上，再选择一次当前物品。

所以：

`完全背包：容量正序枚举`

---

<div id="section-17" class="note-anchor"></div>

## 六、多重背包

第 `i` 个物品最多选择 `cnt[i]` 次。

最直接写法：

```cpp
for(int i=1;i<=n;i++){
    for(int k=1;k<=cnt[i];k++){
        for(int j=cap;j>=v[i];j--){
            dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
        }
    }
}
```

复杂度可能较高。

常见优化：

- 二进制拆分；
- 单调队列优化。

二进制拆分后，可以把多重背包转化为若干个 01 背包物品。

---

<div id="section-18" class="note-anchor"></div>

## 七、分组背包

物品被分成若干组，每组最多选择一个物品。

```cpp
for(每一组 i){
    for(int j=cap;j>=0;j--){
        for(组内每个物品 k){
            if(j>=v[k]){
                dp[j] = max(dp[j], dp[j-v[k]] + val[k]);
            }
        }
    }
}
```

注意：

- 最外层枚举组；
- 容量倒序；
- 最内层枚举这一组的物品。

适合：

- 每组方案只能选择一个；
- 主件附件问题；
- 多种互斥选择。

---

<div id="section-19" class="note-anchor"></div>

## 八、Pull DP 和 Push DP

<div id="section-20" class="note-anchor"></div>

### Pull DP

当前状态主动从前驱状态获取答案。

```cpp
dp[j] = max(dp[j], dp[j-v[i]] + val[i]);
```

它在思考：

`要得到 dp[j]，可以从哪些状态转移过来？`

标准二维形式：

```cpp
ndp[j] = dp[j];

if(j>=v[i]){
    ndp[j] = max(ndp[j], dp[j-v[i]] + val[i]);
}
```

使用一个数组时，01 背包需要倒序，防止使用当前层状态。

---

<div id="section-21" class="note-anchor"></div>

### Push DP

从当前已有状态向后更新其他状态。

```cpp
dp[j+v[i]] = max(dp[j+v[i]], dp[j] + val[i]);
```

它在思考：

`当前 dp[j] 可以更新哪些状态？`

01 背包同样需要保证每个物品只用一次，通常倒序枚举 `j`。

Pull 和 Push 的区别是观察转移的方向，不是是否使用 `ndp`。

---

<div id="section-22" class="note-anchor"></div>

## 九、不同枚举顺序的区别

<div id="section-23" class="note-anchor"></div>

### 1. 01 背包

```cpp
for(int i=1;i<=n;i++){
    for(int j=cap;j>=v[i];j--){
        // 转移
    }
}
```

容量倒序，因为每个物品最多选择一次。

---

<div id="section-24" class="note-anchor"></div>

### 2. 完全背包

```cpp
for(int i=1;i<=n;i++){
    for(int j=v[i];j<=cap;j++){
        // 转移
    }
}
```

容量正序，因为当前物品可以重复选择。

---

<div id="section-25" class="note-anchor"></div>

### 3. 方案数：组合和排列

假设每种数字可以无限使用。

<div id="section-26" class="note-anchor"></div>

#### 先枚举物品，再枚举总和

```cpp
for(int i=1;i<=n;i++){
    for(int j=v[i];j<=cap;j++){
        dp[j] += dp[j-v[i]];
    }
}
```

统计的是组合数，选择顺序不同不算新方案。

例如 `1+2` 和 `2+1` 算同一种方案。

<div id="section-27" class="note-anchor"></div>

#### 先枚举总和，再枚举物品

```cpp
for(int j=1;j<=cap;j++){
    for(int i=1;i<=n;i++){
        if(j>=v[i]){
            dp[j] += dp[j-v[i]];
        }
    }
}
```

统计的是排列数，选择顺序不同算不同方案。

例如 `1+2` 和 `2+1` 算两种方案。

---

<div id="section-28" class="note-anchor"></div>

## 十、常见状态定义对比

| 状态定义 | 初始化 | 适合问题 |
|---|---|---|
| `dp[j] = 容量不超过 j 的最大价值` | 全部为 `0` | 普通最大价值背包 |
| `dp[j] = 恰好总和为 j 的最大价值` | `dp[0]=0`，其他为 `-INF` | 恰好装满且求最大值 |
| `dp[j] = 恰好总和为 j 的最小代价` | `dp[0]=0`，其他为 `INF` | 最少物品、最小花费 |
| `dp[j] = 总和为 j 的方案数` | `dp[0]=1`，其他为 `0` | 子集计数、组合计数 |
| `dp[j] = 总和 j 是否可达` | `dp[0]=true`，其他为 `false` | 可行性、子集和判断 |

---

<div id="section-29" class="note-anchor"></div>

## 十一、写背包前先问自己

1. 每个物品可以选择几次？
   - 一次：01 背包；
   - 无限次：完全背包；
   - 有限次：多重背包；
   - 每组最多选一个：分组背包。

2. `dp[j]` 表示容量不超过 `j`，还是恰好等于 `j`？

3. 求的是最大值、最小值、方案数，还是可行性？

4. 无法到达的状态应该初始化为什么？
   - 求最大值：`-INF`；
   - 求最小值：`INF`；
   - 求方案数：`0`；
   - 求可行性：`false`。

5. 当前物品能否重复使用？
   - 不能重复：倒序；
   - 可以重复：正序。

---

<div id="section-30" class="note-anchor"></div>

## 十二、核心记忆

`01 背包倒序，完全背包正序。`

`求最大值且要求恰好到达时，无法到达状态初始化为 -INF。`

`求最小值时，无法到达状态初始化为 INF。`

`求方案数时，dp[0]=1。`

`先确定 dp[j] 的准确含义，再决定初始化和转移。`
