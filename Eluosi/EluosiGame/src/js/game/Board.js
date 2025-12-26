/**
 * Board - 游戏面板类
 * 管理10x20的游戏网格
 */
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants.js';
import { create2DArray } from '../utils/helpers.js';

export class Board {
  constructor() {
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.grid = this.createEmptyGrid();
  }

  /**
   * 创建空网格
   * @returns {Array<Array<string|null>>}
   */
  createEmptyGrid() {
    return create2DArray(this.height, this.width, null);
  }

  /**
   * 重置面板
   */
  reset() {
    this.grid = this.createEmptyGrid();
  }

  /**
   * 获取指定位置的格子
   * @param {number} x - 列
   * @param {number} y - 行
   * @returns {string|null} 颜色或null
   */
  getCell(x, y) {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return undefined;  // 超出边界
    }
    return this.grid[y][x];
  }

  /**
   * 设置指定位置的格子
   * @param {number} x - 列
   * @param {number} y - 行
   * @param {string|null} color - 颜色
   */
  setCell(x, y, color) {
    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
      this.grid[y][x] = color;
    }
  }

  /**
   * 检查方块在指定位置是否有效（无碰撞）
   * @param {Tetromino} piece - 方块
   * @param {number} [offsetX=0] - X偏移
   * @param {number} [offsetY=0] - Y偏移
   * @returns {boolean}
   */
  isValidPosition(piece, offsetX = 0, offsetY = 0) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = piece.x + col + offsetX;
          const y = piece.y + row + offsetY;
          
          // 检查左右边界
          if (x < 0 || x >= this.width) {
            return false;
          }
          
          // 检查底部边界
          if (y >= this.height) {
            return false;
          }
          
          // 检查与已有方块的碰撞（y < 0 允许方块从顶部进入）
          if (y >= 0 && this.grid[y][x] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * 尝试旋转方块（带踢墙）
   * @param {Tetromino} piece - 方块
   * @param {boolean} [clockwise=true] - 是否顺时针
   * @returns {boolean} 是否旋转成功
   */
  tryRotate(piece, clockwise = true) {
    const oldRotation = piece.rotation;
    const newRotation = clockwise 
      ? (oldRotation + 1) % 4 
      : (oldRotation + 3) % 4;
    
    // 获取踢墙数据
    const kickData = piece.getWallKickData(oldRotation, newRotation);
    
    // 临时应用旋转
    piece.setRotation(newRotation);
    
    // 尝试每个踢墙偏移
    for (const [dx, dy] of kickData) {
      if (this.isValidPosition(piece, dx, -dy)) {  // 注意：y轴方向相反
        piece.move(dx, -dy);
        return true;
      }
    }
    
    // 所有偏移都失败，恢复原始旋转
    piece.setRotation(oldRotation);
    return false;
  }

  /**
   * 将方块锁定到面板
   * @param {Tetromino} piece - 方块
   * @returns {boolean} 是否成功锁定（如果方块完全在顶部外则返回false）
   */
  lockPiece(piece) {
    const cells = piece.getCells();
    let hasVisibleCell = false;
    
    for (const cell of cells) {
      if (cell.y >= 0) {
        this.grid[cell.y][cell.x] = piece.color;
        hasVisibleCell = true;
      }
    }
    
    return hasVisibleCell;
  }

  /**
   * 检查并清除完整的行
   * @returns {number[]} 被清除的行号数组
   */
  clearLines() {
    const linesToClear = [];
    
    // 从下往上检查
    for (let row = this.height - 1; row >= 0; row--) {
      if (this.isLineFull(row)) {
        linesToClear.push(row);
      }
    }
    
    // 清除行并下落
    if (linesToClear.length > 0) {
      this.removeLines(linesToClear);
    }
    
    return linesToClear;
  }

  /**
   * 检查某行是否已满
   * @param {number} row - 行号
   * @returns {boolean}
   */
  isLineFull(row) {
    return this.grid[row].every(cell => cell !== null);
  }

  /**
   * 移除指定的行并让上方的行下落
   * @param {number[]} rows - 要移除的行号数组（已排序）
   */
  removeLines(rows) {
    // 从下往上移除行
    const sortedRows = [...rows].sort((a, b) => b - a);
    
    for (const row of sortedRows) {
      // 移除该行
      this.grid.splice(row, 1);
      // 在顶部添加新的空行
      this.grid.unshift(Array(this.width).fill(null));
    }
  }

  /**
   * 计算方块的幽灵位置（硬降落点）
   * @param {Tetromino} piece - 方块
   * @returns {number} 幽灵方块的Y坐标
   */
  getGhostY(piece) {
    let ghostY = piece.y;
    while (this.isValidPosition(piece, 0, ghostY - piece.y + 1)) {
      ghostY++;
    }
    return ghostY;
  }

  /**
   * 检查游戏是否结束（顶部被占用）
   * @returns {boolean}
   */
  isGameOver() {
    // 检查最顶部两行是否有方块
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.grid[row][col] !== null) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获取面板的副本
   * @returns {Array<Array<string|null>>}
   */
  getGridCopy() {
    return this.grid.map(row => [...row]);
  }
}

export default Board;

