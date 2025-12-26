# Implementation Plan: 植物大战僵尸网页版

**Branch**: `001-zhiwu-vs-jiangshi-web-game` | **Date**: 2025-12-24 | **Spec**: [zhiwu-vs-jiangshi-web-game.md](./zhiwu-vs-jiangshi-web-game.md)
**Input**: Feature specification from `.specify/features/zhiwu-vs-jiangshi-web-game.md`

## Summary

为10岁以下儿童打造一款网页版塔防游戏，采用纯HTML5 Canvas技术实现，无需构建工具。游戏核心是种植植物防御僵尸，具有可爱卡通风格、简单操作和循序渐进的关卡系统。

## Technical Context

**Language/Version**: JavaScript ES6+, HTML5, CSS3  
**Primary Dependencies**: 无外部依赖，纯原生实现  
**Storage**: localStorage（游戏存档）  
**Testing**: 手动测试 + 浏览器开发者工具  
**Target Platform**: 现代浏览器（Chrome 80+, Safari 14+, Firefox 78+, Edge 80+）  
**Project Type**: 单页Web应用  
**Performance Goals**: 60fps稳定运行，首屏加载<3秒  
**Constraints**: 内存<100MB，支持触屏和鼠标操作，最小宽度768px  
**Scale/Scope**: 10个关卡，5种植物，3种僵尸

## Constitution Check

*GATE: 根据项目宪法检查*

| 原则 | 状态 | 说明 |
|------|------|------|
| 代码质量优先 | ✅ 通过 | 采用模块化设计，清晰的类结构 |
| 测试驱动开发 | ⚠️ 调整 | 儿童游戏以手动测试为主，关键逻辑添加单元测试 |
| 用户体验一致性 | ✅ 通过 | 统一卡通风格，60fps目标，响应式交互 |
| 性能要求 | ✅ 通过 | 明确帧预算，对象池优化 |
| 简洁性原则 | ✅ 通过 | 无外部依赖，最小化复杂度 |

## Project Structure

### Documentation (this feature)

```text
.specify/features/
├── zhiwu-vs-jiangshi-web-game.md  # 产品规格说明
├── plan.md                         # 本文件 - 实现计划
└── tasks.md                        # 详细任务列表
```

### Source Code (repository root)

```text
ZhiwuVSJiangshi/
├── index.html              # 游戏入口页面
├── css/
│   ├── main.css           # 主样式
│   ├── game.css           # 游戏界面样式
│   └── ui.css             # UI组件样式
├── js/
│   ├── main.js            # 入口文件，游戏初始化
│   ├── config/
│   │   ├── constants.js   # 游戏常量配置
│   │   ├── levels.js      # 关卡配置数据
│   │   └── plants.js      # 植物配置数据
│   │   └── zombies.js     # 僵尸配置数据
│   ├── core/
│   │   ├── Game.js        # 游戏主循环
│   │   ├── Scene.js       # 场景管理
│   │   └── Input.js       # 输入处理（鼠标/触屏）
│   ├── entities/
│   │   ├── Entity.js      # 实体基类
│   │   ├── Plant.js       # 植物基类
│   │   ├── Zombie.js      # 僵尸基类
│   │   ├── Projectile.js  # 子弹类
│   │   ├── Sun.js         # 阳光类
│   │   └── plants/        # 具体植物实现
│   │       ├── Sunflower.js
│   │       ├── Peashooter.js
│   │       ├── WallNut.js
│   │       ├── SnowPea.js
│   │       └── Repeater.js
│   │   └── zombies/       # 具体僵尸实现
│   │       ├── BasicZombie.js
│   │       ├── ConeheadZombie.js
│   │       └── BucketheadZombie.js
│   ├── systems/
│   │   ├── GridSystem.js      # 草坪网格系统
│   │   ├── SunSystem.js       # 阳光管理系统
│   │   ├── WaveSystem.js      # 僵尸波次系统
│   │   ├── CollisionSystem.js # 碰撞检测系统
│   │   └── AudioSystem.js     # 音频管理系统
│   ├── ui/
│   │   ├── UIManager.js       # UI管理器
│   │   ├── CardBar.js         # 植物卡片栏
│   │   ├── SunCounter.js      # 阳光计数器
│   │   ├── LevelSelect.js     # 关卡选择界面
│   │   └── Tutorial.js        # 新手引导
│   └── utils/
│       ├── ObjectPool.js      # 对象池
│       ├── Storage.js         # 存档管理
│       └── SpriteSheet.js     # 精灵图管理
├── assets/
│   ├── images/
│   │   ├── plants/        # 植物图片
│   │   ├── zombies/       # 僵尸图片
│   │   ├── ui/            # UI元素
│   │   └── backgrounds/   # 背景图片
│   └── audio/
│       ├── bgm/           # 背景音乐
│       └── sfx/           # 音效
└── README.md              # 项目说明
```

**Structure Decision**: 采用单页Web应用结构，所有代码在前端运行，无后端依赖。模块化JavaScript组织，便于维护和扩展。

## 核心架构设计

### 游戏循环

```
┌─────────────────────────────────────────────────┐
│                  Game Loop (60fps)               │
├─────────────────────────────────────────────────┤
│  1. Input Processing (处理用户输入)              │
│     └─ 鼠标/触屏事件 → 植物种植、阳光收集        │
│                                                  │
│  2. Update (更新游戏状态)                        │
│     ├─ 更新所有植物状态                          │
│     ├─ 更新所有僵尸状态                          │
│     ├─ 更新所有子弹状态                          │
│     ├─ 碰撞检测                                  │
│     ├─ 阳光生成                                  │
│     └─ 波次管理                                  │
│                                                  │
│  3. Render (渲染画面)                            │
│     ├─ 清空画布                                  │
│     ├─ 绘制背景                                  │
│     ├─ 绘制草坪网格                              │
│     ├─ 绘制植物                                  │
│     ├─ 绘制僵尸                                  │
│     ├─ 绘制子弹                                  │
│     ├─ 绘制阳光                                  │
│     └─ 绘制UI                                    │
└─────────────────────────────────────────────────┘
```

### 实体系统

```
Entity (基类)
├── x, y, width, height
├── update(deltaTime)
└── render(ctx)

Plant extends Entity
├── health, attackDamage, attackInterval
├── cooldown, sunCost
└── attack(), takeDamage()

Zombie extends Entity
├── health, speed, attackDamage
├── state (walking, eating, dying)
└── move(), attack(), takeDamage()

Projectile extends Entity
├── damage, speed, direction
└── move(), onHit()

Sun extends Entity
├── value (25)
├── lifetime
└── collect()
```

### 关卡配置结构

```javascript
{
  id: 1,
  name: "第一关：认识向日葵",
  description: "学习种植向日葵收集阳光",
  initialSun: 150,
  availablePlants: ["sunflower", "peashooter"],
  waves: [
    { delay: 30000, zombies: [{ type: "basic", lane: 2, count: 1 }] },
    { delay: 45000, zombies: [{ type: "basic", lane: 1, count: 1 }, { type: "basic", lane: 3, count: 1 }] }
  ],
  tutorial: true
}
```

## 性能优化策略

### 对象池
- 子弹对象池（避免频繁创建销毁）
- 阳光对象池
- 粒子效果对象池

### 渲染优化
- 只重绘变化区域（脏矩形）
- 使用离屏Canvas预渲染静态元素
- 精灵图合并减少HTTP请求

### 内存管理
- 及时清理不再使用的对象
- 图片资源按需加载
- 音频资源复用

## 资源清单

### 植物图片 (PNG, 透明背景)
| 名称 | 尺寸 | 帧数 | 说明 |
|------|------|------|------|
| sunflower.png | 80x80 | 8 | 向日葵动画 |
| peashooter.png | 80x80 | 8 | 豌豆射手动画 |
| wallnut.png | 80x80 | 3 | 坚果墙（完好/损坏/濒死） |
| snowpea.png | 80x80 | 8 | 寒冰射手动画 |
| repeater.png | 80x80 | 8 | 双发射手动画 |

### 僵尸图片 (PNG, 透明背景)
| 名称 | 尺寸 | 帧数 | 说明 |
|------|------|------|------|
| zombie_basic.png | 100x120 | 12 | 普通僵尸（行走/攻击/死亡） |
| zombie_cone.png | 100x120 | 12 | 路障僵尸 |
| zombie_bucket.png | 100x120 | 12 | 铁桶僵尸 |

### UI元素
| 名称 | 说明 |
|------|------|
| card_*.png | 植物卡片 |
| sun.png | 阳光图标 |
| lawn_bg.png | 草坪背景 |
| button_*.png | 各种按钮 |

### 音效
| 名称 | 说明 |
|------|------|
| bgm_game.mp3 | 游戏背景音乐 |
| sfx_plant.mp3 | 种植音效 |
| sfx_sun.mp3 | 收集阳光音效 |
| sfx_shoot.mp3 | 射击音效 |
| sfx_hit.mp3 | 击中音效 |
| sfx_win.mp3 | 胜利音效 |
| sfx_lose.mp3 | 失败音效 |

## Complexity Tracking

| 考量 | 决策 | 理由 |
|------|------|------|
| 无构建工具 | ✅ 采用 | 简化开发流程，适合小型项目 |
| 原生Canvas | ✅ 采用 | 无外部依赖，性能可控 |
| 模块化JS | ✅ 采用 | 使用ES6 modules，浏览器原生支持 |
| 无后端 | ✅ 采用 | 纯前端游戏，localStorage存档 |

