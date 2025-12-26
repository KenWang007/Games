/**
 * 僵尸波次管理系统
 */

import { ZOMBIES_CONFIG } from '../config/zombies.js';
import { BasicZombie } from '../entities/zombies/BasicZombie.js';
import { ConeheadZombie } from '../entities/zombies/ConeheadZombie.js';
import { BucketheadZombie } from '../entities/zombies/BucketheadZombie.js';
import { CANVAS_WIDTH, GRID_OFFSET_Y, CELL_HEIGHT } from '../config/constants.js';

export class WaveSystem {
    constructor() {
        this.waves = [];
        this.currentWaveIndex = 0;
        this.gameTime = 0;
        this.zombies = [];
        this.isComplete = false;
        this.totalZombiesSpawned = 0;
        this.totalZombiesToSpawn = 0;
        this.difficultyConfig = null;
    }
    
    /**
     * 初始化波次
     */
    init(levelWaves, difficultyConfig = null) {
        this.waves = levelWaves || [];
        this.currentWaveIndex = 0;
        this.gameTime = 0;
        this.zombies = [];
        this.isComplete = false;
        this.totalZombiesSpawned = 0;
        this.difficultyConfig = difficultyConfig;
        
        // 计算总僵尸数
        this.totalZombiesToSpawn = 0;
        for (const wave of this.waves) {
            this.totalZombiesToSpawn += wave.zombies.length;
        }
    }
    
    /**
     * 重置系统
     */
    reset() {
        this.waves = [];
        this.currentWaveIndex = 0;
        this.gameTime = 0;
        this.zombies = [];
        this.isComplete = false;
        this.totalZombiesSpawned = 0;
        this.totalZombiesToSpawn = 0;
    }
    
    /**
     * 更新波次系统
     */
    update(deltaTime) {
        this.gameTime += deltaTime;
        
        // 检查是否需要生成新波次
        while (this.currentWaveIndex < this.waves.length) {
            const wave = this.waves[this.currentWaveIndex];
            if (this.gameTime >= wave.delay) {
                this.spawnWave(wave);
                this.currentWaveIndex++;
            } else {
                break;
            }
        }
        
        // 更新所有僵尸
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];
            zombie.update(deltaTime);
            
            // 移除死亡的僵尸
            if (!zombie.active) {
                this.zombies.splice(i, 1);
            }
        }
        
        // 检查是否所有波次完成且所有僵尸被消灭
        if (this.currentWaveIndex >= this.waves.length && this.zombies.length === 0) {
            this.isComplete = true;
        }
    }
    
    /**
     * 生成一波僵尸
     */
    spawnWave(wave) {
        for (const zombieData of wave.zombies) {
            const zombie = this.createZombie(zombieData.type, zombieData.lane);
            if (zombie) {
                this.zombies.push(zombie);
                this.totalZombiesSpawned++;
            }
        }
    }
    
    /**
     * 创建僵尸
     */
    createZombie(type, lane) {
        const baseConfig = ZOMBIES_CONFIG[type];
        if (!baseConfig) {
            console.warn(`Unknown zombie type: ${type}`);
            return null;
        }
        
        // 应用难度倍数到配置
        const config = { ...baseConfig };
        if (this.difficultyConfig) {
            config.speed = baseConfig.speed * this.difficultyConfig.zombieSpeedMultiplier;
            config.health = Math.floor(baseConfig.health * this.difficultyConfig.zombieHealthMultiplier);
        }
        
        // 计算位置
        const x = CANVAS_WIDTH + 50 + Math.random() * 50; // 屏幕右侧外
        const y = GRID_OFFSET_Y + lane * CELL_HEIGHT + CELL_HEIGHT / 2;
        
        // 根据类型创建僵尸
        switch (type) {
            case 'basic':
                return new BasicZombie(config, lane, x, y);
            case 'conehead':
                return new ConeheadZombie(config, lane, x, y);
            case 'buckethead':
                return new BucketheadZombie(config, lane, x, y);
            default:
                return new BasicZombie(config, lane, x, y);
        }
    }
    
    /**
     * 获取指定行的僵尸
     */
    getZombiesInRow(row) {
        return this.zombies.filter(z => z.row === row && z.active);
    }
    
    /**
     * 获取所有活动的僵尸
     */
    getActiveZombies() {
        return this.zombies.filter(z => z.active);
    }
    
    /**
     * 检查是否有僵尸到达左侧
     */
    hasZombieReachedEnd() {
        return this.zombies.some(z => z.active && z.hasReachedEnd());
    }
    
    /**
     * 检查所有波次是否完成
     */
    isAllWavesComplete() {
        return this.isComplete;
    }
    
    /**
     * 获取进度信息
     */
    getProgress() {
        const zombiesKilled = this.totalZombiesSpawned - this.zombies.length;
        return {
            currentWave: this.currentWaveIndex,
            totalWaves: this.waves.length,
            zombiesKilled: zombiesKilled,
            totalZombies: this.totalZombiesToSpawn,
            zombiesRemaining: this.zombies.length
        };
    }
    
    /**
     * 渲染所有僵尸
     */
    render(ctx) {
        // 按Y坐标排序，确保正确的遮挡关系
        const sortedZombies = [...this.zombies].sort((a, b) => a.y - b.y);
        for (const zombie of sortedZombies) {
            zombie.render(ctx);
        }
    }
}

