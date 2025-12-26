# Technical Research: 儿童卡通俄罗斯方块游戏

**Feature**: 001-tetris-game  
**Date**: 2025-12-22  
**Status**: Complete

## 1. 渲染技术选型

### 1.1 方案对比

| 技术 | 性能 | 开发效率 | 动画能力 | 兼容性 | 推荐度 |
|------|------|----------|----------|--------|--------|
| **HTML5 Canvas 2D** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ 推荐 |
| CSS Grid + DOM | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 备选 |
| WebGL | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 过度复杂 |
| SVG | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 不适合游戏 |

### 1.2 决策: HTML5 Canvas 2D

**理由**:
1. **性能**: 60fps稳定渲染，无DOM重排开销
2. **粒子效果**: 烟花、消行特效原生支持
3. **统一渲染**: 游戏元素和特效使用同一技术栈
4. **兼容性**: 所有现代浏览器支持，无需polyfill

**实现要点**:
```javascript
// 双缓冲渲染避免闪烁
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 设置高DPI支持
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(dpr, dpr);
```

## 2. 游戏循环架构

### 2.1 requestAnimationFrame + 固定时间步长

```javascript
class GameLoop {
  constructor() {
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDeltaTime = 1000 / 60; // 60 updates per second
    this.running = false;
  }

  start(update, render) {
    this.running = true;
    
    const loop = (currentTime) => {
      if (!this.running) return;
      
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.accumulator += deltaTime;
      
      // 固定时间步长更新（物理/逻辑）
      while (this.accumulator >= this.fixedDeltaTime) {
        update(this.fixedDeltaTime);
        this.accumulator -= this.fixedDeltaTime;
      }
      
      // 渲染（可变帧率）
      render();
      
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }
}
```

**优势**:
- 物理/逻辑更新与渲染解耦
- 在不同刷新率设备上行为一致
- 避免帧率波动导致的游戏速度变化

## 3. 方块系统 (Tetromino)

### 3.1 七种标准方块

```javascript
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#4FC3F7', // 天蓝色
    name: 'I形'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#FFD54F', // 金黄色
    name: 'O形'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#BA68C8', // 紫色
    name: 'T形'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#81C784', // 草绿色
    name: 'S形'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#FF8A65', // 珊瑚红
    name: 'Z形'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#64B5F6', // 深蓝色
    name: 'J形'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#FFB74D', // 橙色
    name: 'L形'
  }
};
```

### 3.2 旋转系统 (SRS - Super Rotation System)

```javascript
// 顺时针旋转矩阵
function rotateMatrix(matrix) {
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

// 踢墙偏移表 (Wall Kick)
const WALL_KICK_OFFSETS = {
  // 0->R, R->2, 2->L, L->0 的偏移尝试
  'JLSTZ': [
    [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // 0->R
    [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],      // R->2
    [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],     // 2->L
    [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]    // L->0
  ],
  'I': [
    [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
  ]
};
```

## 4. 碰撞检测

### 4.1 边界与方块碰撞

```javascript
function isValidPosition(board, piece, offsetX = 0, offsetY = 0) {
  const shape = piece.shape;
  const x = piece.x + offsetX;
  const y = piece.y + offsetY;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        
        // 边界检查
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        // 已有方块检查（y < 0 允许方块从顶部进入）
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}
```

## 5. 积分系统

### 5.1 得分规则

| 消除行数 | 基础分 | 计算公式 |
|----------|--------|----------|
| 1行 (Single) | 100 | 100 × level |
| 2行 (Double) | 300 | 300 × level |
| 3行 (Triple) | 500 | 500 × level |
| 4行 (Tetris) | 800 | 800 × level |

```javascript
const SCORE_TABLE = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

function calculateScore(linesCleared, level) {
  return SCORE_TABLE[linesCleared] * level;
}
```

### 5.2 等级系统

```javascript
const LEVELS = [
  { level: 1,  score: 0,      icon: '🐣', name: '新手蛋蛋',     speed: 1000 },
  { level: 2,  score: 1000,   icon: '🐥', name: '小黄鸡',       speed: 900 },
  { level: 3,  score: 3000,   icon: '🐤', name: '快乐鸟',       speed: 800 },
  { level: 4,  score: 6000,   icon: '🐔', name: '聪明鸡',       speed: 700 },
  { level: 5,  score: 10000,  icon: '🦅', name: '飞翔鹰',       speed: 600 },
  { level: 6,  score: 15000,  icon: '🦄', name: '神奇独角兽',   speed: 500 },
  { level: 7,  score: 25000,  icon: '🐉', name: '传说龙龙',     speed: 450 },
  { level: 8,  score: 40000,  icon: '⭐', name: '超级明星',     speed: 400 },
  { level: 9,  score: 60000,  icon: '🌟', name: '闪耀之星',     speed: 350 },
  { level: 10, score: 100000, icon: '👑', name: '方块大王',     speed: 300 }
];

function getLevelByScore(score) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].score) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}
```

## 6. 存储方案

### 6.1 localStorage 结构

```javascript
const STORAGE_KEYS = {
  HIGH_SCORE: 'tetris_highScore',
  RECENT_SCORES: 'tetris_recentScores',
  SETTINGS: 'tetris_settings'
};

// 数据结构
const storageSchema = {
  highScore: 0,
  recentScores: [
    { score: 1500, level: 3, date: '2025-12-22T10:30:00Z' },
    // ... 最多保存5条
  ],
  settings: {
    musicEnabled: true,
    soundEnabled: true,
    musicVolume: 0.5,
    soundVolume: 0.8
  }
};
```

### 6.2 存储封装

```javascript
class StorageSystem {
  constructor() {
    this.available = this.checkAvailability();
  }
  
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  get(key, defaultValue = null) {
    if (!this.available) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  set(key, value) {
    if (!this.available) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}
```

## 7. 烟花粒子系统

### 7.1 粒子类

```javascript
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    
    // 随机速度（爆发效果）
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // 物理参数
    this.gravity = 0.15;
    this.friction = 0.99;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = Math.random() * 4 + 2;
  }
  
  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  get isDead() {
    return this.alpha <= 0;
  }
}
```

### 7.2 烟花系统

```javascript
class FireworkSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  }
  
  explode(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(new Particle(x, y, color));
    }
  }
  
  update() {
    this.particles = this.particles.filter(p => !p.isDead);
    this.particles.forEach(p => p.update());
  }
  
  draw() {
    this.particles.forEach(p => p.draw(this.ctx));
  }
  
  celebrate() {
    // 多点烟花
    const points = [
      { x: this.canvas.width * 0.25, y: this.canvas.height * 0.3 },
      { x: this.canvas.width * 0.5, y: this.canvas.height * 0.2 },
      { x: this.canvas.width * 0.75, y: this.canvas.height * 0.3 }
    ];
    
    points.forEach((p, i) => {
      setTimeout(() => this.explode(p.x, p.y, 150), i * 300);
    });
  }
}
```

## 8. 音频系统

### 8.1 Web Audio API 封装

```javascript
class AudioManager {
  constructor() {
    this.context = null;
    this.sounds = {};
    this.bgmSource = null;
    this.settings = {
      musicEnabled: true,
      soundEnabled: true,
      musicVolume: 0.5,
      soundVolume: 0.8
    };
  }
  
  async init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    
    // 预加载音效
    await Promise.all([
      this.loadSound('move', 'assets/sounds/move.mp3'),
      this.loadSound('rotate', 'assets/sounds/rotate.mp3'),
      this.loadSound('clear', 'assets/sounds/clear.mp3'),
      this.loadSound('levelup', 'assets/sounds/levelup.mp3'),
      this.loadSound('gameover', 'assets/sounds/gameover.mp3'),
      this.loadSound('bgm', 'assets/sounds/bgm.mp3')
    ]);
  }
  
  async loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.sounds[name] = await this.context.decodeAudioData(arrayBuffer);
  }
  
  play(name) {
    if (!this.settings.soundEnabled || !this.sounds[name]) return;
    
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    
    source.buffer = this.sounds[name];
    gainNode.gain.value = this.settings.soundVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    source.start(0);
  }
  
  playBGM() {
    if (!this.settings.musicEnabled || !this.sounds.bgm) return;
    
    this.bgmSource = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    
    this.bgmSource.buffer = this.sounds.bgm;
    this.bgmSource.loop = true;
    gainNode.gain.value = this.settings.musicVolume;
    
    this.bgmSource.connect(gainNode);
    gainNode.connect(this.context.destination);
    this.bgmSource.start(0);
  }
  
  stopBGM() {
    if (this.bgmSource) {
      this.bgmSource.stop();
      this.bgmSource = null;
    }
  }
}
```

## 9. 输入处理

### 9.1 键盘输入

```javascript
class KeyboardInput {
  constructor() {
    this.keys = {};
    this.handlers = {};
    
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
  }
  
  onKeyDown(e) {
    if (this.keys[e.code]) return; // 防止按键重复
    this.keys[e.code] = true;
    
    const handler = this.handlers[e.code];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }
  
  onKeyUp(e) {
    this.keys[e.code] = false;
  }
  
  on(keyCode, handler) {
    this.handlers[keyCode] = handler;
  }
}

// 使用示例
const keyboard = new KeyboardInput();
keyboard.on('ArrowLeft', () => game.moveLeft());
keyboard.on('ArrowRight', () => game.moveRight());
keyboard.on('ArrowDown', () => game.softDrop());
keyboard.on('ArrowUp', () => game.rotate());
keyboard.on('Space', () => game.hardDrop());
keyboard.on('Escape', () => game.togglePause());
```

### 9.2 触屏输入

```javascript
class TouchInput {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.handlers = {};
    
    element.addEventListener('touchstart', (e) => this.onTouchStart(e));
    element.addEventListener('touchmove', (e) => this.onTouchMove(e));
    element.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }
  
  onTouchStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
  }
  
  onTouchMove(e) {
    e.preventDefault();
  }
  
  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    
    const minSwipe = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > minSwipe) this.emit('swipeRight');
      else if (deltaX < -minSwipe) this.emit('swipeLeft');
    } else {
      // 垂直滑动
      if (deltaY > minSwipe) this.emit('swipeDown');
      else if (deltaY < -minSwipe) this.emit('swipeUp');
    }
    
    // 点击（无明显滑动）
    if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) {
      this.emit('tap');
    }
  }
  
  on(event, handler) {
    this.handlers[event] = handler;
  }
  
  emit(event) {
    if (this.handlers[event]) this.handlers[event]();
  }
}
```

## 10. 性能优化策略

### 10.1 渲染优化

1. **脏矩形渲染**: 只重绘变化区域
2. **离屏Canvas**: 预渲染静态元素（背景、装饰）
3. **对象池**: 复用粒子对象，避免GC

### 10.2 内存优化

```javascript
// 对象池实现
class ObjectPool {
  constructor(factory, reset, initialSize = 100) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }
  
  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }
  
  release(obj) {
    this.reset(obj);
    this.pool.push(obj);
  }
}

// 粒子对象池
const particlePool = new ObjectPool(
  () => new Particle(0, 0, '#fff'),
  (p) => { p.alpha = 1; p.x = 0; p.y = 0; }
);
```

## 11. 浏览器兼容性

### 11.1 支持矩阵

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Canvas 2D | 90+ ✅ | 88+ ✅ | 14+ ✅ | 90+ ✅ |
| Web Audio | 90+ ✅ | 88+ ✅ | 14.1+ ✅ | 90+ ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| ES6 Modules | ✅ | ✅ | ✅ | ✅ |
| Touch Events | ✅ | ✅ | ✅ | ✅ |

### 11.2 注意事项

1. **Safari音频**: 需要用户交互后才能播放
2. **iOS Safari**: 需要处理 `visibilitychange` 事件
3. **移动端**: 需要 `<meta name="viewport">` 正确设置

## 12. 结论与建议

### 12.1 技术栈确认

- **渲染**: HTML5 Canvas 2D
- **语言**: Vanilla JavaScript (ES6+)
- **音频**: Web Audio API
- **存储**: localStorage
- **测试**: Jest + Playwright

### 12.2 开发优先级

1. 先实现核心游戏循环和方块系统
2. 添加积分和等级系统
3. 实现视觉效果和动画
4. 添加音效和背景音乐
5. 最后优化触屏体验

