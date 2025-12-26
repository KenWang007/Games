/**
 * Tetromino - 俄罗斯方块类
 * 管理方块的形状、位置和旋转
 */
import { 
  TETROMINO_TYPES, 
  TETROMINO_SHAPES, 
  TETROMINO_COLORS,
  WALL_KICK_DATA,
  BOARD_WIDTH
} from './constants.js';
import { randomChoice, deepClone } from '../utils/helpers.js';

export class Tetromino {
  /**
   * @param {string} type - 方块类型 (I, O, T, S, Z, J, L)
   */
  constructor(type) {
    this.type = type;
    this.color = TETROMINO_COLORS[type];
    this.rotation = 0;  // 0, 1, 2, 3
    this.shapes = TETROMINO_SHAPES[type];
    
    // 初始位置（面板顶部中央）
    this.x = Math.floor((BOARD_WIDTH - this.shape[0].length) / 2);
    this.y = type === 'I' ? -1 : 0;  // I方块需要更高的起始位置
  }

  /**
   * 获取当前旋转状态的形状
   * @returns {Array<Array<number>>}
   */
  get shape() {
    return this.shapes[this.rotation];
  }

  /**
   * 获取方块的宽度
   * @returns {number}
   */
  get width() {
    return this.shape[0].length;
  }

  /**
   * 获取方块的高度
   * @returns {number}
   */
  get height() {
    return this.shape.length;
  }

  /**
   * 顺时针旋转
   * @returns {number} 新的旋转状态
   */
  rotateCW() {
    const oldRotation = this.rotation;
    this.rotation = (this.rotation + 1) % 4;
    return oldRotation;
  }

  /**
   * 逆时针旋转
   * @returns {number} 新的旋转状态
   */
  rotateCCW() {
    const oldRotation = this.rotation;
    this.rotation = (this.rotation + 3) % 4;
    return oldRotation;
  }

  /**
   * 设置旋转状态
   * @param {number} rotation - 旋转状态 (0-3)
   */
  setRotation(rotation) {
    this.rotation = rotation % 4;
  }

  /**
   * 获取踢墙偏移数据
   * @param {number} fromRotation - 原始旋转状态
   * @param {number} toRotation - 目标旋转状态
   * @returns {Array<Array<number>>} 偏移数组
   */
  getWallKickData(fromRotation, toRotation) {
    const key = `${fromRotation}->${toRotation}`;
    const kickData = this.type === 'I' 
      ? WALL_KICK_DATA.I 
      : WALL_KICK_DATA.JLSTZ;
    return kickData[key] || [[0, 0]];
  }

  /**
   * 移动方块
   * @param {number} dx - X方向偏移
   * @param {number} dy - Y方向偏移
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  /**
   * 设置位置
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 获取方块占用的所有格子坐标
   * @returns {Array<{x: number, y: number}>}
   */
  getCells() {
    const cells = [];
    const shape = this.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          cells.push({
            x: this.x + col,
            y: this.y + row
          });
        }
      }
    }
    return cells;
  }

  /**
   * 克隆方块
   * @returns {Tetromino}
   */
  clone() {
    const cloned = new Tetromino(this.type);
    cloned.rotation = this.rotation;
    cloned.x = this.x;
    cloned.y = this.y;
    return cloned;
  }

  /**
   * 随机生成一个方块
   * @returns {Tetromino}
   */
  static random() {
    const type = randomChoice(TETROMINO_TYPES);
    return new Tetromino(type);
  }

  /**
   * 创建7-bag随机生成器
   * 确保每7个方块包含所有类型各一次
   * @returns {Generator<Tetromino>}
   */
  static *bagGenerator() {
    while (true) {
      // 创建一个包含所有类型的bag
      const bag = [...TETROMINO_TYPES];
      // Fisher-Yates洗牌
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      // 依次返回bag中的方块
      for (const type of bag) {
        yield new Tetromino(type);
      }
    }
  }
}

export default Tetromino;

