/**
 * Game - 游戏主控制器
 * 管理游戏状态、循环和逻辑
 */
import { EventEmitter } from '../utils/EventEmitter.js';
import { Board } from './Board.js';
import { Tetromino } from './Tetromino.js';
import {
  GAME_STATES,
  GAME_EVENTS,
  SCORE_TABLE,
  LEVELS,
  LOCK_DELAY,
  SOFT_DROP_SPEED
} from './constants.js';

export class Game extends EventEmitter {
  constructor() {
    super();
    
    this.board = new Board();
    this.currentPiece = null;
    this.nextPiece = null;
    this.ghostY = 0;
    
    this.state = GAME_STATES.IDLE;
    this.score = 0;
    this.level = LEVELS[0];
    this.linesCleared = 0;
    this.highScore = 0;
    this.isNewHighScore = false;
    
    // 难度设置
    this.difficulty = {
      speedMultiplier: 1.0,
      scoreMultiplier: 1.0
    };
    
    // 计时器
    this.dropTimer = 0;
    this.lockTimer = 0;
    this.lockMoves = 0;
    this.maxLockMoves = 15;
    
    // 游戏循环
    this.lastTime = 0;
    this.animationFrameId = null;
    
    // 7-bag生成器
    this.pieceGenerator = null;
  }

  /**
   * 初始化游戏
   * @param {number} highScore - 历史最高分
   */
  init(highScore = 0) {
    this.highScore = highScore;
  }

  /**
   * 设置难度
   * @param {Object} diffConfig - 难度配置
   */
  setDifficulty(diffConfig) {
    this.difficulty = {
      speedMultiplier: diffConfig.speedMultiplier || 1.0,
      scoreMultiplier: diffConfig.scoreMultiplier || 1.0
    };
  }

  /**
   * 开始新游戏
   */
  start() {
    this.reset();
    this.state = GAME_STATES.PLAYING;
    this.pieceGenerator = Tetromino.bagGenerator();
    this.spawnPiece();
    this.lastTime = performance.now();
    this.gameLoop();
    this.emit(GAME_EVENTS.GAME_START);
  }

  /**
   * 重置游戏状态
   */
  reset() {
    this.board.reset();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = LEVELS[0];
    this.linesCleared = 0;
    this.isNewHighScore = false;
    this.dropTimer = 0;
    this.lockTimer = 0;
    this.lockMoves = 0;
  }

  /**
   * 暂停游戏
   */
  pause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.emit(GAME_EVENTS.GAME_PAUSE);
    }
  }

  /**
   * 恢复游戏
   */
  resume() {
    if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
      this.lastTime = performance.now();
      this.gameLoop();
      this.emit(GAME_EVENTS.GAME_RESUME);
    }
  }

  /**
   * 重新开始
   */
  restart() {
    this.stop();
    this.start();
    this.emit(GAME_EVENTS.GAME_RESTART);
  }

  /**
   * 停止游戏
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = GAME_STATES.IDLE;
  }

  /**
   * 游戏结束
   */
  gameOver() {
    this.state = GAME_STATES.GAME_OVER;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // 检查是否破纪录
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.isNewHighScore = true;
    }
    
    this.emit(GAME_EVENTS.GAME_OVER, {
      score: this.score,
      level: this.level.level,
      lines: this.linesCleared,
      isNewHighScore: this.isNewHighScore
    });
  }

  /**
   * 游戏主循环
   */
  gameLoop() {
    if (this.state !== GAME_STATES.PLAYING) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 获取当前下落速度（应用难度系数）
   * @returns {number}
   */
  getCurrentSpeed() {
    return this.level.speed * this.difficulty.speedMultiplier;
  }

  /**
   * 更新游戏状态
   * @param {number} deltaTime - 帧间隔时间（毫秒）
   */
  update(deltaTime) {
    if (!this.currentPiece) return;
    
    // 更新下落计时器
    this.dropTimer += deltaTime;
    
    // 检查是否需要下落（应用难度速度系数）
    const currentSpeed = this.getCurrentSpeed();
    if (this.dropTimer >= currentSpeed) {
      this.dropTimer = 0;
      
      if (!this.moveDown()) {
        // 无法下落，开始锁定计时
        this.lockTimer += deltaTime;
      }
    }
    
    // 检查锁定
    if (this.lockTimer > 0) {
      this.lockTimer += deltaTime;
      if (this.lockTimer >= LOCK_DELAY || this.lockMoves >= this.maxLockMoves) {
        this.lockPiece();
      }
    }
  }

  /**
   * 生成新方块
   */
  spawnPiece() {
    // 使用预生成的下一个方块，或生成新的
    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
    } else {
      this.currentPiece = this.pieceGenerator.next().value;
    }
    
    // 生成下一个方块
    this.nextPiece = this.pieceGenerator.next().value;
    
    // 重置锁定状态
    this.lockTimer = 0;
    this.lockMoves = 0;
    
    // 更新幽灵位置
    this.updateGhostY();
    
    // 检查是否可以放置
    if (!this.board.isValidPosition(this.currentPiece)) {
      this.gameOver();
      return;
    }
    
    this.emit(GAME_EVENTS.PIECE_SPAWN, { 
      piece: this.currentPiece,
      next: this.nextPiece 
    });
  }

  /**
   * 更新幽灵方块位置
   */
  updateGhostY() {
    if (this.currentPiece) {
      this.ghostY = this.board.getGhostY(this.currentPiece);
    }
  }

  /**
   * 向左移动
   * @returns {boolean} 是否成功
   */
  moveLeft() {
    return this.move(-1, 0);
  }

  /**
   * 向右移动
   * @returns {boolean} 是否成功
   */
  moveRight() {
    return this.move(1, 0);
  }

  /**
   * 向下移动（软降）
   * @returns {boolean} 是否成功
   */
  moveDown() {
    const success = this.move(0, 1);
    if (success) {
      // 软降得分
      // this.addScore(1);
    }
    return success;
  }

  /**
   * 移动方块
   * @param {number} dx - X偏移
   * @param {number} dy - Y偏移
   * @returns {boolean} 是否成功
   */
  move(dx, dy) {
    if (this.state !== GAME_STATES.PLAYING || !this.currentPiece) {
      return false;
    }
    
    if (this.board.isValidPosition(this.currentPiece, dx, dy)) {
      this.currentPiece.move(dx, dy);
      
      // 如果是水平移动且在锁定状态，重置锁定计时器
      if (dx !== 0 && this.lockTimer > 0) {
        this.lockTimer = 0;
        this.lockMoves++;
      }
      
      // 如果是向下移动，重置锁定
      if (dy > 0) {
        this.lockTimer = 0;
      }
      
      this.updateGhostY();
      this.emit(GAME_EVENTS.PIECE_MOVE, { dx, dy });
      return true;
    }
    
    return false;
  }

  /**
   * 旋转方块
   * @param {boolean} [clockwise=true] - 是否顺时针
   * @returns {boolean} 是否成功
   */
  rotate(clockwise = true) {
    if (this.state !== GAME_STATES.PLAYING || !this.currentPiece) {
      return false;
    }
    
    if (this.board.tryRotate(this.currentPiece, clockwise)) {
      // 重置锁定计时器
      if (this.lockTimer > 0) {
        this.lockTimer = 0;
        this.lockMoves++;
      }
      
      this.updateGhostY();
      this.emit(GAME_EVENTS.PIECE_ROTATE, { clockwise });
      return true;
    }
    
    return false;
  }

  /**
   * 硬降（直接落到底部）
   */
  hardDrop() {
    if (this.state !== GAME_STATES.PLAYING || !this.currentPiece) {
      return;
    }
    
    // 计算下落距离
    const dropDistance = this.ghostY - this.currentPiece.y;
    
    // 保存落地位置信息（用于特效）
    const landingX = this.currentPiece.x;
    const landingY = this.ghostY;
    const piece = this.currentPiece;
    
    // 移动到幽灵位置
    this.currentPiece.y = this.ghostY;
    
    // 硬降得分
    this.addScore(dropDistance * 2);
    
    // 发出硬降事件（包含落地位置信息，用于撒花特效）
    this.emit(GAME_EVENTS.PIECE_HARD_DROP, { 
      distance: dropDistance,
      piece: piece,
      x: landingX,
      y: landingY
    });
    
    // 立即锁定
    this.lockPiece();
  }

  /**
   * 锁定当前方块
   */
  lockPiece() {
    if (!this.currentPiece) return;
    
    // 将方块锁定到面板
    const success = this.board.lockPiece(this.currentPiece);
    
    this.emit(GAME_EVENTS.PIECE_LOCK, { piece: this.currentPiece });
    
    if (!success) {
      // 方块完全在顶部外，游戏结束
      this.gameOver();
      return;
    }
    
    // 检查消行
    const clearedLines = this.board.clearLines();
    if (clearedLines.length > 0) {
      this.onLinesCleared(clearedLines);
    }
    
    // 检查游戏结束
    if (this.board.isGameOver()) {
      this.gameOver();
      return;
    }
    
    // 生成新方块
    this.spawnPiece();
  }

  /**
   * 处理消行
   * @param {number[]} lines - 被消除的行号
   */
  onLinesCleared(lines) {
    const count = lines.length;
    this.linesCleared += count;
    
    // 计算得分（应用难度得分系数）
    const baseScore = SCORE_TABLE[count] || 0;
    const score = Math.floor(baseScore * this.level.level * this.difficulty.scoreMultiplier);
    this.addScore(score);
    
    this.emit(GAME_EVENTS.LINES_CLEAR, { 
      lines, 
      count, 
      score 
    });
    
    // 检查等级提升
    this.checkLevelUp();
  }

  /**
   * 添加分数
   * @param {number} points - 分数
   */
  addScore(points) {
    const oldScore = this.score;
    this.score += points;
    
    this.emit(GAME_EVENTS.SCORE_UPDATE, {
      score: this.score,
      delta: points
    });
    
    // 检查是否破纪录
    if (!this.isNewHighScore && this.score > this.highScore) {
      this.isNewHighScore = true;
      this.emit(GAME_EVENTS.HIGH_SCORE_BEAT, {
        newScore: this.score,
        oldScore: this.highScore
      });
    }
  }

  /**
   * 检查等级提升
   */
  checkLevelUp() {
    const oldLevel = this.level;
    
    // 找到当前分数对应的等级
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (this.score >= LEVELS[i].score) {
        this.level = LEVELS[i];
        break;
      }
    }
    
    // 如果等级提升，发出事件
    if (this.level.level > oldLevel.level) {
      this.emit(GAME_EVENTS.LEVEL_UP, {
        oldLevel,
        newLevel: this.level
      });
    }
  }

  /**
   * 获取游戏状态快照（用于渲染）
   * @returns {Object}
   */
  getState() {
    return {
      board: this.board.getGridCopy(),
      currentPiece: this.currentPiece,
      nextPiece: this.nextPiece,
      ghostY: this.ghostY,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      highScore: this.highScore,
      isNewHighScore: this.isNewHighScore,
      state: this.state
    };
  }

  // Getters
  get isPlaying() {
    return this.state === GAME_STATES.PLAYING;
  }

  get isPaused() {
    return this.state === GAME_STATES.PAUSED;
  }

  get isGameOver() {
    return this.state === GAME_STATES.GAME_OVER;
  }

  get isIdle() {
    return this.state === GAME_STATES.IDLE;
  }
}

export default Game;

