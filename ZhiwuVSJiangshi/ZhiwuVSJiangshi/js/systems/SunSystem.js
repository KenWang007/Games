/**
 * 阳光管理系统
 */

import { Sun } from '../entities/Sun.js';
import { ObjectPool } from '../utils/ObjectPool.js';
import { 
    SKY_SUN_INTERVAL, 
    SUN_VALUE, 
    GRID_OFFSET_X, 
    GRID_OFFSET_Y,
    CELL_WIDTH,
    CELL_HEIGHT,
    GRID_COLS,
    GRID_ROWS,
    CANVAS_WIDTH
} from '../config/constants.js';

export class SunSystem {
    constructor() {
        this.suns = [];
        this.sunCount = 50;
        this.skySunTimer = SKY_SUN_INTERVAL * 0.3; // 首次掉落快一些
        this.difficultyConfig = null;
        
        // 阳光计数器位置（用于收集动画目标）
        this.counterX = 70;
        this.counterY = 45;
        
        // 对象池
        this.sunPool = new ObjectPool(
            () => new Sun(0, 0),
            (sun) => sun.reset(),
            20
        );
    }
    
    /**
     * 重置系统
     */
    reset(initialSun = 50, difficultyConfig = null) {
        this.difficultyConfig = difficultyConfig;
        this.sunCount = initialSun;
        
        // 根据难度调整阳光掉落间隔
        const sunInterval = difficultyConfig 
            ? SKY_SUN_INTERVAL / difficultyConfig.sunProductionMultiplier
            : SKY_SUN_INTERVAL;
        this.skySunTimer = sunInterval * 0.3;
        
        // 清理所有阳光
        for (const sun of this.suns) {
            this.sunPool.release(sun);
        }
        this.suns = [];
    }
    
    /**
     * 更新阳光系统
     */
    update(deltaTime) {
        // 更新天空掉落计时
        const sunInterval = this.difficultyConfig 
            ? SKY_SUN_INTERVAL / this.difficultyConfig.sunProductionMultiplier
            : SKY_SUN_INTERVAL;
        
        this.skySunTimer += deltaTime;
        if (this.skySunTimer >= sunInterval) {
            this.spawnSkySun();
            this.skySunTimer = 0;
        }
        
        // 更新所有阳光
        for (let i = this.suns.length - 1; i >= 0; i--) {
            const sun = this.suns[i];
            sun.update(deltaTime);
            
            // 移除过期或已收集的阳光
            if (!sun.active || sun.isExpired()) {
                this.sunPool.release(sun);
                this.suns.splice(i, 1);
            }
        }
    }
    
    /**
     * 生成天空掉落的阳光
     */
    spawnSkySun() {
        // 随机位置
        const x = GRID_OFFSET_X + Math.random() * (GRID_COLS * CELL_WIDTH);
        const startY = -50;
        const targetY = GRID_OFFSET_Y + Math.random() * (GRID_ROWS * CELL_HEIGHT);
        
        // 天空阳光价值也固定为25，保持游戏平衡
        const sunValue = SUN_VALUE;
        
        const sun = this.sunPool.get();
        sun.x = x;
        sun.y = startY;
        sun.targetY = targetY;
        sun.isFalling = true;
        sun.value = sunValue;
        sun.age = 0;
        sun.width = 50;
        sun.height = 50;
        sun.active = true;
        
        this.suns.push(sun);
    }
    
    /**
     * 在指定位置生成阳光（向日葵产生）
     */
    spawnSunAt(x, y, value = SUN_VALUE) {
        // 向日葵产生的阳光价值固定为25，不受难度影响
        const sunValue = value;
        
        const sun = this.sunPool.get();
        sun.x = x;
        sun.y = y - 20; // 稍微向上弹出
        sun.targetY = y + 20;
        sun.isFalling = true;
        sun.value = sunValue;
        sun.age = 0;
        sun.width = 50;
        sun.height = 50;
        sun.active = true;
        
        this.suns.push(sun);
    }
    
    /**
     * 尝试收集指定位置的阳光
     */
    tryCollect(x, y) {
        for (const sun of this.suns) {
            if (sun.active && !sun.isCollecting && sun.containsPoint(x, y)) {
                sun.collect(this.counterX, this.counterY);
                this.sunCount += sun.value;
                return sun.value;
            }
        }
        return 0;
    }
    
    /**
     * 消耗阳光
     */
    spend(amount) {
        if (this.sunCount >= amount) {
            this.sunCount -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * 检查是否有足够阳光
     */
    canAfford(amount) {
        return this.sunCount >= amount;
    }
    
    /**
     * 获取当前阳光数量
     */
    getSunCount() {
        return this.sunCount;
    }
    
    /**
     * 设置阳光数量
     */
    setSunCount(count) {
        this.sunCount = count;
    }
    
    /**
     * 渲染所有阳光
     */
    render(ctx) {
        for (const sun of this.suns) {
            sun.render(ctx);
        }
    }
}

