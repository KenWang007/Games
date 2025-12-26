/**
 * StorageSystem - 本地存储系统
 * 管理历史记录和用户设置
 */
import { STORAGE_KEYS } from '../game/constants.js';

export class StorageSystem {
  constructor() {
    this.available = this.checkAvailability();
  }

  /**
   * 检查localStorage是否可用
   * @returns {boolean}
   */
  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e.message);
      return false;
    }
  }

  /**
   * 是否可用
   * @returns {boolean}
   */
  get isAvailable() {
    return this.available;
  }

  /**
   * 获取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  get(key, defaultValue = null) {
    if (!this.available) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * 设置数据
   * @param {string} key - 键名
   * @param {*} value - 值
   * @returns {boolean}
   */
  set(key, value) {
    if (!this.available) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key}:`, e);
      return false;
    }
  }

  /**
   * 获取历史最高分
   * @returns {number}
   */
  getHighScore() {
    return this.get(STORAGE_KEYS.HIGH_SCORE, 0);
  }

  /**
   * 设置历史最高分
   * @param {number} score
   * @returns {boolean}
   */
  setHighScore(score) {
    if (typeof score !== 'number' || score < 0) {
      return false;
    }
    return this.set(STORAGE_KEYS.HIGH_SCORE, Math.floor(score));
  }

  /**
   * 检查是否是新纪录
   * @param {number} score
   * @returns {boolean}
   */
  isNewHighScore(score) {
    return score > this.getHighScore();
  }

  /**
   * 获取最近得分记录
   * @param {number} limit - 返回数量
   * @returns {Array}
   */
  getRecentScores(limit = 5) {
    const records = this.get(STORAGE_KEYS.RECENT_SCORES, []);
    return records.slice(0, limit);
  }

  /**
   * 添加得分记录
   * @param {Object} record - 记录对象
   * @returns {boolean}
   */
  addScoreRecord(record) {
    if (!this.validateRecord(record)) {
      console.error('Invalid score record:', record);
      return false;
    }
    
    const records = this.getRecentScores(10);
    
    records.unshift({
      score: record.score,
      level: record.level,
      lines: record.lines,
      date: record.date || new Date().toISOString()
    });
    
    // 只保留最近5条
    const trimmed = records.slice(0, 5);
    
    return this.set(STORAGE_KEYS.RECENT_SCORES, trimmed);
  }

  /**
   * 验证记录格式
   * @param {Object} record
   * @returns {boolean}
   */
  validateRecord(record) {
    return (
      typeof record === 'object' &&
      typeof record.score === 'number' &&
      typeof record.level === 'number' &&
      typeof record.lines === 'number' &&
      record.score >= 0 &&
      record.level >= 1 &&
      record.lines >= 0
    );
  }

  /**
   * 清除得分记录
   * @returns {boolean}
   */
  clearScoreRecords() {
    return this.set(STORAGE_KEYS.RECENT_SCORES, []);
  }

  /**
   * 获取用户设置
   * @returns {Object}
   */
  getSettings() {
    const defaults = {
      musicEnabled: true,
      soundEnabled: true,
      musicVolume: 0.5,
      soundVolume: 0.8
    };
    
    const saved = this.get(STORAGE_KEYS.SETTINGS, {});
    return { ...defaults, ...saved };
  }

  /**
   * 更新用户设置
   * @param {Object} partial - 部分设置
   * @returns {boolean}
   */
  updateSettings(partial) {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    
    // 验证值范围
    updated.musicVolume = Math.max(0, Math.min(1, updated.musicVolume));
    updated.soundVolume = Math.max(0, Math.min(1, updated.soundVolume));
    updated.musicEnabled = Boolean(updated.musicEnabled);
    updated.soundEnabled = Boolean(updated.soundEnabled);
    
    return this.set(STORAGE_KEYS.SETTINGS, updated);
  }

  /**
   * 重置设置为默认值
   * @returns {boolean}
   */
  resetSettings() {
    return this.set(STORAGE_KEYS.SETTINGS, {
      musicEnabled: true,
      soundEnabled: true,
      musicVolume: 0.5,
      soundVolume: 0.8
    });
  }

  /**
   * 导出所有数据
   * @returns {Object}
   */
  exportData() {
    return {
      version: '1.0.0',
      highScore: this.getHighScore(),
      recentScores: this.getRecentScores(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * 导入数据
   * @param {Object} data
   * @returns {boolean}
   */
  importData(data) {
    if (!data || typeof data !== 'object') {
      console.error('Invalid import data');
      return false;
    }
    
    try {
      if (typeof data.highScore === 'number') {
        this.setHighScore(data.highScore);
      }
      
      if (Array.isArray(data.recentScores)) {
        this.set(STORAGE_KEYS.RECENT_SCORES, data.recentScores.slice(0, 5));
      }
      
      if (data.settings) {
        this.updateSettings(data.settings);
      }
      
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  }

  /**
   * 清除所有数据
   * @returns {boolean}
   */
  clearAll() {
    if (!this.available) return false;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
      localStorage.removeItem(STORAGE_KEYS.RECENT_SCORES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return true;
    } catch (e) {
      console.error('Error clearing data:', e);
      return false;
    }
  }
}

export default StorageSystem;

