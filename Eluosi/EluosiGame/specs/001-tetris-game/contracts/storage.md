# Contract: Storage System

**Module**: `js/systems/StorageSystem.js`  
**Version**: 1.0.0  
**Date**: 2025-12-22

## 1. Overview

存储系统负责管理游戏数据的持久化，包括历史最高分、最近游戏记录和用户设置。使用 localStorage 作为存储后端，并提供优雅的降级处理。

## 2. Public Interface

### 2.1 StorageSystem

```typescript
class StorageSystem {
  constructor(): StorageSystem
  
  /**
   * 检查存储是否可用
   */
  readonly isAvailable: boolean;
  
  // === 高分记录 ===
  
  /**
   * 获取历史最高分
   */
  getHighScore(): number;
  
  /**
   * 设置历史最高分
   * @returns 是否保存成功
   */
  setHighScore(score: number): boolean;
  
  /**
   * 检查是否打破记录
   */
  isNewHighScore(score: number): boolean;
  
  // === 游戏记录 ===
  
  /**
   * 获取最近游戏记录
   * @param limit 返回数量，默认5
   */
  getRecentScores(limit?: number): ScoreRecord[];
  
  /**
   * 添加游戏记录
   */
  addScoreRecord(record: ScoreRecord): boolean;
  
  /**
   * 清除所有游戏记录
   */
  clearScoreRecords(): boolean;
  
  // === 用户设置 ===
  
  /**
   * 获取用户设置
   */
  getSettings(): Settings;
  
  /**
   * 更新用户设置
   */
  updateSettings(settings: Partial<Settings>): boolean;
  
  /**
   * 重置设置为默认值
   */
  resetSettings(): boolean;
  
  // === 通用方法 ===
  
  /**
   * 清除所有游戏数据
   */
  clearAll(): boolean;
  
  /**
   * 导出所有数据（用于备份）
   */
  exportData(): GameData;
  
  /**
   * 导入数据（用于恢复）
   */
  importData(data: GameData): boolean;
}
```

## 3. Data Types

### 3.1 ScoreRecord

```typescript
interface ScoreRecord {
  score: number;       // 得分
  level: number;       // 达到的等级
  lines: number;       // 消除行数
  date: string;        // ISO 8601 格式日期时间
}
```

### 3.2 Settings

```typescript
interface Settings {
  musicEnabled: boolean;   // 背景音乐开关，默认 true
  soundEnabled: boolean;   // 音效开关，默认 true
  musicVolume: number;     // 音乐音量 0-1，默认 0.5
  soundVolume: number;     // 音效音量 0-1，默认 0.8
}
```

### 3.3 GameData

```typescript
interface GameData {
  version: string;         // 数据版本号
  highScore: number;
  recentScores: ScoreRecord[];
  settings: Settings;
  exportedAt: string;      // 导出时间
}
```

## 4. Storage Keys

| 键名 | 类型 | 描述 |
|------|------|------|
| `tetris_highScore` | `number` | 历史最高分 |
| `tetris_recentScores` | `ScoreRecord[]` | 最近游戏记录（最多5条） |
| `tetris_settings` | `Settings` | 用户设置 |

## 5. Default Values

```javascript
const DEFAULTS = {
  highScore: 0,
  recentScores: [],
  settings: {
    musicEnabled: true,
    soundEnabled: true,
    musicVolume: 0.5,
    soundVolume: 0.8
  }
};
```

## 6. Implementation

### 6.1 可用性检测

```javascript
class StorageSystem {
  constructor() {
    this._available = this._checkAvailability();
  }
  
  _checkAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      // 隐私模式或存储已满
      console.warn('localStorage not available:', e.message);
      return false;
    }
  }
  
  get isAvailable() {
    return this._available;
  }
}
```

### 6.2 安全读写

```javascript
_get(key, defaultValue) {
  if (!this._available) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return defaultValue;
  }
}

_set(key, value) {
  if (!this._available) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
    // 可能是存储已满
    if (e.name === 'QuotaExceededError') {
      this._handleQuotaExceeded();
    }
    return false;
  }
}

_handleQuotaExceeded() {
  // 清理旧记录以释放空间
  const records = this.getRecentScores();
  if (records.length > 3) {
    this._set(KEYS.RECENT_SCORES, records.slice(0, 3));
  }
}
```

### 6.3 高分管理

```javascript
getHighScore() {
  return this._get(KEYS.HIGH_SCORE, DEFAULTS.highScore);
}

setHighScore(score) {
  if (typeof score !== 'number' || score < 0) {
    console.error('Invalid score:', score);
    return false;
  }
  return this._set(KEYS.HIGH_SCORE, Math.floor(score));
}

isNewHighScore(score) {
  return score > this.getHighScore();
}
```

### 6.4 记录管理

```javascript
getRecentScores(limit = 5) {
  const records = this._get(KEYS.RECENT_SCORES, DEFAULTS.recentScores);
  return records.slice(0, limit);
}

addScoreRecord(record) {
  // 验证记录格式
  if (!this._validateRecord(record)) {
    console.error('Invalid score record:', record);
    return false;
  }
  
  const records = this.getRecentScores();
  
  // 添加新记录到开头
  records.unshift({
    score: record.score,
    level: record.level,
    lines: record.lines,
    date: record.date || new Date().toISOString()
  });
  
  // 只保留最近5条
  const trimmed = records.slice(0, 5);
  
  return this._set(KEYS.RECENT_SCORES, trimmed);
}

_validateRecord(record) {
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
```

### 6.5 设置管理

```javascript
getSettings() {
  const saved = this._get(KEYS.SETTINGS, {});
  // 合并默认值，确保所有字段存在
  return { ...DEFAULTS.settings, ...saved };
}

updateSettings(partial) {
  const current = this.getSettings();
  const updated = { ...current, ...partial };
  
  // 验证值范围
  updated.musicVolume = Math.max(0, Math.min(1, updated.musicVolume));
  updated.soundVolume = Math.max(0, Math.min(1, updated.soundVolume));
  updated.musicEnabled = Boolean(updated.musicEnabled);
  updated.soundEnabled = Boolean(updated.soundEnabled);
  
  return this._set(KEYS.SETTINGS, updated);
}

resetSettings() {
  return this._set(KEYS.SETTINGS, DEFAULTS.settings);
}
```

### 6.6 数据导入导出

```javascript
exportData() {
  return {
    version: '1.0.0',
    highScore: this.getHighScore(),
    recentScores: this.getRecentScores(),
    settings: this.getSettings(),
    exportedAt: new Date().toISOString()
  };
}

importData(data) {
  // 验证数据格式
  if (!data || typeof data !== 'object') {
    console.error('Invalid import data');
    return false;
  }
  
  try {
    if (typeof data.highScore === 'number') {
      this.setHighScore(data.highScore);
    }
    
    if (Array.isArray(data.recentScores)) {
      this._set(KEYS.RECENT_SCORES, data.recentScores.slice(0, 5));
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
```

## 7. Error Handling

| 场景 | 处理方式 |
|------|----------|
| localStorage 不可用 | 返回默认值，操作返回 false |
| JSON 解析失败 | 返回默认值，记录错误日志 |
| 存储配额超限 | 清理旧记录，重试写入 |
| 无效数据格式 | 拒绝操作，记录错误日志 |

## 8. Migration

当数据结构变更时的迁移策略：

```javascript
const CURRENT_VERSION = '1.0.0';

_migrate() {
  const version = this._get('tetris_version', '0.0.0');
  
  if (version === CURRENT_VERSION) return;
  
  // 版本迁移逻辑
  if (this._compareVersions(version, '1.0.0') < 0) {
    // 从旧版本迁移
    this._migrateToV1();
  }
  
  this._set('tetris_version', CURRENT_VERSION);
}

_compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (partsA[i] > partsB[i]) return 1;
    if (partsA[i] < partsB[i]) return -1;
  }
  return 0;
}
```

## 9. Usage Example

```javascript
import { StorageSystem } from './systems/StorageSystem.js';

const storage = new StorageSystem();

// 检查存储可用性
if (!storage.isAvailable) {
  showWarning('游戏记录无法保存（隐私模式）');
}

// 游戏结束时保存记录
function onGameOver(stats) {
  // 检查是否破纪录
  if (storage.isNewHighScore(stats.score)) {
    storage.setHighScore(stats.score);
    triggerFireworks();
  }
  
  // 添加游戏记录
  storage.addScoreRecord({
    score: stats.score,
    level: stats.level,
    lines: stats.linesCleared
  });
}

// 显示历史记录
function showHistory() {
  const records = storage.getRecentScores();
  records.forEach((record, index) => {
    console.log(`${index + 1}. ${record.score}分 - Lv.${record.level}`);
  });
}

// 音频设置
function toggleMusic() {
  const settings = storage.getSettings();
  storage.updateSettings({ musicEnabled: !settings.musicEnabled });
}

// 导出/导入（用于跨设备同步）
function exportSave() {
  const data = storage.exportData();
  const json = JSON.stringify(data, null, 2);
  downloadFile('tetris-save.json', json);
}

function importSave(file) {
  const data = JSON.parse(file);
  if (storage.importData(data)) {
    showMessage('存档导入成功！');
  }
}
```

## 10. Testing

```javascript
describe('StorageSystem', () => {
  let storage;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new StorageSystem();
  });
  
  test('should return default high score when empty', () => {
    expect(storage.getHighScore()).toBe(0);
  });
  
  test('should save and retrieve high score', () => {
    storage.setHighScore(5000);
    expect(storage.getHighScore()).toBe(5000);
  });
  
  test('should detect new high score', () => {
    storage.setHighScore(1000);
    expect(storage.isNewHighScore(500)).toBe(false);
    expect(storage.isNewHighScore(1500)).toBe(true);
  });
  
  test('should limit recent scores to 5', () => {
    for (let i = 0; i < 10; i++) {
      storage.addScoreRecord({ score: i * 100, level: 1, lines: i });
    }
    expect(storage.getRecentScores().length).toBe(5);
  });
  
  test('should merge settings with defaults', () => {
    storage.updateSettings({ musicEnabled: false });
    const settings = storage.getSettings();
    expect(settings.musicEnabled).toBe(false);
    expect(settings.soundEnabled).toBe(true); // 默认值
  });
});
```

