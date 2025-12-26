/**
 * 工具函数集合
 */

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 数组
 * @returns {*}
 */
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 深拷贝对象或数组
 * @param {*} obj - 要拷贝的对象
 * @returns {*}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 顺时针旋转二维矩阵90度
 * @param {Array<Array>} matrix - 二维矩阵
 * @returns {Array<Array>}
 */
export function rotateMatrixCW(matrix) {
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

/**
 * 逆时针旋转二维矩阵90度
 * @param {Array<Array>} matrix - 二维矩阵
 * @returns {Array<Array>}
 */
export function rotateMatrixCCW(matrix) {
  const n = matrix.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      result[i][j] = matrix[j][n - 1 - i];
    }
  }
  return result;
}

/**
 * 限制数值在指定范围内
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 线性插值
 * @param {number} a - 起始值
 * @param {number} b - 结束值
 * @param {number} t - 插值因子 (0-1)
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * 格式化数字（添加千位分隔符）
 * @param {number} num - 数字
 * @returns {string}
 */
export function formatNumber(num) {
  return num.toLocaleString('zh-CN');
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 创建二维数组
 * @param {number} rows - 行数
 * @param {number} cols - 列数
 * @param {*} defaultValue - 默认值
 * @returns {Array<Array>}
 */
export function create2DArray(rows, cols, defaultValue = null) {
  return Array(rows).fill(null).map(() => Array(cols).fill(defaultValue));
}

/**
 * 获取设备像素比
 * @returns {number}
 */
export function getDevicePixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * 设置Canvas高DPI支持
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} width - 逻辑宽度
 * @param {number} height - 逻辑高度
 * @returns {CanvasRenderingContext2D}
 */
export function setupHighDPICanvas(canvas, width, height) {
  const dpr = getDevicePixelRatio();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * 检测是否为触摸设备
 * @returns {boolean}
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 简单的UUID生成
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

