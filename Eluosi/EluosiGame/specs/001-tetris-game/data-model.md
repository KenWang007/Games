# Data Model: 儿童卡通俄罗斯方块游戏

**Feature**: 001-tetris-game  
**Date**: 2025-12-22  
**Status**: Complete

## 1. 核心实体

### 1.1 Tetromino (方块)

俄罗斯方块的基本游戏单元，共7种形状。

```typescript
interface Tetromino {
  type: TetrominoType;        // 方块类型 (I, O, T, S, Z, J, L)
  shape: number[][];          // 当前形状矩阵 (0=空, 1=填充)
  x: number;                  // 左上角X坐标 (列)
  y: number;                  // 左上角Y坐标 (行)
  rotation: RotationState;    // 旋转状态 (0, 1, 2, 3)
  color: string;              // 颜色 (十六进制)
}

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type RotationState = 0 | 1 | 2 | 3;  // 0=初始, 1=顺时针90°, 2=180°, 3=逆时针90°
```

**方块定义**:

| 类型 | 形状 | 颜色 | 矩阵大小 |
|------|------|------|----------|
| I | ████ | #4FC3F7 (天蓝) | 4×4 |
| O | ██<br>██ | #FFD54F (金黄) | 2×2 |
| T | ▄█▄<br>███ | #BA68C8 (紫色) | 3×3 |
| S | ▄██<br>██▀ | #81C784 (草绿) | 3×3 |
| Z | ██▄<br>▀██ | #FF8A65 (珊瑚红) | 3×3 |
| J | █▀▀<br>███ | #64B5F6 (深蓝) | 3×3 |
| L | ▀▀█<br>███ | #FFB74D (橙色) | 3×3 |

### 1.2 GameBoard (游戏面板)

10列×20行的游戏区域网格。

```typescript
interface GameBoard {
  width: number;              // 宽度 (列数): 10
  height: number;             // 高度 (行数): 20
  grid: Cell[][];             // 二维网格数组 [row][col]
}

interface Cell {
  filled: boolean;            // 是否被占用
  color: string | null;       // 占用方块的颜色
}
```

**坐标系**:
- 原点 (0, 0) 在左上角
- X轴向右增加 (0-9)
- Y轴向下增加 (0-19)
- 隐藏区域: Y < 0 (方块生成区)

### 1.3 GameState (游戏状态)

```typescript
interface GameState {
  status: GameStatus;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  board: GameBoard;
  score: number;
  level: Level;
  linesCleared: number;       // 总消除行数
  highScore: number;
  isNewHighScore: boolean;
  dropTimer: number;          // 下落计时器
  lockDelay: number;          // 锁定延迟计时器
}

type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';
```

### 1.4 Level (等级)

```typescript
interface Level {
  level: number;              // 等级数字 (1-10)
  score: number;              // 达到该等级所需分数
  icon: string;               // 等级图标 (emoji)
  name: string;               // 等级名称
  dropSpeed: number;          // 下落速度 (毫秒/格)
}
```

**等级表**:

```javascript
const LEVELS: Level[] = [
  { level: 1,  score: 0,      icon: '🐣', name: '新手蛋蛋',     dropSpeed: 1000 },
  { level: 2,  score: 1000,   icon: '🐥', name: '小黄鸡',       dropSpeed: 900 },
  { level: 3,  score: 3000,   icon: '🐤', name: '快乐鸟',       dropSpeed: 800 },
  { level: 4,  score: 6000,   icon: '🐔', name: '聪明鸡',       dropSpeed: 700 },
  { level: 5,  score: 10000,  icon: '🦅', name: '飞翔鹰',       dropSpeed: 600 },
  { level: 6,  score: 15000,  icon: '🦄', name: '神奇独角兽',   dropSpeed: 500 },
  { level: 7,  score: 25000,  icon: '🐉', name: '传说龙龙',     dropSpeed: 450 },
  { level: 8,  score: 40000,  icon: '⭐', name: '超级明星',     dropSpeed: 400 },
  { level: 9,  score: 60000,  icon: '🌟', name: '闪耀之星',     dropSpeed: 350 },
  { level: 10, score: 100000, icon: '👑', name: '方块大王',     dropSpeed: 300 }
];
```

### 1.5 ScoreRecord (得分记录)

```typescript
interface ScoreRecord {
  score: number;              // 得分
  level: number;              // 达到的等级
  lines: number;              // 消除行数
  date: string;               // ISO 8601 日期时间
}
```

### 1.6 Settings (设置)

```typescript
interface Settings {
  musicEnabled: boolean;      // 背景音乐开关
  soundEnabled: boolean;      // 音效开关
  musicVolume: number;        // 音乐音量 (0-1)
  soundVolume: number;        // 音效音量 (0-1)
}
```

## 2. 存储模型

### 2.1 localStorage 键值

| 键名 | 类型 | 描述 |
|------|------|------|
| `tetris_highScore` | `number` | 历史最高分 |
| `tetris_recentScores` | `ScoreRecord[]` | 最近5次得分记录 |
| `tetris_settings` | `Settings` | 用户设置 |

### 2.2 数据示例

```json
{
  "tetris_highScore": 15000,
  "tetris_recentScores": [
    { "score": 15000, "level": 6, "lines": 45, "date": "2025-12-22T10:30:00Z" },
    { "score": 8500, "level": 4, "lines": 28, "date": "2025-12-21T15:20:00Z" },
    { "score": 3200, "level": 3, "lines": 12, "date": "2025-12-21T14:00:00Z" }
  ],
  "tetris_settings": {
    "musicEnabled": true,
    "soundEnabled": true,
    "musicVolume": 0.5,
    "soundVolume": 0.8
  }
}
```

## 3. 事件模型

### 3.1 游戏事件

```typescript
// 事件类型定义
type GameEvent = 
  | { type: 'GAME_START' }
  | { type: 'GAME_PAUSE' }
  | { type: 'GAME_RESUME' }
  | { type: 'GAME_OVER'; payload: { score: number; level: number; lines: number } }
  | { type: 'PIECE_SPAWN'; payload: { piece: Tetromino } }
  | { type: 'PIECE_MOVE'; payload: { direction: 'left' | 'right' | 'down' } }
  | { type: 'PIECE_ROTATE'; payload: { direction: 'cw' | 'ccw' } }
  | { type: 'PIECE_LOCK'; payload: { piece: Tetromino } }
  | { type: 'LINES_CLEAR'; payload: { lines: number[]; count: number } }
  | { type: 'SCORE_UPDATE'; payload: { score: number; delta: number } }
  | { type: 'LEVEL_UP'; payload: { oldLevel: Level; newLevel: Level } }
  | { type: 'HIGH_SCORE_BEAT'; payload: { newScore: number; oldScore: number } };
```

### 3.2 输入事件

```typescript
type InputEvent =
  | { type: 'KEY_DOWN'; key: string }
  | { type: 'KEY_UP'; key: string }
  | { type: 'TOUCH_START'; x: number; y: number }
  | { type: 'TOUCH_MOVE'; x: number; y: number }
  | { type: 'TOUCH_END'; x: number; y: number }
  | { type: 'SWIPE'; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'TAP' };
```

## 4. 常量定义

### 4.1 游戏常量

```javascript
const GAME_CONSTANTS = {
  // 面板尺寸
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  CELL_SIZE: 30,              // 像素
  
  // 时间参数
  LOCK_DELAY: 500,            // 锁定延迟 (毫秒)
  SOFT_DROP_SPEED: 50,        // 软降速度 (毫秒/格)
  DAS_DELAY: 170,             // 延迟自动移动 (毫秒)
  ARR_SPEED: 50,              // 自动重复速度 (毫秒)
  
  // 积分
  SCORE_SINGLE: 100,
  SCORE_DOUBLE: 300,
  SCORE_TRIPLE: 500,
  SCORE_TETRIS: 800,
  
  // 动画
  LINE_CLEAR_DURATION: 300,   // 消行动画时长 (毫秒)
  LEVEL_UP_DURATION: 1000,    // 升级动画时长 (毫秒)
  FIREWORK_DURATION: 3000,    // 烟花持续时间 (毫秒)
};
```

### 4.2 方块形状定义

```javascript
const TETROMINO_SHAPES = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],  // 状态 0
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],  // 状态 1
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],  // 状态 2
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]   // 状态 3
  ],
  O: [
    [[1,1], [1,1]]  // O形不旋转
  ],
  T: [
    [[0,1,0], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,1], [0,1,0]],
    [[0,0,0], [1,1,1], [0,1,0]],
    [[0,1,0], [1,1,0], [0,1,0]]
  ],
  S: [
    [[0,1,1], [1,1,0], [0,0,0]],
    [[0,1,0], [0,1,1], [0,0,1]],
    [[0,0,0], [0,1,1], [1,1,0]],
    [[1,0,0], [1,1,0], [0,1,0]]
  ],
  Z: [
    [[1,1,0], [0,1,1], [0,0,0]],
    [[0,0,1], [0,1,1], [0,1,0]],
    [[0,0,0], [1,1,0], [0,1,1]],
    [[0,1,0], [1,1,0], [1,0,0]]
  ],
  J: [
    [[1,0,0], [1,1,1], [0,0,0]],
    [[0,1,1], [0,1,0], [0,1,0]],
    [[0,0,0], [1,1,1], [0,0,1]],
    [[0,1,0], [0,1,0], [1,1,0]]
  ],
  L: [
    [[0,0,1], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,0], [0,1,1]],
    [[0,0,0], [1,1,1], [1,0,0]],
    [[1,1,0], [0,1,0], [0,1,0]]
  ]
};
```

### 4.3 踢墙偏移表 (Wall Kick Data)

```javascript
// JLSTZ 方块的踢墙数据
const WALL_KICK_JLSTZ = {
  '0->1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '1->0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '1->2': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '2->1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '2->3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
  '3->2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '3->0': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '0->3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]]
};

// I 方块的踢墙数据
const WALL_KICK_I = {
  '0->1': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '1->0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '1->2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
  '2->1': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  '2->3': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '3->2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '3->0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  '0->3': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]]
};
```

## 5. 状态转换

### 5.1 游戏状态机

```
         startGame()
  IDLE ─────────────────► PLAYING
    ▲                         │
    │                         │ pause()
    │ restart()               ▼
    │                      PAUSED
    │                         │
    │                         │ resume()
    │                         ▼
    │    restart()        PLAYING
    └──────────────────── GAME_OVER
           gameOver()         ▲
                              │
                    (方块堆到顶部)
```

### 5.2 方块生命周期

```
SPAWN ──► FALLING ──► LOCKING ──► LOCKED
  │           │           │
  │           │ (触底)    │ (延迟结束)
  │           ▼           │
  │        LANDED ────────┘
  │           │
  │           │ (移动成功)
  │           ▼
  └────── FALLING
```

## 6. 渲染模型

### 6.1 图层结构

```
┌─────────────────────────────────────┐
│ Layer 4: UI (DOM)                   │  ← 分数、等级、按钮
├─────────────────────────────────────┤
│ Layer 3: Effects Canvas             │  ← 烟花、粒子
├─────────────────────────────────────┤
│ Layer 2: Game Canvas                │  ← 方块、面板
├─────────────────────────────────────┤
│ Layer 1: Background Canvas          │  ← 渐变、装饰
└─────────────────────────────────────┘
```

### 6.2 颜色系统

```javascript
const COLORS = {
  // 背景
  BG_GRADIENT_START: '#E0F7FA',
  BG_GRADIENT_END: '#F3E5F5',
  
  // 方块
  PIECE_I: '#4FC3F7',
  PIECE_O: '#FFD54F',
  PIECE_T: '#BA68C8',
  PIECE_S: '#81C784',
  PIECE_Z: '#FF8A65',
  PIECE_J: '#64B5F6',
  PIECE_L: '#FFB74D',
  
  // UI
  TEXT_PRIMARY: '#424242',
  TEXT_SECONDARY: '#757575',
  PANEL_BG: 'rgba(255, 255, 255, 0.9)',
  PANEL_BORDER: 'rgba(0, 0, 0, 0.1)',
  
  // 特效
  GHOST_PIECE: 'rgba(0, 0, 0, 0.2)',
  LINE_CLEAR_FLASH: '#FFFFFF',
  
  // 烟花颜色
  FIREWORK: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
};
```

## 7. 音频资源

| 资源ID | 文件名 | 触发时机 | 时长 |
|--------|--------|----------|------|
| `move` | move.mp3 | 方块移动 | <100ms |
| `rotate` | rotate.mp3 | 方块旋转 | <100ms |
| `drop` | drop.mp3 | 方块硬降 | <200ms |
| `lock` | lock.mp3 | 方块锁定 | <200ms |
| `clear` | clear.mp3 | 消除行 | <500ms |
| `tetris` | tetris.mp3 | 消除4行 | <800ms |
| `levelup` | levelup.mp3 | 升级 | <1000ms |
| `highscore` | highscore.mp3 | 破纪录 | <1500ms |
| `gameover` | gameover.mp3 | 游戏结束 | <1500ms |
| `bgm` | bgm.mp3 | 背景音乐 | 循环 |

