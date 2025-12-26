/**
 * 游戏主类 - 管理游戏循环和状态
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE, COLORS, GRID_OFFSET_Y } from '../config/constants.js';
import { PLANTS_CONFIG } from '../config/plants.js';
import { getLevelConfig, getTotalLevels } from '../config/levels.js';
import { getDifficultyConfig, applyDifficultyToLevel } from '../config/difficulty.js';
import { Input } from './Input.js';
import { GridSystem } from '../systems/GridSystem.js';
import { SunSystem } from '../systems/SunSystem.js';
import { WaveSystem } from '../systems/WaveSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { CardBar } from '../ui/CardBar.js';
import { UIManager } from '../ui/UIManager.js';
import { Almanac } from '../ui/Almanac.js';
import { GameStatsUI } from '../ui/GameStatsUI.js';
import { DifficultySelector } from '../ui/DifficultySelector.js';
import { ObjectPool } from '../utils/ObjectPool.js';
import { Storage } from '../utils/Storage.js';
import { Projectile } from '../entities/Projectile.js';
import { Sunflower } from '../entities/plants/Sunflower.js';
import { Peashooter } from '../entities/plants/Peashooter.js';
import { WallNut } from '../entities/plants/WallNut.js';
import { SnowPea } from '../entities/plants/SnowPea.js';
import { Repeater } from '../entities/plants/Repeater.js';
import { GatlingPea } from '../entities/plants/GatlingPea.js';
import { PoisonPea } from '../entities/plants/PoisonPea.js';
import { FirePea } from '../entities/plants/FirePea.js';

export class Game {
    constructor(canvasId) {
        // Canvas设置
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        // 游戏状态
        this.state = GAME_STATE.MENU;
        this.currentLevel = 1;
        this.isPaused = false;
        this.currentDifficulty = 'normal'; // 当前难度
        this.difficultyConfig = null; // 难度配置
        
        // 时间
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gamePlayTime = 0; // 本局游戏时间
        
        // 统计
        this.sessionStats = {
            zombiesKilled: 0,
            sunCollected: 0,
            plantsPlanted: 0
        };
        
        // 系统
        this.input = new Input(this.canvas);
        this.gridSystem = new GridSystem();
        this.sunSystem = new SunSystem();
        this.waveSystem = new WaveSystem();
        this.collisionSystem = new CollisionSystem();
        this.audioSystem = new AudioSystem();
        this.particleSystem = new ParticleSystem();
        this.storage = new Storage();
        
        // UI
        this.uiManager = new UIManager();
        this.cardBar = new CardBar('card-bar');
        this.almanac = new Almanac();
        this.gameStatsUI = new GameStatsUI();
        this.difficultySelector = new DifficultySelector();
        
        // 子弹对象池
        this.projectilePool = new ObjectPool(
            () => new Projectile(0, 0, 0, 0),
            (p) => p.reset(),
            50
        );
        this.projectiles = [];
        
        // 植物工厂映射
        this.plantFactories = {
            sunflower: (config, row, col, x, y) => new Sunflower(config, row, col, x, y),
            peashooter: (config, row, col, x, y) => new Peashooter(config, row, col, x, y),
            wallnut: (config, row, col, x, y) => new WallNut(config, row, col, x, y),
            snowpea: (config, row, col, x, y) => new SnowPea(config, row, col, x, y),
            repeater: (config, row, col, x, y) => new Repeater(config, row, col, x, y),
            gatlingpea: (config, row, col, x, y) => new GatlingPea(config, row, col, x, y),
            poisonpea: (config, row, col, x, y) => new PoisonPea(config, row, col, x, y),
            firepea: (config, row, col, x, y) => new FirePea(config, row, col, x, y)
        };
        
        this.init();
    }
    
    /**
     * 初始化游戏
     */
    init() {
        // 从存档加载进度
        this.currentLevel = this.storage.getCurrentLevel();
        
        // 加载音频设置
        const settings = this.storage.getSettings();
        this.audioSystem.isMusicEnabled = settings.musicEnabled;
        this.audioSystem.isSfxEnabled = settings.sfxEnabled;
        this.audioSystem.setMusicVolume(settings.musicVolume);
        this.audioSystem.setSfxVolume(settings.sfxVolume);
        
        // 加载难度设置
        this.currentDifficulty = settings.difficulty || 'normal';
        this.difficultyConfig = getDifficultyConfig(this.currentDifficulty);
        
        // 设置图鉴解锁状态
        this.almanac.setUnlockedPlants(this.storage.getUnlockedPlants());
        
        // 设置UI回调
        this.uiManager.onStartClick(() => this.startGame());
        this.uiManager.onNextClick(() => this.nextLevel());
        this.uiManager.onRetryClick(() => this.retryLevel());
        this.uiManager.onPause(() => this.togglePause());
        this.uiManager.onResume(() => this.togglePause());
        this.uiManager.onSoundToggle((enabled) => this.toggleSound(enabled));
        this.uiManager.onAlmanac(() => this.openAlmanac());
        this.uiManager.onReset(() => this.resetProgress());
        this.uiManager.onQuit(() => this.quitToMenu());
        
        // 设置难度选择回调
        this.uiManager.onDifficultyClick(() => {
            this.showDifficultySelector();
        });
        
        // 设置难度选择器回调
        this.difficultySelector.onDifficultySelected((difficultyId) => {
            this.setDifficulty(difficultyId);
        });
        
        // 设置音效按钮初始状态
        this.uiManager.setSoundEnabled(settings.musicEnabled || settings.sfxEnabled);
        
        // 设置输入回调
        this.input.onClick((x, y) => this.handleClick(x, y));
        this.input.onMove((x, y) => this.handleMouseMove(x, y));
        
        // 图鉴关闭回调
        this.almanac.onClose(() => {
            // 图鉴关闭后不需要特殊处理
        });
        
        // 隐藏加载，显示菜单
        this.uiManager.hideLoading();
        this.uiManager.showMenu();
        
        // 更新菜单显示
        this.updateMenuDisplay();
        
        // 开始游戏循环
        this.gameLoop(0);
    }
    
    /**
     * 更新菜单显示
     */
    updateMenuDisplay() {
        const stats = this.storage.getStatistics();
        const totalStars = this.storage.getTotalStars();
        const maxLevel = this.storage.getMaxUnlockedLevel();
        
        // 更新菜单统计显示
        this.uiManager.updateMenuStats({
            totalStars: totalStars,
            totalGamesPlayed: stats.totalGamesPlayed,
            totalWins: stats.totalWins,
            maxLevel: maxLevel
        });
        
        console.log(`已解锁关卡: ${maxLevel}, 总星数: ${totalStars}, 总游戏次数: ${stats.totalGamesPlayed}`);
    }
    
    /**
     * 重置游戏进度
     */
    resetProgress() {
        this.storage.reset();
        this.currentLevel = 1;
        this.almanac.setUnlockedPlants(['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater', 'gatlingpea', 'poisonpea', 'firepea']);
        this.updateMenuDisplay();
        console.log('游戏进度已重置');
    }
    
    /**
     * 退出到主菜单
     */
    quitToMenu() {
        this.audioSystem.stopBgm();
        this.state = GAME_STATE.MENU;
        this.uiManager.hideAllScreens();
        this.uiManager.showMenu();
        this.updateMenuDisplay();
        
        // 隐藏统计侧边栏
        this.gameStatsUI.hide();
    }
    
    /**
     * 显示难度选择器
     */
    showDifficultySelector() {
        if (!this.difficultySelector) {
            return;
        }
        
        this.audioSystem.playSfx('click');
        this.difficultySelector.show(this.currentDifficulty);
    }
    
    /**
     * 设置难度
     */
    setDifficulty(difficultyId) {
        this.currentDifficulty = difficultyId;
        this.difficultyConfig = getDifficultyConfig(difficultyId);
        
        // 保存到设置
        this.storage.updateSettings({ difficulty: difficultyId });
        
        this.audioSystem.playSfx('click');
        console.log(`难度已设置为: ${this.difficultyConfig.name}`);
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        this.audioSystem.resume();
        this.audioSystem.playSfx('click');
        this.audioSystem.startBgm();
        
        this.loadLevel(this.currentLevel);
        this.state = GAME_STATE.PLAYING;
        this.uiManager.hideMenu();
        
        // 显示统计侧边栏
        this.gameStatsUI.show();
    }
    
    /**
     * 加载关卡
     */
    loadLevel(levelId) {
        const baseLevelConfig = getLevelConfig(levelId);
        if (!baseLevelConfig) {
            console.error(`Level ${levelId} not found`);
            return;
        }
        
        // 应用难度配置到关卡
        const levelConfig = applyDifficultyToLevel(baseLevelConfig, this.difficultyConfig);
        
        // 重置系统
        this.gridSystem.reset();
        this.sunSystem.reset(levelConfig.initialSun, this.difficultyConfig);
        this.waveSystem.init(levelConfig.waves, this.difficultyConfig);
        
        // 清理子弹
        for (const p of this.projectiles) {
            this.projectilePool.release(p);
        }
        this.projectiles = [];
        
        // 清理粒子
        this.particleSystem.clear();
        
        // 重置统计
        this.sessionStats = {
            zombiesKilled: 0,
            sunCollected: 0,
            plantsPlanted: 0
        };
        this.gamePlayTime = 0;
        
        // 初始化卡片栏
        this.cardBar.init(levelConfig.availablePlants, this.sunSystem);
        
        // 解锁新植物
        for (const plantId of levelConfig.availablePlants) {
            this.storage.unlockPlant(plantId);
        }
        this.almanac.setUnlockedPlants(this.storage.getUnlockedPlants());
        
        // 更新UI
        this.uiManager.updateSunDisplay(this.sunSystem.getSunCount());
        this.uiManager.hideAllScreens();
        
        this.isPaused = false;
        this.state = GAME_STATE.PLAYING;
        
        // 保存当前关卡
        this.storage.setCurrentLevel(levelId);
    }
    
    /**
     * 下一关
     */
    nextLevel() {
        this.audioSystem.playSfx('click');
        
        this.currentLevel++;
        if (this.currentLevel > getTotalLevels()) {
            this.currentLevel = 1; // 循环
        }
        
        // 解锁下一关
        this.storage.unlockLevel(this.currentLevel);
        
        this.loadLevel(this.currentLevel);
        this.uiManager.hideWin();
    }
    
    /**
     * 重试当前关卡
     */
    retryLevel() {
        this.audioSystem.playSfx('click');
        this.loadLevel(this.currentLevel);
        this.uiManager.hideLose();
    }
    
    /**
     * 切换暂停
     */
    togglePause() {
        if (this.state !== GAME_STATE.PLAYING && this.state !== GAME_STATE.PAUSED) {
            return;
        }
        
        this.audioSystem.playSfx('click');
        
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.state = GAME_STATE.PAUSED;
            this.uiManager.showPause();
            this.audioSystem.stopBgm();
        } else {
            this.state = GAME_STATE.PLAYING;
            this.uiManager.hidePause();
            this.audioSystem.startBgm();
        }
    }
    
    /**
     * 切换音效
     */
    toggleSound(enabled) {
        if (enabled) {
            this.audioSystem.isMusicEnabled = true;
            this.audioSystem.isSfxEnabled = true;
            if (this.state === GAME_STATE.PLAYING) {
                this.audioSystem.startBgm();
            }
        } else {
            this.audioSystem.isMusicEnabled = false;
            this.audioSystem.isSfxEnabled = false;
            this.audioSystem.stopBgm();
        }
        
        // 保存设置
        this.storage.updateSettings({
            musicEnabled: this.audioSystem.isMusicEnabled,
            sfxEnabled: this.audioSystem.isSfxEnabled
        });
    }
    
    /**
     * 打开图鉴
     */
    openAlmanac() {
        this.almanac.open();
    }
    
    /**
     * 处理点击
     */
    handleClick(x, y) {
        // 恢复音频上下文
        this.audioSystem.resume();
        
        if (this.state !== GAME_STATE.PLAYING) return;
        
        // 1. 尝试收集阳光
        const collected = this.sunSystem.tryCollect(x, y);
        if (collected > 0) {
            this.audioSystem.playSfx('sun');
            this.particleSystem.createSunCollectEffect(x, y);
            this.sessionStats.sunCollected += collected;
            this.uiManager.updateSunDisplay(this.sunSystem.getSunCount());
            return;
        }
        
        // 2. 检查是否选中铲子
        const shovelSelected = this.cardBar.isShovelSelected();
        console.log('[Game] 铲子选中状态:', shovelSelected);
        
        if (shovelSelected) {
            console.log('[Game] 铲子已选中，尝试移除植物');
            const cell = this.gridSystem.pixelToGrid(x, y);
            console.log('[Game] 点击位置:', x, y, '转换为格子:', cell);
            
            if (cell) {
                const plant = this.gridSystem.getPlantAt(cell.row, cell.col);
                console.log('[Game] 该位置的植物:', plant);
                
                if (plant) {
                    // 移除植物
                    console.log('[Game] 移除植物:', plant);
                    this.removePlant(cell.row, cell.col);
                    this.audioSystem.playSfx('plant');
                    const pos = this.gridSystem.gridToPixel(cell.row, cell.col);
                    this.particleSystem.createPlantEffect(pos.x, pos.y);
                    // 取消铲子选择
                    this.cardBar.deselectShovel();
                } else {
                    console.log('[Game] 该位置没有植物');
                }
            }
            return;
        }
        
        // 3. 尝试种植植物
        const selectedPlantId = this.cardBar.getSelectedPlantId();
        if (selectedPlantId) {
            const cell = this.gridSystem.pixelToGrid(x, y);
            if (cell && this.gridSystem.isCellEmpty(cell.row, cell.col)) {
                if (this.plantAt(selectedPlantId, cell.row, cell.col)) {
                    this.audioSystem.playSfx('plant');
                    const pos = this.gridSystem.gridToPixel(cell.row, cell.col);
                    this.particleSystem.createPlantEffect(pos.x, pos.y);
                    this.sessionStats.plantsPlanted++;
                }
            }
        }
    }
    
    /**
     * 移除植物
     */
    removePlant(row, col) {
        this.gridSystem.removePlant(row, col);
    }
    
    /**
     * 处理鼠标移动
     */
    handleMouseMove(x, y) {
        if (this.state === GAME_STATE.PLAYING) {
            this.gridSystem.updateHover(x, y);
        }
    }
    
    /**
     * 在指定位置种植植物
     */
    plantAt(plantId, row, col) {
        const baseConfig = PLANTS_CONFIG[plantId];
        if (!baseConfig) return false;
        
        // 应用难度倍数到植物配置
        const config = { ...baseConfig };
        if (this.difficultyConfig) {
            if (config.attackDamage) {
                config.attackDamage = Math.floor(config.attackDamage * this.difficultyConfig.plantDamageMultiplier);
            }
            if (config.cooldown) {
                config.cooldown = Math.floor(config.cooldown * this.difficultyConfig.plantCooldownMultiplier);
            }
            // 向日葵阳光产生间隔和数值不受难度影响，始终保持固定
            // 已移除 sunInterval 和 sunProduction 的难度调整
        }
        
        // 检查阳光
        if (!this.sunSystem.spend(config.sunCost)) {
            return false;
        }
        
        // 创建植物
        const pos = this.gridSystem.gridToPixel(row, col);
        const factory = this.plantFactories[plantId];
        if (!factory) {
            console.error(`No factory for plant: ${plantId}`);
            return false;
        }
        
        const plant = factory(config, row, col, pos.x, pos.y);
        
        // 放置到网格
        if (this.gridSystem.placePlant(row, col, plant)) {
            // 更新UI
            this.uiManager.updateSunDisplay(this.sunSystem.getSunCount());
            this.cardBar.startCooldown(plantId);
            return true;
        }
        
        return false;
    }
    
    /**
     * 游戏主循环
     */
    gameLoop(timestamp) {
        // 计算deltaTime
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // 限制deltaTime防止跳帧
        if (this.deltaTime > 100) {
            this.deltaTime = 16.67;
        }
        
        // 更新
        if (this.state === GAME_STATE.PLAYING && !this.isPaused) {
            this.update(this.deltaTime);
            this.gamePlayTime += this.deltaTime;
        }
        
        // 渲染
        this.render();
        
        // 下一帧
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    /**
     * 更新游戏状态
     */
    update(deltaTime) {
        // 更新阳光系统
        this.sunSystem.update(deltaTime);
        
        // 更新波次系统
        this.waveSystem.update(deltaTime);
        
        // 更新卡片栏
        this.cardBar.update(deltaTime);
        
        // 更新植物
        this.updatePlants(deltaTime);
        
        // 更新子弹
        this.updateProjectiles(deltaTime);
        
        // 更新粒子
        this.particleSystem.update(deltaTime);
        
        // 处理碰撞
        this.handleCollisions();
        
        // 检查胜负
        this.checkWinLose();
        
        // 更新UI显示
        this.uiManager.updateSunDisplay(this.sunSystem.getSunCount());
    }
    
    /**
     * 更新所有植物
     */
    updatePlants(deltaTime) {
        const plants = this.gridSystem.getAllPlants();
        const zombies = this.waveSystem.getActiveZombies();
        
        for (const { plant, row, col } of plants) {
            if (!plant.active) {
                this.gridSystem.removePlant(row, col);
                continue;
            }
            
            plant.update(deltaTime);
            
            // 向日葵产阳光
            if (plant instanceof Sunflower && plant.canProduceSun()) {
                plant.produceSun();
                this.sunSystem.spawnSunAt(plant.x, plant.y);
            }
            
            // 射手攻击
            if ((plant instanceof Peashooter || plant instanceof SnowPea || plant instanceof Repeater) 
                && plant.canPerformAttack()) {
                // 检查该行是否有僵尸
                if (this.collisionSystem.hasZombieInRowAhead(row, plant.x, zombies)) {
                    plant.performAttack();
                    plant.triggerShootAnimation();
                    this.audioSystem.playSfx('shoot');
                    
                    // 发射子弹
                    const spawnPos = plant.getProjectileSpawnPosition();
                    const shots = plant.shotsPerAttack || 1;
                    
                    // 获取植物的特殊效果配置
                    const projectileOptions = {
                        isIce: plant.config.isIce || false,
                        isPoison: plant.config.isPoison || false,
                        isFire: plant.config.isFire || false,
                        slowEffect: plant.config.slowEffect || 0,
                        slowDuration: plant.config.slowDuration || 0,
                        poisonDamage: plant.config.poisonDamage || 0,
                        poisonDuration: plant.config.poisonDuration || 0
                    };
                    
                    for (let i = 0; i < shots; i++) {
                        setTimeout(() => {
                            this.spawnProjectile(
                                spawnPos.x,
                                spawnPos.y,
                                plant.attackDamage,
                                plant.projectileSpeed,
                                plant.projectileColor,
                                row,
                                projectileOptions
                            );
                        }, i * 120);
                    }
                }
            }
        }
    }
    
    /**
     * 生成子弹
     */
    spawnProjectile(x, y, damage, speed, color, row, options = {}) {
        const projectile = this.projectilePool.get();
        projectile.x = x;
        projectile.y = y;
        projectile.damage = damage;
        projectile.speed = speed;
        projectile.color = color;
        projectile.row = row;
        projectile.active = true;
        projectile.rotation = 0;
        projectile.trailParticles = [];
        
        // 设置特殊效果
        projectile.isIce = options.isIce || false;
        projectile.isPoison = options.isPoison || false;
        projectile.isFire = options.isFire || false;
        projectile.slowEffect = options.slowEffect || (options.isIce ? 0.3 : 0);
        projectile.slowDuration = options.slowDuration || (options.isIce ? 4000 : 0);
        projectile.poisonDamage = options.poisonDamage || 0;
        projectile.poisonDuration = options.poisonDuration || 0;
        
        this.projectiles.push(projectile);
    }
    
    /**
     * 更新子弹
     */
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime);
            
            if (!projectile.active) {
                this.projectilePool.release(projectile);
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    /**
     * 处理碰撞
     */
    handleCollisions() {
        const zombies = this.waveSystem.getActiveZombies();
        
        // 子弹与僵尸碰撞
        const projectileHits = this.collisionSystem.checkProjectileZombieCollisions(
            this.projectiles, 
            zombies
        );
        
        for (const { projectile, zombie } of projectileHits) {
            const wasAlive = zombie.active;
            
            // 应用子弹效果（伤害、减速、中毒等）
            this.collisionSystem.applyProjectileEffects(projectile, zombie);
            this.audioSystem.playSfx('hit');
            
            // 粒子效果
            if (projectile.isIce) {
                this.particleSystem.createIceHitEffect(projectile.x, projectile.y);
            } else if (projectile.isPoison) {
                this.particleSystem.createPoisonHitEffect(projectile.x, projectile.y);
            } else if (projectile.isFire) {
                this.particleSystem.createFireHitEffect(projectile.x, projectile.y);
            } else {
                this.particleSystem.createHitEffect(projectile.x, projectile.y);
            }
            
            // 统计击杀
            if (wasAlive && !zombie.active) {
                this.sessionStats.zombiesKilled++;
                this.particleSystem.createZombieDeathEffect(zombie.x, zombie.y);
            }
            
            projectile.destroy();
        }
        
        // 僵尸与植物碰撞
        for (const zombie of zombies) {
            if (!zombie.active) continue;
            
            const plant = this.collisionSystem.getPlantInFrontOfZombie(zombie, this.gridSystem);
            
            if (plant) {
                if (zombie.state !== 'eating') {
                    zombie.startEating(plant);
                }
                
                if (zombie.canAttack()) {
                    const damage = zombie.performAttack();
                    plant.takeDamage(damage);
                    
                    if (!plant.active) {
                        this.gridSystem.removePlant(plant.row, plant.col);
                        zombie.stopEating();
                    }
                }
            } else if (zombie.state === 'eating') {
                zombie.stopEating();
            }
        }
    }
    
    /**
     * 检查胜负
     */
    checkWinLose() {
        // 检查失败 - 僵尸到达左侧
        if (this.waveSystem.hasZombieReachedEnd()) {
            this.onGameEnd(false);
            return;
        }
        
        // 检查胜利 - 所有波次完成且所有僵尸被消灭
        if (this.waveSystem.isAllWavesComplete()) {
            this.onGameEnd(true);
        }
    }
    
    /**
     * 游戏结束处理
     */
    onGameEnd(won) {
        this.audioSystem.stopBgm();
        
        if (won) {
            this.state = GAME_STATE.WIN;
            this.audioSystem.playSfx('win');
            
            // 计算星级
            const stars = this.calculateStars();
            this.storage.setLevelStars(this.currentLevel, stars);
            
            // 显示胜利界面和星级
            this.uiManager.showWin(stars);
            
            // 解锁下一关
            if (this.currentLevel < getTotalLevels()) {
                this.storage.unlockLevel(this.currentLevel + 1);
            }
        } else {
            this.state = GAME_STATE.LOSE;
            this.audioSystem.playSfx('lose');
            this.uiManager.showLose();
        }
        
        // 记录统计
        this.storage.recordGameComplete(
            won,
            this.sessionStats.zombiesKilled,
            this.sessionStats.sunCollected,
            this.sessionStats.plantsPlanted
        );
        
        // 记录游戏时间
        this.storage.addPlayTime(Math.floor(this.gamePlayTime / 1000));
    }
    
    /**
     * 计算星级评价
     */
    calculateStars() {
        // 简单的星级计算：
        // 3星：无植物损失
        // 2星：损失少于3株植物
        // 1星：通关
        
        const plantsLost = this.sessionStats.plantsPlanted - this.gridSystem.getAllPlants().length;
        
        if (plantsLost === 0) return 3;
        if (plantsLost < 3) return 2;
        return 1;
    }
    
    /**
     * 渲染游戏
     */
    render() {
        const ctx = this.ctx;
        
        // 清空画布
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // 绘制背景
        this.renderBackground(ctx);
        
        if (this.state === GAME_STATE.MENU) {
            return;
        }
        
        // 绘制网格
        this.gridSystem.render(ctx);
        
        // 绘制植物
        this.renderPlants(ctx);
        
        // 绘制僵尸
        this.waveSystem.render(ctx);
        
        // 绘制子弹
        for (const projectile of this.projectiles) {
            projectile.render(ctx);
        }
        
        // 绘制阳光
        this.sunSystem.render(ctx);
        
        // 绘制粒子效果
        this.particleSystem.render(ctx);
        
        // 绘制关卡信息
        this.renderLevelInfo(ctx);
    }
    
    /**
     * 绘制背景
     */
    renderBackground(ctx) {
        // 天空渐变
        const skyGradient = ctx.createLinearGradient(0, 0, 0, GRID_OFFSET_Y);
        skyGradient.addColorStop(0, COLORS.SKY_TOP);
        skyGradient.addColorStop(1, COLORS.SKY_BOTTOM);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, GRID_OFFSET_Y);
        
        // 草坪背景
        ctx.fillStyle = COLORS.GRASS_LIGHT;
        ctx.fillRect(0, GRID_OFFSET_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GRID_OFFSET_Y);
        
        // 房子（左侧）
        this.renderHouse(ctx);
    }
    
    /**
     * 绘制房子
     */
    renderHouse(ctx) {
        const houseX = 0;
        const houseY = GRID_OFFSET_Y;
        
        // 房子主体
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(houseX, houseY, 40, CANVAS_HEIGHT - GRID_OFFSET_Y);
        
        // 门
        ctx.fillStyle = '#8B4513';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(houseX + 10, houseY + i * 100 + 30, 20, 40);
        }
    }
    
    /**
     * 绘制所有植物
     */
    renderPlants(ctx) {
        const plants = this.gridSystem.getAllPlants();
        // 按Y坐标排序
        plants.sort((a, b) => a.row - b.row);
        
        for (const { plant } of plants) {
            plant.render(ctx);
        }
    }
    
    /**
     * 绘制关卡信息
     */
    renderLevelInfo(ctx) {
        const levelConfig = getLevelConfig(this.currentLevel);
        if (!levelConfig) return;
        
        // 获取总统计数据
        const totalStats = this.storage.getStatistics();
        const waveProgress = this.waveSystem.getProgress();
        
        // 使用新的统计UI组件渲染
        this.gameStatsUI.render(ctx, {
            currentLevel: this.currentLevel,
            levelConfig: levelConfig,
            sessionStats: this.sessionStats,
            totalStats: totalStats,
            waveProgress: waveProgress,
            difficultyConfig: this.difficultyConfig
        });
    }
}
