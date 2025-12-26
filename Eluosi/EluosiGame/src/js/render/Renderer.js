/**
 * Renderer - Canvas游戏渲染器
 * 负责绘制游戏面板和方块
 */
import { 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  CELL_SIZE,
  COLORS,
  TETROMINO_COLORS
} from '../game/constants.js';
import { setupHighDPICanvas, getDevicePixelRatio } from '../utils/helpers.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas - 游戏画布
   * @param {Object} options - 配置选项
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = null;
    
    this.cellSize = options.cellSize || CELL_SIZE;
    this.padding = options.padding || 2;
    this.borderRadius = options.borderRadius || 4;
    this.showGrid = options.showGrid !== false;
    this.showGhost = options.showGhost !== false;
    
    this.width = BOARD_WIDTH * this.cellSize;
    this.height = BOARD_HEIGHT * this.cellSize;
    
    this.init();
  }

  /**
   * 初始化Canvas
   */
  init() {
    this.ctx = setupHighDPICanvas(this.canvas, this.width, this.height);
  }

  /**
   * 调整大小
   * @param {number} cellSize - 新的单元格大小
   */
  resize(cellSize) {
    this.cellSize = cellSize;
    this.width = BOARD_WIDTH * this.cellSize;
    this.height = BOARD_HEIGHT * this.cellSize;
    this.ctx = setupHighDPICanvas(this.canvas, this.width, this.height);
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 渲染完整的游戏画面
   * @param {Object} state - 游戏状态
   */
  render(state) {
    this.clear();
    
    // 绘制背景和网格
    this.drawBackground();
    if (this.showGrid) {
      this.drawGrid();
    }
    
    // 绘制已锁定的方块
    this.drawBoard(state.board);
    
    // 绘制幽灵方块
    if (this.showGhost && state.currentPiece) {
      this.drawGhostPiece(state.currentPiece, state.ghostY);
    }
    
    // 绘制当前方块
    if (state.currentPiece) {
      this.drawPiece(state.currentPiece);
    }
  }

  /**
   * 绘制背景
   */
  drawBackground() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * 绘制网格线
   */
  drawGrid() {
    this.ctx.strokeStyle = COLORS.GRID_LINE;
    this.ctx.lineWidth = 1;
    
    // 垂直线
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize + 0.5, 0);
      this.ctx.lineTo(x * this.cellSize + 0.5, this.height);
      this.ctx.stroke();
    }
    
    // 水平线
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize + 0.5);
      this.ctx.lineTo(this.width, y * this.cellSize + 0.5);
      this.ctx.stroke();
    }
  }

  /**
   * 绘制游戏面板（已锁定的方块）
   * @param {Array<Array<string|null>>} board - 面板数据
   */
  drawBoard(board) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const color = board[y][x];
        if (color) {
          this.drawCell(x, y, color);
        }
      }
    }
  }

  /**
   * 绘制方块
   * @param {Tetromino} piece - 方块对象
   */
  drawPiece(piece) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = piece.x + col;
          const y = piece.y + row;
          if (y >= 0) {  // 只绘制可见部分
            this.drawCell(x, y, piece.color);
          }
        }
      }
    }
  }

  /**
   * 绘制幽灵方块（预测落点）
   * @param {Tetromino} piece - 方块对象
   * @param {number} ghostY - 幽灵Y坐标
   */
  drawGhostPiece(piece, ghostY) {
    if (ghostY === piece.y) return;  // 已经在最低点
    
    const shape = piece.shape;
    this.ctx.globalAlpha = 0.3;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = piece.x + col;
          const y = ghostY + row;
          if (y >= 0) {
            this.drawCell(x, y, piece.color, true);
          }
        }
      }
    }
    
    this.ctx.globalAlpha = 1;
  }

  /**
   * 绘制单个格子
   * @param {number} x - 列
   * @param {number} y - 行
   * @param {string} color - 颜色
   * @param {boolean} isGhost - 是否是幽灵方块
   */
  drawCell(x, y, color, isGhost = false) {
    const px = x * this.cellSize + this.padding;
    const py = y * this.cellSize + this.padding;
    const size = this.cellSize - this.padding * 2;
    const radius = this.borderRadius;
    
    // 主体填充
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.roundRect(px, py, size, size, radius);
    this.ctx.fill();
    
    if (!isGhost) {
      // 顶部高光
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.beginPath();
      this.roundRect(px, py, size, size / 3, [radius, radius, 0, 0]);
      this.ctx.fill();
      
      // 底部阴影
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      this.ctx.beginPath();
      this.roundRect(px, py + size * 2/3, size, size / 3, [0, 0, radius, radius]);
      this.ctx.fill();
      
      // 内部光泽
      const gradient = this.ctx.createLinearGradient(px, py, px, py + size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.roundRect(px + 2, py + 2, size - 4, size - 4, radius - 1);
      this.ctx.fill();
    }
  }

  /**
   * 绘制圆角矩形
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {number|Array} radius - 圆角半径
   */
  roundRect(x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = [radius, radius, radius, radius];
    }
    
    const [tl, tr, br, bl] = radius;
    
    this.ctx.moveTo(x + tl, y);
    this.ctx.lineTo(x + width - tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
    this.ctx.lineTo(x + width, y + height - br);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    this.ctx.lineTo(x + bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
    this.ctx.lineTo(x, y + tl);
    this.ctx.quadraticCurveTo(x, y, x + tl, y);
    this.ctx.closePath();
  }

  /**
   * 绘制消行闪烁效果
   * @param {number[]} lines - 要闪烁的行号
   */
  drawLineClearEffect(lines) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const line of lines) {
      this.ctx.fillRect(0, line * this.cellSize, this.width, this.cellSize);
    }
  }
}

export default Renderer;

