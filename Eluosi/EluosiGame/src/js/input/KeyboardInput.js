/**
 * KeyboardInput - 键盘输入处理
 * 支持 DAS (Delayed Auto Shift) 和 ARR (Auto Repeat Rate)
 */
export class KeyboardInput {
  constructor() {
    this.keys = new Map();
    this.handlers = new Map();
    this.enabled = true;
    
    // 长按检测（用于下键硬降）
    this.keyDownTime = new Map();  // 记录按键按下的时间
    this.longPressThreshold = 200; // 长按阈值（毫秒）
    this.longPressHandlers = new Map(); // 长按处理函数
    this.longPressTimers = new Map(); // 长按定时器
    
    // DAS/ARR 自动重复移动（用于左右键）
    this.dasDelay = 100;      // 首次延迟（毫秒）- 按下后多久开始自动重复
    this.arrSpeed = 30;       // 自动重复速度（毫秒）- 每次重复的间隔
    this.repeatHandlers = new Map();  // 需要自动重复的处理函数
    this.dasTimers = new Map();       // DAS 延迟定时器
    this.arrIntervals = new Map();    // ARR 重复间隔定时器
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    
    this.init();
  }

  /**
   * 初始化事件监听
   */
  init() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  /**
   * 销毁事件监听
   */
  destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  /**
   * 启用/禁用输入
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * 按键按下处理
   * @param {KeyboardEvent} e
   */
  onKeyDown(e) {
    if (!this.enabled) return;
    
    // 防止按键重复
    if (this.keys.get(e.code)) return;
    this.keys.set(e.code, true);
    this.keyDownTime.set(e.code, Date.now());
    
    // 执行处理函数
    const handler = this.handlers.get(e.code);
    if (handler) {
      e.preventDefault();
      handler('down');
    }
    
    // 检查是否需要自动重复（DAS/ARR）
    const repeatHandler = this.repeatHandlers.get(e.code);
    if (repeatHandler) {
      e.preventDefault();
      // 设置 DAS 延迟定时器
      const dasTimer = setTimeout(() => {
        if (this.keys.get(e.code)) {
          // 开始 ARR 自动重复
          const arrInterval = setInterval(() => {
            if (this.keys.get(e.code) && this.enabled) {
              repeatHandler();
            } else {
              clearInterval(arrInterval);
            }
          }, this.arrSpeed);
          this.arrIntervals.set(e.code, arrInterval);
        }
      }, this.dasDelay);
      this.dasTimers.set(e.code, dasTimer);
    }
    
    // 检查是否有长按处理函数（用于下键硬降）
    const longPressHandler = this.longPressHandlers.get(e.code);
    if (longPressHandler) {
      e.preventDefault();
      // 设置长按定时器
      const timer = setTimeout(() => {
        if (this.keys.get(e.code)) {
          longPressHandler();
        }
      }, this.longPressThreshold);
      this.longPressTimers.set(e.code, timer);
    }
  }

  /**
   * 按键释放处理
   * @param {KeyboardEvent} e
   */
  onKeyUp(e) {
    this.keys.set(e.code, false);
    this.keyDownTime.delete(e.code);
    
    // 清除 DAS 定时器
    const dasTimer = this.dasTimers.get(e.code);
    if (dasTimer) {
      clearTimeout(dasTimer);
      this.dasTimers.delete(e.code);
    }
    
    // 清除 ARR 间隔定时器
    const arrInterval = this.arrIntervals.get(e.code);
    if (arrInterval) {
      clearInterval(arrInterval);
      this.arrIntervals.delete(e.code);
    }
    
    // 清除长按定时器
    const timer = this.longPressTimers.get(e.code);
    if (timer) {
      clearTimeout(timer);
      this.longPressTimers.delete(e.code);
    }
    
    const handler = this.handlers.get(e.code);
    if (handler) {
      handler('up');
    }
  }

  /**
   * 注册按键处理函数
   * @param {string} keyCode - 按键代码
   * @param {Function} handler - 处理函数
   */
  on(keyCode, handler) {
    this.handlers.set(keyCode, handler);
  }

  /**
   * 移除按键处理函数
   * @param {string} keyCode - 按键代码
   */
  off(keyCode) {
    this.handlers.delete(keyCode);
    this.longPressHandlers.delete(keyCode);
    this.repeatHandlers.delete(keyCode);
  }

  /**
   * 注册长按处理函数
   * @param {string} keyCode - 按键代码
   * @param {Function} handler - 长按处理函数
   */
  onLongPress(keyCode, handler) {
    this.longPressHandlers.set(keyCode, handler);
  }

  /**
   * 注册自动重复处理函数（用于左右移动）
   * @param {string} keyCode - 按键代码
   * @param {Function} handler - 重复处理函数
   */
  onRepeat(keyCode, handler) {
    this.repeatHandlers.set(keyCode, handler);
  }

  /**
   * 检查按键是否按下
   * @param {string} keyCode - 按键代码
   * @returns {boolean}
   */
  isPressed(keyCode) {
    return this.keys.get(keyCode) || false;
  }

  /**
   * 绑定游戏控制
   * @param {Game} game - 游戏实例
   */
  bindToGame(game) {
    // 左移 - 首次按下立即移动
    this.on('ArrowLeft', (state) => {
      if (state === 'down') game.moveLeft();
    });
    // 左移 - 持续按住时自动重复
    this.onRepeat('ArrowLeft', () => game.moveLeft());
    
    // 右移 - 首次按下立即移动
    this.on('ArrowRight', (state) => {
      if (state === 'down') game.moveRight();
    });
    // 右移 - 持续按住时自动重复
    this.onRepeat('ArrowRight', () => game.moveRight());
    
    // 软降（短按下移一格）
    this.on('ArrowDown', (state) => {
      if (state === 'down') game.moveDown();
    });
    
    // 长按下键 = 硬降（直接落到底部）
    this.onLongPress('ArrowDown', () => {
      game.hardDrop();
    });
    
    // 旋转（上键）
    this.on('ArrowUp', (state) => {
      if (state === 'down') game.rotate(true);
    });
    
    // 旋转（Z键 - 逆时针）
    this.on('KeyZ', (state) => {
      if (state === 'down') game.rotate(false);
    });
    
    // 旋转（X键 - 顺时针）
    this.on('KeyX', (state) => {
      if (state === 'down') game.rotate(true);
    });
    
    // 硬降（空格）
    this.on('Space', (state) => {
      if (state === 'down') game.hardDrop();
    });
    
    // 暂停（ESC）
    this.on('Escape', (state) => {
      if (state === 'down') {
        if (game.isPlaying) {
          game.pause();
        } else if (game.isPaused) {
          game.resume();
        }
      }
    });
    
    // 暂停（P键）
    this.on('KeyP', (state) => {
      if (state === 'down') {
        if (game.isPlaying) {
          game.pause();
        } else if (game.isPaused) {
          game.resume();
        }
      }
    });
  }
}

export default KeyboardInput;

