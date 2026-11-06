---
public: true
title: "敏捷开发与 RUP"
series: "大二下期末复习"
subject: "软件工程"
section: "开发模型"
slug: "semester/software-engineering/notes/敏捷开发与-rup"
order: 194
---

---

<div id="section-1" class="note-anchor"></div>

## 一、敏捷开发（Agile Development）

<div id="section-2" class="note-anchor"></div>

### 敏捷宣言（2001 年，4 个价值观）

> 🔑 **简答题必考**：背诵这条四个"优于"句式。

| # | 价值观 |
|---|--------|
| 1 | **个体与交互** 胜过 过程与工具 |
| 2 | **可工作的软件** 胜过 面面俱到的文档 |
| 3 | **客户协作** 胜过 合同谈判 |
| 4 | **响应变化** 胜过 遵循计划 |

> 尽管右项也有价值，但我们更重视左项。

<div id="section-3" class="note-anchor"></div>

### 敏捷开发的 12 条原则（精选高频考点）

| # | 原则 |
|---|------|
| 1 | 最优先：通过**尽早且持续交付**有价值的软件来满足客户 |
| 2 | **欢迎需求变更**，即使是在开发后期 |
| 3 | 频繁交付可工作软件，周期为**几周到几个月** |
| 4 | 业务人员和开发人员**每天一起工作** |
| 5 | 以**面对面交谈**作为最高效的信息传递方式 |
| 6 | **可工作软件**是衡量进度的首要标准 |
| 7 | 团队定期反思**如何更有效**，并调整行为 |

<div id="section-4" class="note-anchor"></div>

### 敏捷 vs 传统瀑布模型（必考对比）

| 维度 | 瀑布模型 | 敏捷开发 |
|------|----------|----------|
| 开发方式 | 线性、阶段性 | 迭代、增量 |
| 需求 | 前期完全确定 | 逐步演化、欢迎变更 |
| 文档 | 重文档驱动 | 轻文档、可工作软件优先 |
| 用户参与 | 主要在首尾 | 全程持续参与 |
| 团队结构 | 按职能分工 | 跨职能自组织团队 |
| 交付 | 项目结束时一次性交付 | 频繁小版本交付（2-4 周） |
| 变更成本 | 随时间指数增长 | 保持平坦（设计为可变更） |

---

<div id="section-5" class="note-anchor"></div>

## 二、Scrum 框架

> Scrum 是敏捷开发最主流的具体实现框架。

<div id="section-6" class="note-anchor"></div>

### Scrum 核心角色

| 角色 | 职责 |
|------|------|
| **Product Owner**（产品负责人） | 定义需求、排优先级、维护 Product Backlog |
| **Scrum Master**（敏捷教练） | 保障 Scrum 流程、移除障碍、保护团队 |
| **Development Team**（开发团队） | 跨职能、自组织、3-9 人、负责交付可工作软件 |

<div id="section-7" class="note-anchor"></div>

### Scrum 核心工件

| 工件 | 说明 |
|------|------|
| **Product Backlog**（产品待办列表） | 所有需求的优先级排序清单 |
| **Sprint Backlog**（Sprint 待办列表） | 当前 Sprint 选定的需求项 + 交付计划 |
| **Increment**（增量） | 每个 Sprint 结束时交付的可工作软件 |

<div id="section-8" class="note-anchor"></div>

### Scrum 核心事件

| 事件 | 时长 | 说明 |
|------|------|------|
| **Sprint** | 2-4 周 | 开发周期，固定长度 |
| **Sprint Planning** | ≤ 8 小时 | Sprint 计划会，确定本次目标 |
| **Daily Scrum** | 15 分钟 | 每日站会，三个问题（昨天做了什么/今天做什么/有什么障碍） |
| **Sprint Review** | ≤ 4 小时 | Sprint 评审会，演示增量给干系人 |
| **Sprint Retrospective** | ≤ 3 小时 | Sprint 回顾会，反思改进 |

---

<div id="section-9" class="note-anchor"></div>

## 三、RUP 统一过程模型

> RUP（Rational Unified Process）是 IBM/Rational 推出的**用例驱动、以架构为中心、迭代和增量**的软件开发过程框架。

<div id="section-10" class="note-anchor"></div>

### RUP 的 4 个阶段

| 阶段 | 目标 | 核心活动 |
|------|------|----------|
| **初始阶段**（Inception） | 确定项目范围与可行性 | 建立业务用例，识别关键风险 |
| **精化阶段**（Elaboration） | 建立稳定的架构基线 | 需求细化、架构设计、核心代码 |
| **构建阶段**（Construction） | 完成系统开发 | 大量编码、集成、测试 |
| **移交阶段**（Transition） | 将系统交付给用户 | 部署、培训、用户验收 |

<div id="section-11" class="note-anchor"></div>

### RUP 的 9 个核心工作流

| 工作流类型 | 名称 |
|------------|------|
| **6 个核心过程工作流** | 业务建模、需求、分析与设计、实现、测试、部署 |
| **3 个核心支持工作流** | 配置与变更管理、项目管理、环境 |

<div id="section-12" class="note-anchor"></div>

### RUP 的 6 大最佳实践

| # | 最佳实践 | 说明 |
|---|----------|------|
| 1 | **迭代式开发** | 分多次迭代完成开发，降低风险 |
| 2 | **需求管理** | 系统化捕获、组织、跟踪需求变化 |
| 3 | **使用基于构件的架构** | 通过可复用构件构建系统 |
| 4 | **可视化建模** | 使用 UML 进行系统建模 |
| 5 | **持续的质量验证** | 在每次迭代中进行测试和评审 |
| 6 | **管理变更** | 系统化控制软件资产的变更 |

> 🔑 **高频考点**：RUP 的 6 大最佳实践常出现在简答题中，需要记住关键词：**迭代 → 需求 → 构件 → UML → 质量 → 变更**

---

<div id="section-13" class="note-anchor"></div>

## 四、极限编程 XP（了解）

> XP（eXtreme Programming）是敏捷方法的一种，强调用"极限"手段实践工程最佳实践。

| 核心实践 | 说明 |
|----------|------|
| 结对编程（Pair Programming） | 两人共享一台电脑，一人编码一人审查 |
| 测试驱动开发（TDD） | 先写测试再写代码 |
| 持续集成（CI） | 频繁将代码合并到主干，自动构建与测试 |
| 重构（Refactoring） | 持续改进代码结构，不改变外部行为 |
| 简单设计 | 只设计当前需要的东西，不过度设计 |
| 代码集体所有权 | 任何人可以修改任何代码 |

---

<div id="section-14" class="note-anchor"></div>

## 期末考试常见考点

<div id="section-15" class="note-anchor"></div>

### 简答题

> **Q：简述敏捷宣言的四大价值观。**
>
> **答题要点**：
> 1. 个体与交互 胜过 过程与工具
> 2. 可工作的软件 胜过 面面俱到的文档
> 3. 客户协作 胜过 合同谈判
> 4. 响应变化 胜过 遵循计划

> **Q：RUP（统一过程）有哪六大最佳实践？**
>
> **答题要点**：
> 1. 迭代式开发
> 2. 需求管理
> 3. 使用基于构件的架构
> 4. 可视化建模（UML）
> 5. 持续的质量验证
> 6. 管理变更

<div id="section-16" class="note-anchor"></div>

### 选择题

> 以下哪个不是 Scrum 的核心角色？
> A. Product Owner | B. Scrum Master | C. Project Manager | D. Development Team
>
> **答案：C** — Scrum 没有传统意义上的 Project Manager，其职责分散在 PO 和 SM 中。
