# Tasks: 植物大战僵尸网页版

**Input**: Design documents from `.specify/features/`
**Prerequisites**: plan.md (required), zhiwu-vs-jiangshi-web-game.md (spec)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事 (US1, US2, US3...)

---

## Phase 1: Setup (项目初始化)

**Purpose**: 创建项目基础结构和配置

- [ ] T001 创建项目目录结构 (index.html, css/, js/, assets/)
- [ ] T002 创建 index.html 基础页面结构，引入CSS和JS模块
- [ ] T003 [P] 创建 css/main.css 基础样式和CSS变量
- [ ] T004 [P] 创建 js/config/constants.js 游戏常量配置
- [ ] T005 [P] 创建 README.md 项目说明文档

**Checkpoint**: 项目结构就绪，可在浏览器中打开空白页面

---

## Phase 2: Foundational (核心基础设施)

**Purpose**: 游戏引擎核心，所有用户故事的前置依赖

**⚠️ CRITICAL**: 此阶段完成前，无法开始任何用户故事

- [ ] T006 创建 js/core/Game.js 游戏主类（初始化、游戏循环、状态管理）
- [ ] T007 创建 js/core/Scene.js 场景管理器（场景切换、生命周期）
- [ ] T008 [P] 创建 js/core/Input.js 输入处理器（鼠标点击、触屏、拖拽）
- [ ] T009 创建 js/entities/Entity.js 实体基类（位置、尺寸、更新、渲染）
- [ ] T010 [P] 创建 js/systems/GridSystem.js 草坪网格系统（5行9列）
- [ ] T011 [P] 创建 js/utils/ObjectPool.js 对象池工具类
- [ ] T012 [P] 创建 js/utils/SpriteSheet.js 精灵图管理工具
- [ ] T013 创建 js/main.js 入口文件，初始化游戏实例
- [ ] T014 实现 Canvas 渲染基础（背景绘制、网格绘制）
- [ ] T015 [P] 创建占位符图片资源 (assets/images/) 用于开发测试

**Checkpoint**: 游戏可启动，显示草坪网格，响应点击事件

---

## Phase 3: User Story 1 - 基础游戏体验 (Priority: P1) 🎯 MVP

**Goal**: 玩家可以种植植物攻击僵尸，体验核心游戏循环

**Independent Test**: 打开游戏，种植向日葵和豌豆射手，击败僵尸

### 3.1 植物系统

- [ ] T016 [US1] 创建 js/entities/Plant.js 植物基类
- [ ] T017 [P] [US1] 创建 js/entities/plants/Sunflower.js 向日葵（产阳光）
- [ ] T018 [P] [US1] 创建 js/entities/plants/Peashooter.js 豌豆射手（发射豌豆）
- [ ] T019 [US1] 创建 js/entities/Projectile.js 子弹类（移动、碰撞）
- [ ] T020 [US1] 实现植物种植逻辑（点击格子放置植物）

### 3.2 僵尸系统

- [ ] T021 [US1] 创建 js/entities/Zombie.js 僵尸基类
- [ ] T022 [US1] 创建 js/entities/zombies/BasicZombie.js 普通僵尸
- [ ] T023 [US1] 创建 js/systems/WaveSystem.js 僵尸波次管理
- [ ] T024 [US1] 实现僵尸行走、攻击植物逻辑

### 3.3 战斗系统

- [ ] T025 [US1] 创建 js/systems/CollisionSystem.js 碰撞检测
- [ ] T026 [US1] 实现子弹击中僵尸逻辑（伤害、击杀）
- [ ] T027 [US1] 实现僵尸啃食植物逻辑
- [ ] T028 [US1] 实现胜负判定（所有僵尸被消灭=胜利，僵尸到达左侧=失败）

### 3.4 视觉反馈

- [ ] T029 [P] [US1] 创建植物动画（摇摆、攻击）
- [ ] T030 [P] [US1] 创建僵尸动画（行走、攻击、死亡）
- [ ] T031 [US1] 创建胜利/失败界面

**Checkpoint**: 完整的一局游戏可以进行，有胜负结果

---

## Phase 4: User Story 2 - 阳光收集系统 (Priority: P1)

**Goal**: 玩家收集阳光作为种植植物的资源

**Independent Test**: 点击天空掉落的阳光和向日葵产生的阳光，观察数值增加

- [ ] T032 [US2] 创建 js/entities/Sun.js 阳光实体类
- [ ] T033 [US2] 创建 js/systems/SunSystem.js 阳光管理系统
- [ ] T034 [US2] 实现天空定期掉落阳光（每10秒）
- [ ] T035 [US2] 实现向日葵产生阳光（每24秒）
- [ ] T036 [US2] 实现阳光点击收集逻辑（飞向计数器动画）
- [ ] T037 [US2] 实现阳光自动消失（10秒后渐隐）
- [ ] T038 [P] [US2] 创建 js/ui/SunCounter.js 阳光计数器UI

**Checkpoint**: 阳光系统完整运作，可收集阳光用于种植

---

## Phase 5: User Story 3 - 植物选择卡片系统 (Priority: P1)

**Goal**: 玩家从卡片栏选择植物进行种植

**Independent Test**: 点击不同植物卡片，选中后种植到草坪

- [ ] T039 [US3] 创建 js/ui/CardBar.js 植物卡片栏组件
- [ ] T040 [US3] 创建 js/config/plants.js 植物配置数据
- [ ] T041 [US3] 实现卡片选中状态（高亮显示）
- [ ] T042 [US3] 实现阳光不足时卡片灰显
- [ ] T043 [US3] 实现植物冷却机制（种植后CD）
- [ ] T044 [US3] 实现冷却进度条可视化
- [ ] T045 [P] [US3] 创建植物卡片图片资源

**Checkpoint**: 完整的植物选择和种植流程

---

## Phase 6: User Story 4 - 关卡进度系统 (Priority: P2)

**Goal**: 玩家逐步挑战不同难度的关卡

**Independent Test**: 完成第一关，解锁第二关，体验不同难度

- [ ] T046 [US4] 创建 js/config/levels.js 关卡配置数据（10关）
- [ ] T047 [US4] 创建 js/ui/LevelSelect.js 关卡选择界面
- [ ] T048 [US4] 实现关卡解锁逻辑
- [ ] T049 [US4] 实现关卡难度递增（僵尸数量、类型）
- [ ] T050 [US4] 实现星级评价系统（1-3星）
- [ ] T051 [P] [US4] 创建关卡选择界面UI资源
- [ ] T052 [US4] 添加更多植物类型
  - [ ] T052a [P] 创建 js/entities/plants/WallNut.js 坚果墙
  - [ ] T052b [P] 创建 js/entities/plants/SnowPea.js 寒冰射手
  - [ ] T052c [P] 创建 js/entities/plants/Repeater.js 双发射手
- [ ] T053 [US4] 添加更多僵尸类型
  - [ ] T053a [P] 创建 js/entities/zombies/ConeheadZombie.js 路障僵尸
  - [ ] T053b [P] 创建 js/entities/zombies/BucketheadZombie.js 铁桶僵尸

**Checkpoint**: 10个关卡可选择，难度递进

---

## Phase 7: User Story 5 - 新手引导教程 (Priority: P2)

**Goal**: 引导新玩家快速上手游戏

**Independent Test**: 首次进入游戏，跟随教程完成第一局

- [ ] T054 [US5] 创建 js/ui/Tutorial.js 教程管理器
- [ ] T055 [US5] 设计教程步骤（收集阳光→种向日葵→种豌豆射手→击败僵尸）
- [ ] T056 [US5] 实现教程高亮效果（目标区域高亮，其他区域变暗）
- [ ] T057 [US5] 实现教程对话框和引导箭头
- [ ] T058 [US5] 实现教程完成状态保存
- [ ] T059 [P] [US5] 创建教程UI资源（引导手指、对话框）

**Checkpoint**: 新玩家可通过教程学会游戏

---

## Phase 8: User Story 6 - 音效与背景音乐 (Priority: P2)

**Goal**: 增强游戏沉浸感和反馈

**Independent Test**: 进入游戏听到音乐，操作时听到音效

- [ ] T060 [US6] 创建 js/systems/AudioSystem.js 音频管理系统
- [ ] T061 [US6] 实现背景音乐播放和循环
- [ ] T062 [US6] 实现音效播放（种植、收集、射击、击中）
- [ ] T063 [US6] 实现音量控制UI（音乐/音效分开控制）
- [ ] T064 [US6] 实现音频设置保存到localStorage
- [ ] T065 [P] [US6] 准备音频资源文件（可使用免费音效资源）

**Checkpoint**: 游戏有完整的音效体验

---

## Phase 9: User Story 7 - 植物图鉴收集 (Priority: P3)

**Goal**: 玩家可查看已解锁植物的信息

**Independent Test**: 打开图鉴，查看植物详情

- [ ] T066 [US7] 创建图鉴界面组件
- [ ] T067 [US7] 实现植物解锁状态管理
- [ ] T068 [US7] 实现植物详情展示（动画、描述、数据）
- [ ] T069 [US7] 实现新植物解锁庆祝动画
- [ ] T070 [P] [US7] 编写植物趣味描述文案

**Checkpoint**: 图鉴功能完整可用

---

## Phase 10: User Story 8 - 游戏存档系统 (Priority: P3)

**Goal**: 玩家进度可保存和恢复

**Independent Test**: 完成几关后关闭浏览器，重新打开检查进度

- [ ] T071 [US8] 创建 js/utils/Storage.js 存档管理器
- [ ] T072 [US8] 实现自动保存（关卡完成时）
- [ ] T073 [US8] 实现进度读取（游戏启动时）
- [ ] T074 [US8] 实现重置进度功能（带确认对话框）
- [ ] T075 [US8] 处理localStorage不可用的降级方案

**Checkpoint**: 存档系统完整可用

---

## Phase 11: Polish & 优化

**Purpose**: 整体润色和性能优化

- [ ] T076 [P] 创建正式版游戏美术资源
- [ ] T077 [P] 优化动画流畅度
- [ ] T078 性能优化（对象池、脏矩形渲染）
- [ ] T079 [P] 响应式布局优化（平板适配）
- [ ] T080 [P] 触屏操作优化
- [ ] T081 添加游戏暂停功能
- [ ] T082 添加设置菜单（音量、重置进度）
- [ ] T083 浏览器兼容性测试和修复
- [ ] T084 最终测试和Bug修复

**Checkpoint**: 游戏发布就绪

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS ALL USER STORIES
    ↓
┌───────────────────────────────────────────────────┐
│  Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3)   │  P1 Stories (MVP)
└───────────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────────┐
│  Phase 6 (US4) ←→ Phase 7 (US5) ←→ Phase 8 (US6) │  P2 Stories (可并行)
└───────────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────────┐
│  Phase 9 (US7) ←→ Phase 10 (US8)                 │  P3 Stories (可并行)
└───────────────────────────────────────────────────┘
    ↓
Phase 11 (Polish)
```

### MVP 路径 (最小可玩版本)

1. ✅ Phase 1: Setup
2. ✅ Phase 2: Foundational
3. ✅ Phase 3: User Story 1 (基础游戏)
4. ✅ Phase 4: User Story 2 (阳光系统)
5. ✅ Phase 5: User Story 3 (卡片系统)

**MVP完成后即可试玩！**

---

## Parallel Opportunities

### Phase 2 内可并行
```
T008 Input.js  ←→  T010 GridSystem.js  ←→  T011 ObjectPool.js  ←→  T012 SpriteSheet.js
```

### Phase 3 内可并行
```
T017 Sunflower.js  ←→  T018 Peashooter.js
T029 植物动画  ←→  T030 僵尸动画
```

### Phase 6 内可并行
```
T052a WallNut  ←→  T052b SnowPea  ←→  T052c Repeater
T053a ConeheadZombie  ←→  T053b BucketheadZombie
```

---

## 估算时间

| Phase | 预计时间 | 累计 |
|-------|---------|------|
| Phase 1-2 | 2-3小时 | 3小时 |
| Phase 3 (US1) | 4-6小时 | 9小时 |
| Phase 4 (US2) | 2-3小时 | 12小时 |
| Phase 5 (US3) | 2-3小时 | 15小时 |
| **MVP完成** | **~15小时** | |
| Phase 6 (US4) | 4-5小时 | 20小时 |
| Phase 7 (US5) | 2-3小时 | 23小时 |
| Phase 8 (US6) | 2-3小时 | 26小时 |
| Phase 9-10 | 3-4小时 | 30小时 |
| Phase 11 | 4-6小时 | 36小时 |
| **完整版** | **~36小时** | |

---

## Notes

- [P] 标记的任务可并行执行
- 每个Phase完成后进行测试验证
- MVP（Phase 1-5）完成后即可开始用户测试
- 美术资源可使用占位符先开发，后期替换
- 优先保证核心玩法流畅，再添加附加功能

