# Implementation Plan: 儿童卡通俄罗斯方块游戏

**Branch**: `001-tetris-game` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-tetris-game/spec.md`

## Summary

创建一款专为儿童设计的浏览器端俄罗斯方块游戏。采用HTML5 Canvas渲染，纯JavaScript实现，无需构建工具或后端服务。游戏包含完整的积分系统（10个等级）、localStorage历史记录、破纪录烟花庆祝效果，以及可爱的卡通视觉风格。

## Technical Context

**Language/Version**: JavaScript ES6+ (Vanilla JS，无框架)  
**Primary Dependencies**: 无外部依赖（纯原生实现）  
**Storage**: localStorage（历史记录、设置）  
**Testing**: Jest + jsdom（单元测试）、Playwright（E2E测试）  
**Target Platform**: 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）  
**Project Type**: Single（纯前端静态网站）  
**Performance Goals**: 60fps游戏渲染，<16ms输入延迟，<3秒首次加载  
**Constraints**: <2MB总资源，<500KB gzipped代码，离线可用  
**Scale/Scope**: 单人游戏，10个等级，7种方块

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality First | ✅ PASS | 模块化设计，单一职责，命名规范 |
| II. Testing Standards | ✅ PASS | TDD流程，Jest单元测试，Playwright E2E |
| III. User Experience Consistency | ✅ PASS | 统一设计系统，60fps动画，<100ms反馈 |
| IV. Performance Requirements | ✅ PASS | 60fps目标，<3秒加载，<200MB内存 |
| V. Simplicity & Maintainability | ✅ PASS | 无框架依赖，原生JS实现，YAGNI原则 |

**Quality Gates Checklist**:
- [ ] 100% 测试通过
- [ ] 核心逻辑 90%+ 覆盖率
- [ ] UI组件 80%+ 覆盖率
- [ ] 零 Lint 错误
- [ ] 性能目标达成（60fps, <3秒加载）
- [ ] 代码审查通过
- [ ] 公共API文档完整

## Project Structure

### Documentation (this feature)

```text
specs/001-tetris-game/
├── plan.md              # 本文件（实现计划）
├── research.md          # Phase 0: 技术研究
├── data-model.md        # Phase 1: 数据模型设计
├── quickstart.md        # Phase 1: 快速开始指南
├── contracts/           # Phase 1: 接口契约
│   ├── game-engine.md   # 游戏引擎接口
│   ├── renderer.md      # 渲染器接口
│   └── storage.md       # 存储接口
└── tasks.md             # Phase 2: 任务分解（由 /speckit.tasks 生成）
```

### Source Code (repository root)

```text
src/
├── index.html           # 主页面入口
├── css/
│   ├── style.css        # 主样式（布局、主题）
│   ├── animations.css   # 动画定义
│   └── responsive.css   # 响应式样式
├── js/
│   ├── main.js          # 应用入口
│   ├── game/
│   │   ├── Game.js      # 游戏主控制器
│   │   ├── Board.js     # 游戏面板（10x20网格）
│   │   ├── Tetromino.js # 方块定义与旋转
│   │   └── constants.js # 游戏常量（形状、颜色、等级）
│   ├── systems/
│   │   ├── ScoreSystem.js    # 积分计算
│   │   ├── LevelSystem.js    # 等级管理
│   │   └── StorageSystem.js  # localStorage封装
│   ├── render/
│   │   ├── Renderer.js       # Canvas渲染器
│   │   ├── UIRenderer.js     # UI元素渲染
│   │   └── EffectsRenderer.js # 特效渲染（烟花、粒子）
│   ├── input/
│   │   ├── KeyboardInput.js  # 键盘输入处理
│   │   └── TouchInput.js     # 触屏输入处理
│   ├── audio/
│   │   └── AudioManager.js   # 音频管理
│   └── utils/
│       ├── EventEmitter.js   # 事件发射器
│       └── helpers.js        # 工具函数
└── assets/
    ├── sounds/
    │   ├── move.mp3          # 移动音效
    │   ├── rotate.mp3        # 旋转音效
    │   ├── clear.mp3         # 消行音效
    │   ├── levelup.mp3       # 升级音效
    │   ├── gameover.mp3      # 游戏结束音效
    │   └── bgm.mp3           # 背景音乐
    └── fonts/
        └── cartoon.woff2     # 卡通字体

tests/
├── unit/
│   ├── game/
│   │   ├── Board.test.js
│   │   ├── Tetromino.test.js
│   │   └── Game.test.js
│   └── systems/
│       ├── ScoreSystem.test.js
│       └── LevelSystem.test.js
├── integration/
│   └── GameFlow.test.js
└── e2e/
    └── gameplay.spec.js
```

**Structure Decision**: 选择单项目结构（Option 1变体），因为这是纯前端应用，无需后端。使用模块化目录组织代码，按功能域划分（game/systems/render/input/audio）。

## Phase 0: Technical Research

### 0.1 Canvas vs CSS Grid 渲染方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **HTML5 Canvas** | 高性能，60fps稳定，粒子效果简单 | 需手动处理所有绘制 | ⭐⭐⭐⭐⭐ |
| CSS Grid + DOM | 简单直观，CSS动画丰富 | 大量DOM操作性能差 | ⭐⭐⭐ |
| WebGL | 极致性能，3D效果 | 过度复杂，学习曲线高 | ⭐⭐ |

**决策**: 使用 **HTML5 Canvas** 作为主渲染方案，UI元素（按钮、分数显示）使用DOM。

### 0.2 游戏循环架构

```javascript
// 推荐: requestAnimationFrame + 固定时间步长
class GameLoop {
  constructor(updateRate = 60) {
    this.updateInterval = 1000 / updateRate;
    this.lastTime = 0;
    this.accumulator = 0;
  }
  
  start(updateFn, renderFn) {
    const loop = (currentTime) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.accumulator += deltaTime;
      
      while (this.accumulator >= this.updateInterval) {
        updateFn(this.updateInterval);
        this.accumulator -= this.updateInterval;
      }
      
      renderFn();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
```

### 0.3 方块旋转算法

使用 **Super Rotation System (SRS)** 标准：
- 预定义每种方块的4个旋转状态
- 实现"踢墙"(Wall Kick)机制处理边界旋转
- 每种方块有独立的踢墙偏移表

### 0.4 音频方案

使用 **Web Audio API** 而非 `<audio>` 标签：
- 更低延迟（<10ms vs 100ms+）
- 可同时播放多个音效
- 支持音量控制和混音

### 0.5 烟花效果实现

使用 **Canvas粒子系统**：
- 粒子数量: 100-200个/次
- 物理模拟: 重力 + 空气阻力
- 颜色: 随机彩色，渐变淡出
- 持续时间: 2-3秒

## Phase 1: Design

### 1.1 核心数据模型

详见 [data-model.md](./data-model.md)

### 1.2 接口契约

详见 [contracts/](./contracts/) 目录

### 1.3 状态机设计

```
┌─────────────┐
│   IDLE      │ ←────────────────────┐
│ (未开始)    │                      │
└──────┬──────┘                      │
       │ startGame()                 │
       ▼                             │
┌─────────────┐    pause()     ┌─────────────┐
│   PLAYING   │ ───────────────▶│   PAUSED    │
│  (游戏中)   │ ◀───────────────│   (暂停)    │
└──────┬──────┘    resume()    └─────────────┘
       │ gameOver()                  │
       ▼                             │
┌─────────────┐    restart()         │
│  GAME_OVER  │ ─────────────────────┘
│ (游戏结束)  │
└─────────────┘
```

### 1.4 事件系统

```javascript
// 核心游戏事件
const GAME_EVENTS = {
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_OVER: 'game:over',
  
  PIECE_SPAWN: 'piece:spawn',
  PIECE_MOVE: 'piece:move',
  PIECE_ROTATE: 'piece:rotate',
  PIECE_LOCK: 'piece:lock',
  
  LINES_CLEAR: 'lines:clear',
  SCORE_UPDATE: 'score:update',
  LEVEL_UP: 'level:up',
  
  HIGH_SCORE_BEAT: 'highscore:beat',
};
```

## Phase 2: Implementation Phases

### Phase 2.1: 核心游戏引擎 (P1)

**目标**: 实现可玩的基础俄罗斯方块

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.1.1 项目初始化（HTML/CSS骨架） | 1h | - |
| 2.1.2 Canvas渲染器基础 | 2h | 2.1.1 |
| 2.1.3 方块定义（7种形状+旋转） | 2h | - |
| 2.1.4 游戏面板（10x20网格） | 2h | 2.1.2 |
| 2.1.5 碰撞检测系统 | 2h | 2.1.3, 2.1.4 |
| 2.1.6 方块下落与锁定 | 2h | 2.1.5 |
| 2.1.7 消行逻辑 | 2h | 2.1.6 |
| 2.1.8 键盘输入处理 | 1h | 2.1.6 |
| 2.1.9 游戏循环整合 | 2h | 2.1.7, 2.1.8 |

**验收标准**: 可以用键盘控制方块，完成消行

### Phase 2.2: 积分与等级系统 (P1)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.2.1 积分计算逻辑 | 1h | 2.1.7 |
| 2.2.2 等级系统（10级） | 1h | 2.2.1 |
| 2.2.3 速度递增逻辑 | 1h | 2.2.2 |
| 2.2.4 UI显示（分数/等级/图标） | 2h | 2.2.2 |

**验收标准**: 消行得分正确，等级随分数提升，速度加快

### Phase 2.3: 历史记录与庆祝效果 (P2)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.3.1 localStorage封装 | 1h | - |
| 2.3.2 历史最高分存取 | 1h | 2.3.1 |
| 2.3.3 最近5次记录 | 1h | 2.3.1 |
| 2.3.4 破纪录检测 | 1h | 2.3.2 |
| 2.3.5 烟花粒子系统 | 3h | 2.1.2 |
| 2.3.6 恭喜动画整合 | 2h | 2.3.4, 2.3.5 |

**验收标准**: 刷新后记录保留，破纪录时显示烟花

### Phase 2.4: 卡通视觉风格 (P2)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.4.1 渐变背景实现 | 1h | 2.1.1 |
| 2.4.2 方块圆角+阴影渲染 | 2h | 2.1.2 |
| 2.4.3 装饰元素（云朵/星星） | 2h | 2.4.1 |
| 2.4.4 消行粒子效果 | 2h | 2.1.7 |
| 2.4.5 升级动画效果 | 2h | 2.2.2 |
| 2.4.6 卡通字体集成 | 1h | 2.1.1 |

**验收标准**: 界面符合卡通风格，动画流畅

### Phase 2.5: 游戏控制与暂停 (P2)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.5.1 暂停/继续状态机 | 1h | 2.1.9 |
| 2.5.2 暂停菜单UI | 2h | 2.5.1 |
| 2.5.3 触屏输入处理 | 3h | 2.1.8 |
| 2.5.4 失焦自动暂停 | 1h | 2.5.1 |
| 2.5.5 响应式布局 | 2h | 2.1.1 |

**验收标准**: 支持键盘+触屏，暂停功能正常

### Phase 2.6: 音效系统 (P3)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.6.1 AudioManager基础 | 2h | - |
| 2.6.2 音效资源准备 | 1h | - |
| 2.6.3 游戏事件音效绑定 | 2h | 2.6.1 |
| 2.6.4 背景音乐循环 | 1h | 2.6.1 |
| 2.6.5 音量控制UI | 1h | 2.6.1 |
| 2.6.6 设置持久化 | 1h | 2.3.1, 2.6.5 |

**验收标准**: 音效播放正常，可独立控制开关

### Phase 2.7: 下一个方块预览 (P3)

| 任务 | 估时 | 依赖 |
|------|------|------|
| 2.7.1 预览区域渲染 | 2h | 2.1.2 |
| 2.7.2 方块队列管理 | 1h | 2.1.3 |
| 2.7.3 UI整合 | 1h | 2.7.1, 2.7.2 |

**验收标准**: 正确显示下一个方块

## 时间估算总览

| Phase | 任务数 | 估时 | 累计 |
|-------|--------|------|------|
| 2.1 核心引擎 | 9 | 16h | 16h |
| 2.2 积分等级 | 4 | 5h | 21h |
| 2.3 历史记录 | 6 | 9h | 30h |
| 2.4 视觉风格 | 6 | 10h | 40h |
| 2.5 控制暂停 | 5 | 9h | 49h |
| 2.6 音效系统 | 6 | 8h | 57h |
| 2.7 预览功能 | 3 | 4h | 61h |
| **测试** | - | 10h | 71h |
| **总计** | 39 | **71h** | - |

## 风险与缓解

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 触屏操作体验差 | 中 | 高 | 早期原型测试，迭代优化 |
| 烟花效果性能问题 | 低 | 中 | 限制粒子数量，使用对象池 |
| 音频延迟问题 | 低 | 低 | 使用Web Audio API预加载 |
| 浏览器兼容性 | 低 | 中 | 使用标准API，添加polyfill |

## Complexity Tracking

> 本项目遵循简单原则，无需复杂度豁免

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 框架选择 | Vanilla JS | 游戏逻辑简单，无需React/Vue开销 |
| 构建工具 | 无 | 原生ES6模块，浏览器直接运行 |
| 状态管理 | 简单对象 | 无需Redux/MobX，游戏状态集中管理 |
| 测试框架 | Jest | 轻量，适合单元测试 |

