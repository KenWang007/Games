/**
 * 存档管理器
 * 使用 localStorage 保存游戏进度
 */

const STORAGE_KEY = 'pvz_save_data';
const STORAGE_VERSION = 1;

export class Storage {
    constructor() {
        this.isAvailable = this.checkAvailability();
        this.data = this.load();
    }
    
    /**
     * 检查 localStorage 是否可用
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }
    
    /**
     * 获取默认存档数据
     */
    getDefaultData() {
        return {
            version: STORAGE_VERSION,
            currentLevel: 1,
            maxUnlockedLevel: 1,
            levelStars: {}, // { levelId: stars }
            totalStars: 0,
            unlockedPlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater', 'gatlingpea', 'poisonpea', 'firepea'],
            settings: {
                musicEnabled: true,
                sfxEnabled: true,
                musicVolume: 0.3,
                sfxVolume: 0.5,
                difficulty: 'normal' // 默认普通难度
            },
            statistics: {
                totalGamesPlayed: 0,
                totalWins: 0,
                totalLosses: 0,
                totalZombiesKilled: 0,
                totalSunCollected: 0,
                totalPlantsPlanted: 0,
                playTime: 0 // 秒
            },
            achievements: [],
            lastPlayed: null
        };
    }
    
    /**
     * 加载存档
     */
    load() {
        if (!this.isAvailable) {
            return this.getDefaultData();
        }
        
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                return this.getDefaultData();
            }
            
            const data = JSON.parse(saved);
            
            // 版本迁移
            if (data.version !== STORAGE_VERSION) {
                return this.migrate(data);
            }
            
            return { ...this.getDefaultData(), ...data };
        } catch (e) {
            console.warn('Failed to load save data:', e);
            return this.getDefaultData();
        }
    }
    
    /**
     * 保存存档
     */
    save() {
        if (!this.isAvailable) return false;
        
        try {
            this.data.lastPlayed = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.warn('Failed to save data:', e);
            return false;
        }
    }
    
    /**
     * 版本迁移
     */
    migrate(oldData) {
        // 目前只有版本1，直接返回默认数据并保留部分字段
        const newData = this.getDefaultData();
        
        if (oldData.currentLevel) newData.currentLevel = oldData.currentLevel;
        if (oldData.maxUnlockedLevel) newData.maxUnlockedLevel = oldData.maxUnlockedLevel;
        if (oldData.levelStars) newData.levelStars = oldData.levelStars;
        if (oldData.settings) newData.settings = { ...newData.settings, ...oldData.settings };
        
        return newData;
    }
    
    /**
     * 重置存档
     */
    reset() {
        this.data = this.getDefaultData();
        this.save();
    }
    
    // ========== 关卡相关 ==========
    
    /**
     * 获取当前关卡
     */
    getCurrentLevel() {
        return this.data.currentLevel;
    }
    
    /**
     * 设置当前关卡
     */
    setCurrentLevel(level) {
        this.data.currentLevel = level;
        this.save();
    }
    
    /**
     * 获取最大解锁关卡
     */
    getMaxUnlockedLevel() {
        return this.data.maxUnlockedLevel;
    }
    
    /**
     * 解锁关卡
     */
    unlockLevel(level) {
        if (level > this.data.maxUnlockedLevel) {
            this.data.maxUnlockedLevel = level;
            this.save();
        }
    }
    
    /**
     * 检查关卡是否解锁
     */
    isLevelUnlocked(level) {
        return level <= this.data.maxUnlockedLevel;
    }
    
    /**
     * 设置关卡星级
     */
    setLevelStars(levelId, stars) {
        const currentStars = this.data.levelStars[levelId] || 0;
        if (stars > currentStars) {
            this.data.levelStars[levelId] = stars;
            this.updateTotalStars();
            this.save();
        }
    }
    
    /**
     * 获取关卡星级
     */
    getLevelStars(levelId) {
        return this.data.levelStars[levelId] || 0;
    }
    
    /**
     * 更新总星数
     */
    updateTotalStars() {
        this.data.totalStars = Object.values(this.data.levelStars).reduce((sum, s) => sum + s, 0);
    }
    
    /**
     * 获取总星数
     */
    getTotalStars() {
        return this.data.totalStars;
    }
    
    // ========== 植物相关 ==========
    
    /**
     * 解锁植物
     */
    unlockPlant(plantId) {
        if (!this.data.unlockedPlants.includes(plantId)) {
            this.data.unlockedPlants.push(plantId);
            this.save();
        }
    }
    
    /**
     * 检查植物是否解锁
     */
    isPlantUnlocked(plantId) {
        return this.data.unlockedPlants.includes(plantId);
    }
    
    /**
     * 获取已解锁植物列表
     */
    getUnlockedPlants() {
        return [...this.data.unlockedPlants];
    }
    
    // ========== 设置相关 ==========
    
    /**
     * 获取设置
     */
    getSettings() {
        return { ...this.data.settings };
    }
    
    /**
     * 更新设置
     */
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.save();
    }
    
    /**
     * 获取音乐开关状态
     */
    isMusicEnabled() {
        return this.data.settings.musicEnabled;
    }
    
    /**
     * 设置音乐开关
     */
    setMusicEnabled(enabled) {
        this.data.settings.musicEnabled = enabled;
        this.save();
    }
    
    /**
     * 获取音效开关状态
     */
    isSfxEnabled() {
        return this.data.settings.sfxEnabled;
    }
    
    /**
     * 设置音效开关
     */
    setSfxEnabled(enabled) {
        this.data.settings.sfxEnabled = enabled;
        this.save();
    }
    
    // ========== 统计相关 ==========
    
    /**
     * 获取统计数据
     */
    getStatistics() {
        return { ...this.data.statistics };
    }
    
    /**
     * 记录游戏完成
     */
    recordGameComplete(won, zombiesKilled, sunCollected, plantsPlanted) {
        this.data.statistics.totalGamesPlayed++;
        if (won) {
            this.data.statistics.totalWins++;
        } else {
            this.data.statistics.totalLosses++;
        }
        this.data.statistics.totalZombiesKilled += zombiesKilled;
        this.data.statistics.totalSunCollected += sunCollected;
        this.data.statistics.totalPlantsPlanted += plantsPlanted;
        this.save();
    }
    
    /**
     * 更新游戏时间
     */
    addPlayTime(seconds) {
        this.data.statistics.playTime += seconds;
        this.save();
    }
    
    // ========== 成就相关 ==========
    
    /**
     * 解锁成就
     */
    unlockAchievement(achievementId) {
        if (!this.data.achievements.includes(achievementId)) {
            this.data.achievements.push(achievementId);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * 检查成就是否解锁
     */
    hasAchievement(achievementId) {
        return this.data.achievements.includes(achievementId);
    }
    
    /**
     * 获取所有成就
     */
    getAchievements() {
        return [...this.data.achievements];
    }
    
    // ========== 导出/导入 ==========
    
    /**
     * 导出存档为JSON字符串
     */
    exportSave() {
        return JSON.stringify(this.data, null, 2);
    }
    
    /**
     * 导入存档
     */
    importSave(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.version) {
                this.data = { ...this.getDefaultData(), ...data };
                this.save();
                return true;
            }
        } catch (e) {
            console.warn('Failed to import save:', e);
        }
        return false;
    }
}

