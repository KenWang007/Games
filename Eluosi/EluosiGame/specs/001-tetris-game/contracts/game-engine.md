# Contract: Game Engine

**Module**: `js/game/Game.js`  
**Version**: 1.0.0  
**Date**: 2025-12-22

## 1. Overview

游戏引擎是俄罗斯方块的核心控制器，负责协调所有游戏子系统，管理游戏状态和生命周期。

## 2. Public Interface

### 2.1 Constructor

```typescript
class Game {
  constructor(options?: GameOptions): Game
}

interface GameOptions {
  canvas: HTMLCanvasElement;      // 游戏画布
  previewCanvas?: HTMLCanvasElement; // 预览画布
  onScoreChange?: (score: number) => void;
  onLevelChange?: (level: Level) => void;
  onGameOver?: (stats: GameStats) => void;
  onHighScore?: (score: number) => void;
}
```

### 2.2 Lifecycle Methods

```typescript
interface Game {
  /**
   * 开始新游戏
   * @fires GAME_START
   */
  start(): void;
  
  /**
   * 暂停游戏
   * @fires GAME_PAUSE
   */
  pause(): void;
  
  /**
   * 恢复游戏
   * @fires GAME_RESUME
   */
  resume(): void;
  
  /**
   * 重新开始
   * @fires GAME_START
   */
  restart(): void;
  
  /**
   * 销毁游戏实例，清理资源
   */
  destroy(): void;
}
```

### 2.3 Input Methods

```typescript
interface Game {
  /**
   * 向左移动当前方块
   * @returns 是否移动成功
   * @fires PIECE_MOVE
   */
  moveLeft(): boolean;
  
  /**
   * 向右移动当前方块
   * @returns 是否移动成功
   * @fires PIECE_MOVE
   */
  moveRight(): boolean;
  
  /**
   * 软降（加速下落一格）
   * @returns 是否移动成功
   * @fires PIECE_MOVE
   */
  softDrop(): boolean;
  
  /**
   * 硬降（直接落到底部）
   * @fires PIECE_MOVE, PIECE_LOCK
   */
  hardDrop(): void;
  
  /**
   * 顺时针旋转
   * @returns 是否旋转成功
   * @fires PIECE_ROTATE
   */
  rotate(): boolean;
  
  /**
   * 逆时针旋转
   * @returns 是否旋转成功
   * @fires PIECE_ROTATE
   */
  rotateCounterClockwise(): boolean;
}
```

### 2.4 State Accessors

```typescript
interface Game {
  /** 当前游戏状态 */
  readonly state: GameStatus;
  
  /** 当前分数 */
  readonly score: number;
  
  /** 当前等级 */
  readonly level: Level;
  
  /** 已消除行数 */
  readonly linesCleared: number;
  
  /** 历史最高分 */
  readonly highScore: number;
  
  /** 是否正在游戏中 */
  readonly isPlaying: boolean;
  
  /** 是否暂停 */
  readonly isPaused: boolean;
}
```

## 3. Events

游戏引擎通过事件系统与其他模块通信。

### 3.1 Event Types

| 事件名 | Payload | 触发时机 |
|--------|---------|----------|
| `GAME_START` | `{}` | 游戏开始 |
| `GAME_PAUSE` | `{}` | 游戏暂停 |
| `GAME_RESUME` | `{}` | 游戏恢复 |
| `GAME_OVER` | `{ score, level, lines }` | 游戏结束 |
| `PIECE_SPAWN` | `{ piece: Tetromino }` | 新方块生成 |
| `PIECE_MOVE` | `{ direction }` | 方块移动 |
| `PIECE_ROTATE` | `{ direction }` | 方块旋转 |
| `PIECE_LOCK` | `{ piece: Tetromino }` | 方块锁定 |
| `LINES_CLEAR` | `{ lines: number[], count }` | 消除行 |
| `SCORE_UPDATE` | `{ score, delta }` | 分数变化 |
| `LEVEL_UP` | `{ oldLevel, newLevel }` | 等级提升 |
| `HIGH_SCORE_BEAT` | `{ newScore, oldScore }` | 打破记录 |

### 3.2 Event Subscription

```typescript
interface Game {
  /**
   * 订阅事件
   */
  on(event: string, handler: (payload: any) => void): void;
  
  /**
   * 取消订阅
   */
  off(event: string, handler: (payload: any) => void): void;
}
```

## 4. Behavior Specifications

### 4.1 Game Loop

```
每帧执行:
1. 处理输入队列
2. 更新游戏状态
   - 检查下落计时器
   - 如果到达下落间隔，方块下移
   - 如果无法下移，启动锁定延迟
   - 锁定延迟结束，锁定方块
3. 检查消行
4. 更新分数和等级
5. 生成新方块
6. 渲染
```

### 4.2 Piece Spawning

- 新方块在面板顶部中央生成 (x=3, y=-2)
- 如果生成位置被占用，游戏结束
- 使用7-bag随机算法确保方块分布均匀

### 4.3 Lock Delay

- 方块触底后有500ms锁定延迟
- 在延迟期间，玩家仍可移动/旋转
- 成功移动会重置锁定延迟（最多15次）
- 延迟结束后方块锁定

### 4.4 Line Clearing

- 检测所有完整行
- 从下往上依次消除
- 上方方块下落填充空隙
- 根据消除行数计算得分

## 5. Error Handling

```typescript
// 游戏引擎不抛出异常，使用返回值表示操作结果
moveLeft(): boolean  // false = 移动失败（被阻挡）
rotate(): boolean    // false = 旋转失败（无有效位置）

// 状态错误静默忽略
pause()  // 非playing状态调用无效果
resume() // 非paused状态调用无效果
```

## 6. Performance Requirements

| 指标 | 要求 |
|------|------|
| 帧率 | 稳定60fps |
| 输入延迟 | <16ms |
| 内存占用 | <50MB |
| GC暂停 | <5ms |

## 7. Dependencies

```
Game
├── Board          (游戏面板)
├── Tetromino      (方块)
├── ScoreSystem    (积分系统)
├── LevelSystem    (等级系统)
├── Renderer       (渲染器)
├── InputHandler   (输入处理)
└── EventEmitter   (事件系统)
```

## 8. Usage Example

```javascript
import { Game } from './js/game/Game.js';

const game = new Game({
  canvas: document.getElementById('game-canvas'),
  previewCanvas: document.getElementById('preview-canvas'),
  onScoreChange: (score) => updateScoreDisplay(score),
  onLevelChange: (level) => updateLevelDisplay(level),
  onGameOver: (stats) => showGameOverScreen(stats),
  onHighScore: (score) => triggerFireworks(score)
});

// 订阅事件
game.on('LINES_CLEAR', ({ count }) => {
  playSound(count === 4 ? 'tetris' : 'clear');
});

game.on('LEVEL_UP', ({ newLevel }) => {
  showLevelUpAnimation(newLevel);
});

// 开始游戏
game.start();

// 绑定输入
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft': game.moveLeft(); break;
    case 'ArrowRight': game.moveRight(); break;
    case 'ArrowDown': game.softDrop(); break;
    case 'ArrowUp': game.rotate(); break;
    case 'Space': game.hardDrop(); break;
    case 'Escape': game.isPaused ? game.resume() : game.pause(); break;
  }
});
```

