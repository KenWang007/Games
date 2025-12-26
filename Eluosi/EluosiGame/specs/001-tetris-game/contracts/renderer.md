# Contract: Renderer

**Module**: `js/render/Renderer.js`  
**Version**: 1.0.0  
**Date**: 2025-12-22

## 1. Overview

渲染器负责将游戏状态绘制到Canvas上，包括游戏面板、方块、UI元素和特效。采用分层渲染架构以优化性能。

## 2. Architecture

```
┌─────────────────────────────────────┐
│ EffectsRenderer (fx-canvas)         │  Layer 3: 烟花、粒子
├─────────────────────────────────────┤
│ GameRenderer (game-canvas)          │  Layer 2: 方块、面板
├─────────────────────────────────────┤
│ BackgroundRenderer (bg-canvas)      │  Layer 1: 背景、装饰
└─────────────────────────────────────┘
```

## 3. Public Interface

### 3.1 GameRenderer

主游戏渲染器，负责游戏面板和方块的绘制。

```typescript
class GameRenderer {
  constructor(canvas: HTMLCanvasElement, options?: RendererOptions): GameRenderer
  
  /**
   * 渲染完整的游戏画面
   */
  render(state: RenderState): void;
  
  /**
   * 调整画布大小（响应式）
   */
  resize(width: number, height: number): void;
  
  /**
   * 清空画布
   */
  clear(): void;
  
  /**
   * 销毁渲染器
   */
  destroy(): void;
}

interface RendererOptions {
  cellSize?: number;           // 单元格大小，默认30
  padding?: number;            // 单元格内边距，默认2
  borderRadius?: number;       // 圆角半径，默认4
  showGrid?: boolean;          // 是否显示网格，默认true
  showGhost?: boolean;         // 是否显示幽灵方块，默认true
}

interface RenderState {
  board: Cell[][];             // 面板网格
  currentPiece: Tetromino | null;
  ghostY?: number;             // 幽灵方块Y坐标
}
```

### 3.2 BackgroundRenderer

背景渲染器，负责静态背景和装饰元素。

```typescript
class BackgroundRenderer {
  constructor(canvas: HTMLCanvasElement): BackgroundRenderer
  
  /**
   * 渲染背景（只需调用一次，除非尺寸变化）
   */
  render(): void;
  
  /**
   * 更新装饰元素动画（云朵飘动等）
   */
  update(deltaTime: number): void;
  
  resize(width: number, height: number): void;
}
```

### 3.3 EffectsRenderer

特效渲染器，负责粒子效果和动画。

```typescript
class EffectsRenderer {
  constructor(canvas: HTMLCanvasElement): EffectsRenderer
  
  /**
   * 播放消行特效
   * @param lines 被消除的行号数组
   */
  playLineClear(lines: number[]): void;
  
  /**
   * 播放升级特效
   * @param level 新等级
   */
  playLevelUp(level: Level): void;
  
  /**
   * 播放烟花庆祝
   * @param duration 持续时间（毫秒）
   */
  playFireworks(duration?: number): void;
  
  /**
   * 播放游戏结束特效
   */
  playGameOver(): void;
  
  /**
   * 更新所有活跃的特效
   */
  update(deltaTime: number): void;
  
  /**
   * 渲染所有活跃的特效
   */
  render(): void;
  
  /**
   * 是否有活跃的特效
   */
  readonly isActive: boolean;
  
  clear(): void;
  destroy(): void;
}
```

### 3.4 PreviewRenderer

预览区域渲染器。

```typescript
class PreviewRenderer {
  constructor(canvas: HTMLCanvasElement): PreviewRenderer
  
  /**
   * 渲染预览方块
   */
  render(piece: Tetromino): void;
  
  clear(): void;
}
```

## 4. Rendering Specifications

### 4.1 方块渲染

```javascript
// 方块绘制规范
function drawCell(ctx, x, y, color, options) {
  const { cellSize, padding, borderRadius } = options;
  
  // 1. 主体填充
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2,
    borderRadius
  );
  ctx.fill();
  
  // 2. 顶部高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.roundRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    (cellSize - padding * 2) / 3,
    [borderRadius, borderRadius, 0, 0]
  );
  ctx.fill();
  
  // 3. 底部阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.roundRect(
    x * cellSize + padding,
    y * cellSize + padding + (cellSize - padding * 2) * 2/3,
    cellSize - padding * 2,
    (cellSize - padding * 2) / 3,
    [0, 0, borderRadius, borderRadius]
  );
  ctx.fill();
}
```

### 4.2 幽灵方块

```javascript
// 幽灵方块（预测落点）
function drawGhostPiece(ctx, piece, ghostY, options) {
  const shape = piece.shape;
  ctx.globalAlpha = 0.3;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        drawCell(ctx, piece.x + col, ghostY + row, piece.color, options);
      }
    }
  }
  
  ctx.globalAlpha = 1;
}
```

### 4.3 网格线

```javascript
function drawGrid(ctx, width, height, cellSize) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  // 垂直线
  for (let x = 0; x <= width; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize + 0.5, 0);
    ctx.lineTo(x * cellSize + 0.5, height * cellSize);
    ctx.stroke();
  }
  
  // 水平线
  for (let y = 0; y <= height; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize + 0.5);
    ctx.lineTo(width * cellSize, y * cellSize + 0.5);
    ctx.stroke();
  }
}
```

### 4.4 背景渐变

```javascript
function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#E0F7FA');
  gradient.addColorStop(1, '#F3E5F5');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
```

## 5. Effects Specifications

### 5.1 消行粒子

```typescript
interface LineClearEffect {
  particles: Particle[];
  duration: 300; // ms
  particleCount: 20; // per line
}

// 粒子从消除行向外飞散
// 颜色：白色 + 原方块颜色混合
// 形状：小星星或圆形
```

### 5.2 烟花效果

```typescript
interface FireworkEffect {
  bursts: FireworkBurst[];
  duration: 3000; // ms
  burstCount: 5;
  particlesPerBurst: 100;
}

interface FireworkBurst {
  x: number;
  y: number;
  color: string;
  particles: Particle[];
  delay: number; // 延迟触发
}

// 颜色：随机彩色
// 物理：重力 + 空气阻力
// 淡出：alpha递减
```

### 5.3 升级动画

```typescript
interface LevelUpEffect {
  icon: string;      // 等级图标
  name: string;      // 等级名称
  duration: 1000;    // ms
  
  // 动画序列
  // 1. 图标从中心放大弹出
  // 2. 屏幕边缘光效
  // 3. 名称文字淡入
  // 4. 整体淡出
}
```

## 6. Performance Optimizations

### 6.1 脏矩形渲染

```javascript
class DirtyRectRenderer {
  constructor() {
    this.dirtyRects = [];
  }
  
  markDirty(x, y, width, height) {
    this.dirtyRects.push({ x, y, width, height });
  }
  
  render(ctx, renderFn) {
    if (this.dirtyRects.length === 0) return;
    
    // 合并重叠区域
    const merged = this.mergeRects(this.dirtyRects);
    
    merged.forEach(rect => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.clip();
      renderFn();
      ctx.restore();
    });
    
    this.dirtyRects = [];
  }
}
```

### 6.2 离屏渲染

```javascript
// 预渲染静态元素到离屏Canvas
class OffscreenRenderer {
  constructor(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }
  
  // 预渲染背景
  prerenderBackground() {
    drawBackground(this.ctx, this.canvas.width, this.canvas.height);
    drawDecorations(this.ctx);
  }
  
  // 绘制到主Canvas
  drawTo(targetCtx, x = 0, y = 0) {
    targetCtx.drawImage(this.canvas, x, y);
  }
}
```

### 6.3 对象池

```javascript
class ParticlePool {
  constructor(size = 500) {
    this.pool = [];
    this.active = [];
    
    for (let i = 0; i < size; i++) {
      this.pool.push(new Particle());
    }
  }
  
  acquire() {
    const particle = this.pool.pop() || new Particle();
    this.active.push(particle);
    return particle;
  }
  
  release(particle) {
    const index = this.active.indexOf(particle);
    if (index > -1) {
      this.active.splice(index, 1);
      particle.reset();
      this.pool.push(particle);
    }
  }
  
  releaseAll() {
    while (this.active.length > 0) {
      this.release(this.active[0]);
    }
  }
}
```

## 7. High DPI Support

```javascript
function setupHighDPI(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  return ctx;
}
```

## 8. Color Palette

```javascript
const COLORS = {
  // 方块颜色
  PIECE: {
    I: '#4FC3F7',
    O: '#FFD54F',
    T: '#BA68C8',
    S: '#81C784',
    Z: '#FF8A65',
    J: '#64B5F6',
    L: '#FFB74D'
  },
  
  // 背景
  BG_START: '#E0F7FA',
  BG_END: '#F3E5F5',
  
  // UI
  GRID: 'rgba(0, 0, 0, 0.1)',
  GHOST: 'rgba(0, 0, 0, 0.2)',
  
  // 特效
  FIREWORK: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  LINE_CLEAR: '#FFFFFF',
  LEVEL_UP_GLOW: '#FFD700'
};
```

## 9. Usage Example

```javascript
import { GameRenderer, BackgroundRenderer, EffectsRenderer } from './render/index.js';

// 初始化渲染器
const bgRenderer = new BackgroundRenderer(document.getElementById('bg-canvas'));
const gameRenderer = new GameRenderer(document.getElementById('game-canvas'));
const fxRenderer = new EffectsRenderer(document.getElementById('fx-canvas'));

// 渲染背景（只需一次）
bgRenderer.render();

// 游戏循环中
function render(state) {
  // 渲染游戏
  gameRenderer.render({
    board: state.board.grid,
    currentPiece: state.currentPiece,
    ghostY: calculateGhostY(state)
  });
  
  // 更新和渲染特效
  fxRenderer.update(deltaTime);
  fxRenderer.render();
}

// 触发特效
game.on('LINES_CLEAR', ({ lines }) => {
  fxRenderer.playLineClear(lines);
});

game.on('LEVEL_UP', ({ newLevel }) => {
  fxRenderer.playLevelUp(newLevel);
});

game.on('HIGH_SCORE_BEAT', () => {
  fxRenderer.playFireworks(3000);
});
```

