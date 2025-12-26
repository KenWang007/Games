/**
 * 卡通俄罗斯方块 - 主入口
 */
import { Game } from './game/Game.js';
import { Renderer } from './render/Renderer.js';
import { EffectsRenderer } from './render/EffectsRenderer.js';
import { KeyboardInput } from './input/KeyboardInput.js';
import { StorageSystem } from './systems/StorageSystem.js';
import { GAME_EVENTS, CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT, DIFFICULTY_LEVELS } from './game/constants.js';
import { formatNumber, setupHighDPICanvas } from './utils/helpers.js';

class TetrisApp {
  constructor() {
    // 核心组件
    this.game = null;
    this.renderer = null;
    this.effectsRenderer = null;  // 特效渲染器
    this.keyboard = null;
    this.storage = null;
    
    // 当前难度
    this.currentDifficulty = 'normal';
    
    // DOM元素
    this.elements = {};
    
    // 渲染循环
    this.renderLoopId = null;
    
    this.init();
  }

  /**
   * 初始化应用
   */
  init() {
    this.cacheElements();
    this.initStorage();
    this.initGame();
    this.initRenderer();
    this.initInput();
    this.bindEvents();
    this.bindGameEvents();
    this.updateUI();
    
    // 初始渲染
    this.startRenderLoop();
    
    console.log('🎮 卡通俄罗斯方块已加载！');
  }

  /**
   * 缓存DOM元素
   */
  cacheElements() {
    this.elements = {
      // Canvas
      gameCanvas: document.getElementById('game-canvas'),
      bgCanvas: document.getElementById('bg-canvas'),
      fxCanvas: document.getElementById('fx-canvas'),
      previewCanvas: document.getElementById('preview-canvas'),
      
      // 分数和等级
      score: document.getElementById('score'),
      levelIcon: document.getElementById('level-icon'),
      levelName: document.getElementById('level-name'),
      highScore: document.getElementById('high-score'),
      linesCleared: document.getElementById('lines-cleared'),
      
      // 移动端状态栏
      mobileStatusBar: document.getElementById('mobile-status-bar'),
      mobileScore: document.getElementById('mobile-score'),
      mobileLevel: document.getElementById('mobile-level'),
      mobileLines: document.getElementById('mobile-lines'),
      
      // 移动端控制按钮
      mobileControls: document.getElementById('mobile-controls'),
      
      // 按钮
      btnStart: document.getElementById('btn-start'),
      btnPause: document.getElementById('btn-pause'),
      btnPlay: document.getElementById('btn-play'),
      btnResume: document.getElementById('btn-resume'),
      btnRestart: document.getElementById('btn-restart'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnSound: document.getElementById('btn-sound'),
      btnMusic: document.getElementById('btn-music'),
      
      // 模态框
      startScreen: document.getElementById('start-screen'),
      pauseMenu: document.getElementById('pause-menu'),
      gameOver: document.getElementById('game-over'),
      recordToast: document.getElementById('record-toast'),
      newRecordBadge: document.getElementById('new-record-badge'),
      
      // 游戏结束统计
      finalScore: document.getElementById('final-score'),
      finalLevel: document.getElementById('final-level'),
      finalLines: document.getElementById('final-lines'),
      gameOverTitle: document.getElementById('game-over-title'),
      
      // 难度显示和选择
      difficultyPanel: document.getElementById('difficulty-panel'),
      currentDiffIcon: document.getElementById('current-diff-icon'),
      currentDiffName: document.getElementById('current-diff-name'),
      difficultyBtnsLarge: document.querySelectorAll('.difficulty-btn-large')
    };
  }

  /**
   * 初始化存储
   */
  initStorage() {
    this.storage = new StorageSystem();
    
    if (!this.storage.isAvailable) {
      console.warn('存储不可用，游戏记录将无法保存');
    }
  }

  /**
   * 初始化游戏
   */
  initGame() {
    this.game = new Game();
    this.game.init(this.storage.getHighScore());
  }

  /**
   * 初始化渲染器
   */
  initRenderer() {
    // 计算合适的单元格大小
    const cellSize = this.calculateCellSize();
    
    this.renderer = new Renderer(this.elements.gameCanvas, {
      cellSize: cellSize
    });
    
    // 初始化背景Canvas
    this.initBackgroundCanvas(cellSize);
    
    // 初始化特效Canvas
    this.initEffectsCanvas(cellSize);
    
    // 初始化预览Canvas
    this.initPreviewCanvas();
  }

  /**
   * 计算合适的单元格大小
   * @returns {number}
   */
  calculateCellSize() {
    const container = document.getElementById('game-container');
    const maxWidth = container.clientWidth - 20;
    const maxHeight = container.clientHeight - 150;
    
    const cellByWidth = Math.floor(maxWidth / BOARD_WIDTH);
    const cellByHeight = Math.floor(maxHeight / BOARD_HEIGHT);
    
    return Math.min(cellByWidth, cellByHeight, CELL_SIZE);
  }

  /**
   * 初始化背景Canvas
   * @param {number} cellSize
   */
  initBackgroundCanvas(cellSize) {
    const width = BOARD_WIDTH * cellSize;
    const height = BOARD_HEIGHT * cellSize;
    const ctx = setupHighDPICanvas(this.elements.bgCanvas, width, height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(224, 247, 250, 0.3)');
    gradient.addColorStop(1, 'rgba(243, 229, 245, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 初始化特效Canvas
   * @param {number} cellSize
   */
  initEffectsCanvas(cellSize) {
    const width = BOARD_WIDTH * cellSize;
    const height = BOARD_HEIGHT * cellSize;
    
    // 初始化特效渲染器
    this.effectsRenderer = new EffectsRenderer(this.elements.fxCanvas);
    this.effectsRenderer.resize(width, height);
  }

  /**
   * 初始化预览Canvas
   */
  initPreviewCanvas() {
    const ctx = setupHighDPICanvas(this.elements.previewCanvas, 80, 80);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, 80, 80);
  }

  /**
   * 初始化输入
   */
  initInput() {
    this.keyboard = new KeyboardInput();
    this.keyboard.bindToGame(this.game);
  }

  /**
   * 绑定DOM事件
   */
  bindEvents() {
    // 开始按钮
    this.elements.btnStart.addEventListener('click', () => this.startGame());
    this.elements.btnPlay.addEventListener('click', () => this.startGame());
    
    // 暂停/继续
    this.elements.btnPause.addEventListener('click', () => this.game.pause());
    this.elements.btnResume.addEventListener('click', () => this.game.resume());
    
    // 重新开始 - 返回开始界面重新选择难度
    this.elements.btnRestart.addEventListener('click', () => this.showStartScreen());
    this.elements.btnPlayAgain.addEventListener('click', () => this.showStartScreen());
    
    // 音效/音乐开关
    this.elements.btnSound.addEventListener('click', () => this.toggleSound());
    this.elements.btnMusic.addEventListener('click', () => this.toggleMusic());
    
    // 难度选择（大按钮 - 开始界面）
    this.elements.difficultyBtnsLarge.forEach(btn => {
      btn.addEventListener('click', () => {
        const difficulty = btn.dataset.difficulty;
        this.setDifficulty(difficulty);
      });
    });
    
    // 窗口失焦自动暂停
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.game.isPlaying) {
        this.game.pause();
      }
    });
    
    // 窗口大小变化
    window.addEventListener('resize', () => this.handleResize());
    
    // 移动端控制按钮
    this.bindMobileControls();
  }
  
  /**
   * 绑定移动端控制按钮
   */
  bindMobileControls() {
    if (!this.elements.mobileControls) return;
    
    const buttons = this.elements.mobileControls.querySelectorAll('.control-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleMobileControl(action);
      });
      
      // 防止长按时的默认行为
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
      });
      
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        this.handleMobileControl(action);
      });
    });
  }
  
  /**
   * 处理移动端控制
   * @param {string} action
   */
  handleMobileControl(action) {
    if (!this.game.isPlaying) return;
    
    switch (action) {
      case 'left':
        this.game.moveLeft();
        break;
      case 'right':
        this.game.moveRight();
        break;
      case 'down':
        this.game.moveDown();
        break;
      case 'rotate':
        this.game.rotate();
        break;
      case 'drop':
        this.game.hardDrop();
        break;
    }
  }

  /**
   * 设置难度
   * @param {string} difficulty - 难度ID
   */
  setDifficulty(difficulty) {
    if (this.game.isPlaying) return; // 游戏中不能更改难度
    
    this.currentDifficulty = difficulty;
    const diffConfig = DIFFICULTY_LEVELS[difficulty];
    
    // 更新左上角当前难度显示
    this.elements.currentDiffIcon.textContent = diffConfig.icon;
    this.elements.currentDiffName.textContent = diffConfig.name;
    
    // 更新大按钮状态（开始界面）
    this.elements.difficultyBtnsLarge.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
    
    // 更新游戏难度
    this.game.setDifficulty(diffConfig);
    
    // 保存设置
    const settings = this.storage.getSettings();
    settings.difficulty = difficulty;
    this.storage.updateSettings(settings);
    
    console.log(`难度已设置为: ${diffConfig.name} ${diffConfig.icon}`);
  }

  /**
   * 绑定游戏事件
   */
  bindGameEvents() {
    // 游戏开始
    this.game.on(GAME_EVENTS.GAME_START, () => {
      this.elements.startScreen.hidden = true;
      this.elements.pauseMenu.hidden = true;
      this.elements.gameOver.hidden = true;
      this.elements.btnStart.hidden = true;
      this.elements.btnPause.hidden = false;
      this.keyboard.setEnabled(true);
    });
    
    // 游戏暂停
    this.game.on(GAME_EVENTS.GAME_PAUSE, () => {
      this.elements.pauseMenu.hidden = false;
      this.keyboard.setEnabled(false);
    });
    
    // 游戏恢复
    this.game.on(GAME_EVENTS.GAME_RESUME, () => {
      this.elements.pauseMenu.hidden = true;
      this.keyboard.setEnabled(true);
    });
    
    // 游戏结束
    this.game.on(GAME_EVENTS.GAME_OVER, (data) => {
      this.handleGameOver(data);
    });
    
    // 分数更新
    this.game.on(GAME_EVENTS.SCORE_UPDATE, ({ score }) => {
      this.elements.score.textContent = formatNumber(score);
      if (this.elements.mobileScore) {
        this.elements.mobileScore.textContent = formatNumber(score);
      }
      this.elements.score.classList.add('animate-score-up');
      setTimeout(() => {
        this.elements.score.classList.remove('animate-score-up');
      }, 300);
    });
    
    // 等级提升
    this.game.on(GAME_EVENTS.LEVEL_UP, ({ newLevel }) => {
      this.elements.levelIcon.textContent = newLevel.icon;
      this.elements.levelName.textContent = newLevel.name;
      this.elements.levelIcon.classList.add('animate-level-up');
      setTimeout(() => {
        this.elements.levelIcon.classList.remove('animate-level-up');
      }, 600);
    });
    
    // 消行 - 播放烟花效果
    this.game.on(GAME_EVENTS.LINES_CLEAR, ({ count, lines }) => {
      const total = this.game.linesCleared;
      this.elements.linesCleared.textContent = total;
      if (this.elements.mobileLines) {
        this.elements.mobileLines.textContent = total;
      }
      
      // 播放消行烟花效果
      if (this.effectsRenderer) {
        this.effectsRenderer.playLineClearFirework(lines || []);
      }
    });
    
    // 破纪录
    this.game.on(GAME_EVENTS.HIGH_SCORE_BEAT, () => {
      this.showRecordToast();
    });
    
    // 方块生成
    this.game.on(GAME_EVENTS.PIECE_SPAWN, ({ next }) => {
      this.renderPreview(next);
    });
    
    // 硬降 - 播放撒花效果
    this.game.on(GAME_EVENTS.PIECE_HARD_DROP, ({ piece, x, y }) => {
      if (this.effectsRenderer && piece) {
        // 计算方块落地位置的中心点（像素坐标）
        const cellSize = this.renderer.cellSize;
        const pieceWidth = piece.width;
        const pieceHeight = piece.height;
        const centerX = (x + pieceWidth / 2) * cellSize;
        // 计算方块底部位置
        const bottomY = (y + pieceHeight) * cellSize;
        
        this.effectsRenderer.playHardDropEffect(centerX, bottomY, piece.color);
      }
    });
  }

  /**
   * 显示开始界面（用于重新选择难度）
   */
  showStartScreen() {
    // 停止当前游戏
    this.game.stop();
    
    // 隐藏其他界面
    this.elements.pauseMenu.hidden = true;
    this.elements.gameOver.hidden = true;
    this.elements.btnPause.hidden = true;
    this.elements.btnStart.hidden = false;
    
    // 显示开始界面
    this.elements.startScreen.hidden = false;
    
    // 启用难度选择
    this.elements.difficultyBtnsLarge.forEach(btn => btn.classList.remove('disabled'));
  }

  /**
   * 开始游戏
   */
  startGame() {
    this.elements.startScreen.hidden = true;
    this.elements.gameOver.hidden = true;
    this.game.start();
  }

  /**
   * 处理游戏结束
   * @param {Object} data
   */
  handleGameOver(data) {
    this.keyboard.setEnabled(false);
    this.elements.btnPause.hidden = true;
    this.elements.btnStart.hidden = false;
    
    // 保存记录
    if (data.isNewHighScore) {
      this.storage.setHighScore(data.score);
      this.elements.highScore.textContent = formatNumber(data.score);
    }
    
    this.storage.addScoreRecord({
      score: data.score,
      level: data.level,
      lines: data.lines
    });
    
    // 显示游戏结束界面
    this.elements.finalScore.textContent = formatNumber(data.score);
    this.elements.finalLevel.textContent = data.level;
    this.elements.finalLines.textContent = data.lines;
    this.elements.newRecordBadge.hidden = !data.isNewHighScore;
    this.elements.gameOverTitle.textContent = data.isNewHighScore 
      ? '🎉 恭喜！新纪录！' 
      : '游戏结束';
    
    this.elements.gameOver.hidden = false;
  }

  /**
   * 显示破纪录提示
   */
  showRecordToast() {
    this.elements.recordToast.hidden = false;
    setTimeout(() => {
      this.elements.recordToast.hidden = true;
    }, 2000);
  }

  /**
   * 切换音效
   */
  toggleSound() {
    const settings = this.storage.getSettings();
    settings.soundEnabled = !settings.soundEnabled;
    this.storage.updateSettings(settings);
    this.elements.btnSound.classList.toggle('muted', !settings.soundEnabled);
    this.elements.btnSound.textContent = settings.soundEnabled ? '🔊' : '🔇';
  }

  /**
   * 切换音乐
   */
  toggleMusic() {
    const settings = this.storage.getSettings();
    settings.musicEnabled = !settings.musicEnabled;
    this.storage.updateSettings(settings);
    this.elements.btnMusic.classList.toggle('muted', !settings.musicEnabled);
    this.elements.btnMusic.textContent = settings.musicEnabled ? '🎵' : '🎵';
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    const cellSize = this.calculateCellSize();
    this.renderer.resize(cellSize);
    this.initBackgroundCanvas(cellSize);
    
    // 重新调整特效Canvas大小
    const width = BOARD_WIDTH * cellSize;
    const height = BOARD_HEIGHT * cellSize;
    if (this.effectsRenderer) {
      this.effectsRenderer.resize(width, height);
    }
  }

  /**
   * 更新UI
   */
  updateUI() {
    this.elements.highScore.textContent = formatNumber(this.storage.getHighScore());
    
    const settings = this.storage.getSettings();
    
    // 恢复难度设置
    const savedDifficulty = settings.difficulty || 'normal';
    this.setDifficulty(savedDifficulty);
    this.elements.btnSound.classList.toggle('muted', !settings.soundEnabled);
    this.elements.btnSound.textContent = settings.soundEnabled ? '🔊' : '🔇';
    this.elements.btnMusic.classList.toggle('muted', !settings.musicEnabled);
  }

  /**
   * 渲染预览方块
   * @param {Tetromino} piece
   */
  renderPreview(piece) {
    if (!piece) return;
    
    const canvas = this.elements.previewCanvas;
    const ctx = canvas.getContext('2d');
    const canvasSize = 80;
    
    // 清空
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // 计算方块大小和位置
    const shape = piece.shapes[0];  // 使用初始旋转状态
    const cellSize = 16;
    const offsetX = (canvasSize - shape[0].length * cellSize) / 2;
    const offsetY = (canvasSize - shape.length * cellSize) / 2;
    
    // 绘制方块
    ctx.fillStyle = piece.color;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = offsetX + col * cellSize + 1;
          const y = offsetY + row * cellSize + 1;
          const size = cellSize - 2;
          
          ctx.beginPath();
          ctx.roundRect(x, y, size, size, 2);
          ctx.fill();
        }
      }
    }
  }

  /**
   * 开始渲染循环
   */
  startRenderLoop() {
    const render = () => {
      if (this.game.isPlaying || this.game.isPaused) {
        this.renderer.render(this.game.getState());
      }
      this.renderLoopId = requestAnimationFrame(render);
    };
    render();
  }

  /**
   * 停止渲染循环
   */
  stopRenderLoop() {
    if (this.renderLoopId) {
      cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = null;
    }
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  window.tetrisApp = new TetrisApp();
});

