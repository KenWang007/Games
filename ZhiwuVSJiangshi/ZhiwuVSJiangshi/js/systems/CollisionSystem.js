/**
 * 碰撞检测系统
 */

import { GRID_OFFSET_X, CELL_WIDTH, GRID_COLS } from '../config/constants.js';

export class CollisionSystem {
    constructor() {
        // 碰撞检测配置
        this.zombieHitboxWidth = 30;
        this.plantHitboxWidth = 40;
    }
    
    /**
     * 检测子弹与僵尸的碰撞
     * @param {Array} projectiles - 子弹数组
     * @param {Array} zombies - 僵尸数组
     * @returns {Array} - 碰撞结果数组 [{projectile, zombie}]
     */
    checkProjectileZombieCollisions(projectiles, zombies) {
        const collisions = [];
        
        for (const projectile of projectiles) {
            if (!projectile.active) continue;
            
            for (const zombie of zombies) {
                if (!zombie.active) continue;
                if (zombie.row !== projectile.row) continue;
                
                // 简单的边界框碰撞检测
                const pBounds = projectile.getBounds();
                const zBounds = zombie.getBounds();
                
                if (pBounds.right > zBounds.left && 
                    pBounds.left < zBounds.right &&
                    pBounds.bottom > zBounds.top &&
                    pBounds.top < zBounds.bottom) {
                    collisions.push({ projectile, zombie });
                    break; // 一个子弹只能击中一个僵尸
                }
            }
        }
        
        return collisions;
    }
    
    /**
     * 处理子弹击中僵尸后的效果
     * @param {Object} projectile - 子弹
     * @param {Object} zombie - 僵尸
     */
    applyProjectileEffects(projectile, zombie) {
        // 造成伤害
        zombie.takeDamage(projectile.damage);
        
        // 减速效果（冰豌豆）
        if (projectile.isIce && projectile.slowEffect > 0) {
            zombie.applySlow(projectile.slowEffect, projectile.slowDuration);
        }
        
        // 中毒效果（毒豌豆）
        if (projectile.isPoison && projectile.poisonDamage > 0) {
            zombie.applyPoison(projectile.poisonDamage, projectile.poisonDuration);
        }
    }
    
    /**
     * 检测僵尸与植物的碰撞
     * @param {Array} zombies - 僵尸数组
     * @param {Object} gridSystem - 网格系统
     * @returns {Array} - 碰撞结果数组 [{zombie, plant, row, col}]
     */
    checkZombiePlantCollisions(zombies, gridSystem) {
        const collisions = [];
        
        for (const zombie of zombies) {
            if (!zombie.active || zombie.state === 'dying') continue;
            
            // 获取僵尸所在的列
            const zombieLeft = zombie.x - this.zombieHitboxWidth / 2;
            const col = Math.floor((zombieLeft - GRID_OFFSET_X) / CELL_WIDTH);
            
            if (col >= 0 && col < gridSystem.cols) {
                const plant = gridSystem.getPlant(zombie.row, col);
                if (plant && plant.active) {
                    // 更精确的碰撞检测
                    const plantRight = plant.x + this.plantHitboxWidth / 2;
                    if (zombieLeft <= plantRight) {
                        collisions.push({
                            zombie,
                            plant,
                            row: zombie.row,
                            col
                        });
                    }
                }
            }
        }
        
        return collisions;
    }
    
    /**
     * 检测点与阳光的碰撞（用于点击收集）
     * @param {number} x - 点击X坐标
     * @param {number} y - 点击Y坐标
     * @param {Array} suns - 阳光数组
     * @returns {Object|null} - 被点击的阳光或null
     */
    checkPointSunCollision(x, y, suns) {
        for (const sun of suns) {
            if (!sun.active || sun.isCollecting) continue;
            
            if (sun.containsPoint(x, y)) {
                return sun;
            }
        }
        return null;
    }
    
    /**
     * 检测僵尸前方是否有植物（用于判断是否需要停下来吃）
     * @param {Object} zombie - 僵尸
     * @param {Object} gridSystem - 网格系统
     * @returns {Object|null} - 前方的植物或null
     */
    getPlantInFrontOfZombie(zombie, gridSystem) {
        const zombieLeft = zombie.x - this.zombieHitboxWidth / 2;
        const col = Math.floor((zombieLeft - GRID_OFFSET_X) / CELL_WIDTH);
        
        if (col >= 0 && col < gridSystem.cols) {
            const plant = gridSystem.getPlant(zombie.row, col);
            if (plant && plant.active) {
                const plantRight = plant.x + this.plantHitboxWidth / 2;
                if (zombieLeft <= plantRight + 5) {
                    return plant;
                }
            }
        }
        return null;
    }
    
    /**
     * 检查指定行是否有僵尸（用于植物攻击判断）
     * @param {number} row - 行号
     * @param {number} plantX - 植物X坐标
     * @param {Array} zombies - 僵尸数组
     * @returns {boolean}
     */
    hasZombieInRowAhead(row, plantX, zombies) {
        // 计算草坪右边界
        const grassRightBorder = GRID_OFFSET_X + GRID_COLS * CELL_WIDTH;
        
        return zombies.some(z => 
            z.active && 
            z.row === row && 
            z.x > plantX &&
            z.x < grassRightBorder  // 僵尸必须已经进入草坪区域
        );
    }
    
    /**
     * 获取指定行最近的僵尸
     * @param {number} row - 行号
     * @param {number} plantX - 植物X坐标
     * @param {Array} zombies - 僵尸数组
     * @returns {Object|null}
     */
    getNearestZombieInRow(row, plantX, zombies) {
        let nearest = null;
        let nearestDist = Infinity;
        
        for (const zombie of zombies) {
            if (!zombie.active || zombie.row !== row) continue;
            if (zombie.x <= plantX) continue;
            
            const dist = zombie.x - plantX;
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = zombie;
            }
        }
        
        return nearest;
    }
}

