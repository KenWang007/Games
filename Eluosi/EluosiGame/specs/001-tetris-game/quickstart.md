# Quick Start Guide: 儿童卡通俄罗斯方块游戏

**Feature**: 001-tetris-game  
**Date**: 2025-12-22

## 🚀 5分钟快速开始

### 1. 环境要求

- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- 本地 HTTP 服务器（用于开发）
- 代码编辑器（推荐 VS Code）

### 2. 项目初始化

```bash
# 进入项目目录
cd EluosiGame

# 创建项目结构
mkdir -p src/{css,js/{game,systems,render,input,audio,utils},assets/{sounds,fonts}}
mkdir -p tests/{unit/{game,systems},integration,e2e}

# 创建入口文件
touch src/index.html
touch src/css/{style.css,animations.css,responsive.css}
touch src/js/main.js
```

### 3. 基础 HTML 模板

创建 `src/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>🎮 卡通俄罗斯方块</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <div id="game-container">
    <!-- 背景层 -->
    <canvas id="bg-canvas"></canvas>
    
    <!-- 游戏层 -->
    <canvas id="game-canvas"></canvas>
    
    <!-- 特效层 -->
    <canvas id="fx-canvas"></canvas>
    
    <!-- UI层 -->
    <div id="ui-layer">
      <div id="score-panel">
        <div class="stat">
          <span class="label">分数</span>
          <span id="score">0</span>
        </div>
        <div class="stat">
          <span class="label">等级</span>
          <span id="level">🐣 新手蛋蛋</span>
        </div>
        <div class="stat">
          <span class="label">最高分</span>
          <span id="high-score">0</span>
        </div>
      </div>
      
      <div id="next-piece">
        <span class="label">下一个</span>
        <canvas id="preview-canvas"></canvas>
      </div>
      
      <div id="controls">
        <button id="btn-start">🎮 开始游戏</button>
        <button id="btn-pause" hidden>⏸️ 暂停</button>
        <button id="btn-sound">🔊</button>
        <button id="btn-music">🎵</button>
      </div>
    </div>
    
    <!-- 暂停菜单 -->
    <div id="pause-menu" class="modal" hidden>
      <div class="modal-content">
        <h2>⏸️ 游戏暂停</h2>
        <button id="btn-resume">▶️ 继续游戏</button>
        <button id="btn-restart">🔄 重新开始</button>
      </div>
    </div>
    
    <!-- 游戏结束 -->
    <div id="game-over" class="modal" hidden>
      <div class="modal-content">
        <h2 id="game-over-title">游戏结束</h2>
        <p>得分: <span id="final-score">0</span></p>
        <p>等级: <span id="final-level">1</span></p>
        <button id="btn-play-again">🔄 再玩一次</button>
      </div>
    </div>
  </div>
  
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 4. 基础样式

创建 `src/css/style.css`:

```css
/* 卡通字体 */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(135deg, #E0F7FA 0%, #F3E5F5 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

#game-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 9/16;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#bg-canvas { z-index: 1; }
#game-canvas { z-index: 2; }
#fx-canvas { z-index: 3; pointer-events: none; }
#ui-layer { z-index: 4; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
#ui-layer > * { pointer-events: auto; }

/* 分数面板 */
#score-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.stat:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 12px;
  color: #757575;
}

#score, #level, #high-score {
  font-size: 18px;
  font-weight: 700;
  color: #424242;
}

/* 下一个方块预览 */
#next-piece {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#preview-canvas {
  position: static;
  width: 80px;
  height: 80px;
  margin-top: 8px;
}

/* 控制按钮 */
#controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

button {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 700;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4FC3F7, #64B5F6);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 195, 247, 0.5);
}

button:active {
  transform: translateY(0);
}

/* 模态框 */
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  font-size: 28px;
  margin-bottom: 16px;
  color: #424242;
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 8px;
  color: #757575;
}

.modal-content button {
  margin: 8px;
}
```

### 5. 启动开发服务器

```bash
# 方法1: 使用 Python
cd src
python3 -m http.server 8080

# 方法2: 使用 Node.js (需要先安装 http-server)
npx http-server src -p 8080

# 方法3: 使用 VS Code Live Server 扩展
# 右键 index.html -> Open with Live Server
```

访问 `http://localhost:8080` 查看效果。

## 🎮 核心模块实现顺序

### Step 1: 游戏常量 (`js/game/constants.js`)

```javascript
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

export const TETROMINOES = {
  I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#4FC3F7' },
  O: { shape: [[1,1],[1,1]], color: '#FFD54F' },
  T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: '#BA68C8' },
  S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: '#81C784' },
  Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: '#FF8A65' },
  J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: '#64B5F6' },
  L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: '#FFB74D' }
};

export const LEVELS = [
  { level: 1,  score: 0,      icon: '🐣', name: '新手蛋蛋',   speed: 1000 },
  { level: 2,  score: 1000,   icon: '🐥', name: '小黄鸡',     speed: 900 },
  { level: 3,  score: 3000,   icon: '🐤', name: '快乐鸟',     speed: 800 },
  { level: 4,  score: 6000,   icon: '🐔', name: '聪明鸡',     speed: 700 },
  { level: 5,  score: 10000,  icon: '🦅', name: '飞翔鹰',     speed: 600 },
  { level: 6,  score: 15000,  icon: '🦄', name: '神奇独角兽', speed: 500 },
  { level: 7,  score: 25000,  icon: '🐉', name: '传说龙龙',   speed: 450 },
  { level: 8,  score: 40000,  icon: '⭐', name: '超级明星',   speed: 400 },
  { level: 9,  score: 60000,  icon: '🌟', name: '闪耀之星',   speed: 350 },
  { level: 10, score: 100000, icon: '👑', name: '方块大王',   speed: 300 }
];

export const SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };
```

### Step 2: 方块类 (`js/game/Tetromino.js`)

```javascript
import { TETROMINOES } from './constants.js';

export class Tetromino {
  constructor(type) {
    this.type = type;
    this.color = TETROMINOES[type].color;
    this.rotation = 0;
    this.shapes = this.generateRotations(TETROMINOES[type].shape);
    this.x = 3; // 初始X位置
    this.y = -2; // 从顶部外开始
  }
  
  get shape() {
    return this.shapes[this.rotation];
  }
  
  generateRotations(baseShape) {
    const rotations = [baseShape];
    let current = baseShape;
    for (let i = 0; i < 3; i++) {
      current = this.rotateMatrix(current);
      rotations.push(current);
    }
    return rotations;
  }
  
  rotateMatrix(matrix) {
    const n = matrix.length;
    const result = [];
    for (let i = 0; i < n; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        result[i][j] = matrix[n - 1 - j][i];
      }
    }
    return result;
  }
  
  rotate() {
    this.rotation = (this.rotation + 1) % 4;
  }
  
  unrotate() {
    this.rotation = (this.rotation + 3) % 4;
  }
  
  static random() {
    const types = Object.keys(TETROMINOES);
    const type = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(type);
  }
}
```

### Step 3: 游戏面板 (`js/game/Board.js`)

```javascript
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants.js';

export class Board {
  constructor() {
    this.grid = this.createEmptyGrid();
  }
  
  createEmptyGrid() {
    return Array(BOARD_HEIGHT).fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null));
  }
  
  isValidPosition(piece, offsetX = 0, offsetY = 0) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = piece.x + col + offsetX;
          const y = piece.y + row + offsetY;
          
          if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
            return false;
          }
          if (y >= 0 && this.grid[y][x]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  lockPiece(piece) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = piece.x + col;
          const y = piece.y + row;
          if (y >= 0) {
            this.grid[y][x] = piece.color;
          }
        }
      }
    }
  }
  
  clearLines() {
    const linesToClear = [];
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.grid[row].every(cell => cell !== null)) {
        linesToClear.push(row);
      }
    }
    
    // 从下往上删除行
    linesToClear.forEach(row => {
      this.grid.splice(row, 1);
      this.grid.unshift(Array(BOARD_WIDTH).fill(null));
    });
    
    return linesToClear.length;
  }
  
  reset() {
    this.grid = this.createEmptyGrid();
  }
}
```

### Step 4: 主入口 (`js/main.js`)

```javascript
import { Board } from './game/Board.js';
import { Tetromino } from './game/Tetromino.js';
import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT, SCORES, LEVELS } from './game/constants.js';

class TetrisGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.board = new Board();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = LEVELS[0];
    this.gameState = 'idle';
    this.lastDrop = 0;
    
    this.setupCanvas();
    this.setupControls();
  }
  
  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = BOARD_WIDTH * CELL_SIZE * dpr;
    this.canvas.height = BOARD_HEIGHT * CELL_SIZE * dpr;
    this.canvas.style.width = BOARD_WIDTH * CELL_SIZE + 'px';
    this.canvas.style.height = BOARD_HEIGHT * CELL_SIZE + 'px';
    this.ctx.scale(dpr, dpr);
  }
  
  setupControls() {
    document.addEventListener('keydown', (e) => this.handleInput(e));
    document.getElementById('btn-start').addEventListener('click', () => this.start());
    document.getElementById('btn-pause').addEventListener('click', () => this.pause());
    document.getElementById('btn-resume').addEventListener('click', () => this.resume());
    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-play-again').addEventListener('click', () => this.restart());
  }
  
  handleInput(e) {
    if (this.gameState !== 'playing') return;
    
    switch (e.code) {
      case 'ArrowLeft':
        this.movePiece(-1, 0);
        break;
      case 'ArrowRight':
        this.movePiece(1, 0);
        break;
      case 'ArrowDown':
        this.movePiece(0, 1);
        break;
      case 'ArrowUp':
      case 'Space':
        this.rotatePiece();
        break;
      case 'Escape':
        this.pause();
        break;
    }
    e.preventDefault();
  }
  
  start() {
    this.board.reset();
    this.score = 0;
    this.level = LEVELS[0];
    this.spawnPiece();
    this.gameState = 'playing';
    this.lastDrop = performance.now();
    
    document.getElementById('btn-start').hidden = true;
    document.getElementById('btn-pause').hidden = false;
    
    this.gameLoop();
  }
  
  spawnPiece() {
    this.currentPiece = this.nextPiece || Tetromino.random();
    this.nextPiece = Tetromino.random();
    
    if (!this.board.isValidPosition(this.currentPiece)) {
      this.gameOver();
    }
  }
  
  movePiece(dx, dy) {
    if (this.board.isValidPosition(this.currentPiece, dx, dy)) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      return true;
    }
    return false;
  }
  
  rotatePiece() {
    this.currentPiece.rotate();
    if (!this.board.isValidPosition(this.currentPiece)) {
      this.currentPiece.unrotate();
    }
  }
  
  lockPiece() {
    this.board.lockPiece(this.currentPiece);
    const linesCleared = this.board.clearLines();
    
    if (linesCleared > 0) {
      this.score += SCORES[linesCleared] * this.level.level;
      this.updateLevel();
    }
    
    this.updateUI();
    this.spawnPiece();
  }
  
  updateLevel() {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (this.score >= LEVELS[i].score) {
        this.level = LEVELS[i];
        break;
      }
    }
  }
  
  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('level').textContent = `${this.level.icon} ${this.level.name}`;
  }
  
  pause() {
    this.gameState = 'paused';
    document.getElementById('pause-menu').hidden = false;
  }
  
  resume() {
    this.gameState = 'playing';
    document.getElementById('pause-menu').hidden = true;
    this.lastDrop = performance.now();
    this.gameLoop();
  }
  
  restart() {
    document.getElementById('pause-menu').hidden = true;
    document.getElementById('game-over').hidden = true;
    this.start();
  }
  
  gameOver() {
    this.gameState = 'gameOver';
    document.getElementById('btn-pause').hidden = true;
    document.getElementById('game-over').hidden = false;
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-level').textContent = this.level.level;
  }
  
  gameLoop() {
    if (this.gameState !== 'playing') return;
    
    const now = performance.now();
    if (now - this.lastDrop > this.level.speed) {
      if (!this.movePiece(0, 1)) {
        this.lockPiece();
      }
      this.lastDrop = now;
    }
    
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制网格背景
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      this.ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      this.ctx.stroke();
    }
    
    // 绘制已固定的方块
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (this.board.grid[y][x]) {
          this.drawCell(x, y, this.board.grid[y][x]);
        }
      }
    }
    
    // 绘制当前方块
    if (this.currentPiece) {
      const shape = this.currentPiece.shape;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const x = this.currentPiece.x + col;
            const y = this.currentPiece.y + row;
            if (y >= 0) {
              this.drawCell(x, y, this.currentPiece.color);
            }
          }
        }
      }
    }
  }
  
  drawCell(x, y, color) {
    const padding = 2;
    const radius = 4;
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding,
      CELL_SIZE - padding * 2,
      CELL_SIZE - padding * 2,
      radius
    );
    this.ctx.fill();
    
    // 高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.roundRect(
      x * CELL_SIZE + padding,
      y * CELL_SIZE + padding,
      CELL_SIZE - padding * 2,
      (CELL_SIZE - padding * 2) / 3,
      [radius, radius, 0, 0]
    );
    this.ctx.fill();
  }
}

// 初始化游戏
const game = new TetrisGame();
```

## 🧪 测试

### 运行单元测试

```bash
# 安装 Jest
npm init -y
npm install --save-dev jest @types/jest jsdom

# 运行测试
npm test
```

### 示例测试 (`tests/unit/game/Board.test.js`)

```javascript
import { Board } from '../../../src/js/game/Board.js';
import { Tetromino } from '../../../src/js/game/Tetromino.js';

describe('Board', () => {
  let board;
  
  beforeEach(() => {
    board = new Board();
  });
  
  test('should create empty 10x20 grid', () => {
    expect(board.grid.length).toBe(20);
    expect(board.grid[0].length).toBe(10);
    expect(board.grid.flat().every(cell => cell === null)).toBe(true);
  });
  
  test('should detect valid position', () => {
    const piece = new Tetromino('O');
    piece.x = 0;
    piece.y = 0;
    expect(board.isValidPosition(piece)).toBe(true);
  });
  
  test('should detect invalid position (out of bounds)', () => {
    const piece = new Tetromino('O');
    piece.x = -1;
    piece.y = 0;
    expect(board.isValidPosition(piece)).toBe(false);
  });
  
  test('should clear completed lines', () => {
    // 填满底部一行
    for (let x = 0; x < 10; x++) {
      board.grid[19][x] = '#FF0000';
    }
    
    const cleared = board.clearLines();
    expect(cleared).toBe(1);
    expect(board.grid[19].every(cell => cell === null)).toBe(true);
  });
});
```

## 📱 触屏支持

在 `main.js` 中添加:

```javascript
setupTouchControls() {
  let startX, startY;
  const minSwipe = 30;
  
  this.canvas.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  
  this.canvas.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > minSwipe) this.movePiece(1, 0);
      else if (dx < -minSwipe) this.movePiece(-1, 0);
    } else {
      if (dy > minSwipe) this.movePiece(0, 1);
    }
    
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
      this.rotatePiece();
    }
  });
}
```

## 🎉 下一步

1. **Phase 2.1**: 完善核心游戏引擎
2. **Phase 2.2**: 实现积分和等级系统
3. **Phase 2.3**: 添加历史记录和烟花效果
4. **Phase 2.4**: 完善卡通视觉风格

详细任务分解请参考 [plan.md](./plan.md)。

