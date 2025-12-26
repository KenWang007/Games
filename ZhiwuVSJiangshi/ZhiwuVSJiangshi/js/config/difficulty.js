/**
 * 难度配置
 * 定义不同难度下的游戏参数
 */

export const DIFFICULTY_LEVELS = {
    EASY: {
        id: 'easy',
        name: '简单',
        description: '适合小朋友，僵尸移动慢，阳光充足',
        icon: '🌱',
        color: '#4CAF50',
        // 僵尸参数
        zombieSpeedMultiplier: 0.5,      // 僵尸速度减半
        zombieHealthMultiplier: 0.7,     // 僵尸血量减少30%
        zombieSpawnMultiplier: 0.8,      // 僵尸数量减少20%
        zombieWaveDelayMultiplier: 0.7,  // 波次间隔缩短30%，让僵尸更快出现
        
        // 阳光参数
        sunProductionMultiplier: 1.5,    // 阳光产生速度增加50%
        initialSunMultiplier: 1.5,       // 初始阳光增加50%
        sunValueMultiplier: 1.2,         // 阳光价值增加20%
        
        // 植物参数
        plantDamageMultiplier: 1.2,      // 植物伤害增加20%
        plantCooldownMultiplier: 0.8,   // 植物冷却时间减少20%
        
        // 关卡参数
        levelInitialSunBonus: 50,        // 每关额外初始阳光
        levelSunProductionBonus: 0.2     // 每关阳光产生速度额外加成
    },
    NORMAL: {
        id: 'normal',
        name: '普通',
        description: '标准难度，平衡的游戏体验',
        icon: '🌿',
        color: '#2196F3',
        // 僵尸参数
        zombieSpeedMultiplier: 1.0,
        zombieHealthMultiplier: 1.0,
        zombieSpawnMultiplier: 1.0,
        zombieWaveDelayMultiplier: 1.0,
        
        // 阳光参数
        sunProductionMultiplier: 1.0,
        initialSunMultiplier: 1.0,
        sunValueMultiplier: 1.0,
        
        // 植物参数
        plantDamageMultiplier: 1.0,
        plantCooldownMultiplier: 1.0,
        
        // 关卡参数
        levelInitialSunBonus: 0,
        levelSunProductionBonus: 0
    },
    HARD: {
        id: 'hard',
        name: '困难',
        description: '挑战模式，僵尸更快更强，资源紧张',
        icon: '🔥',
        color: '#F44336',
        // 僵尸参数
        zombieSpeedMultiplier: 1.5,      // 僵尸速度增加50%
        zombieHealthMultiplier: 1.5,     // 僵尸血量增加50%
        zombieSpawnMultiplier: 1.3,      // 僵尸数量增加30%
        zombieWaveDelayMultiplier: 0.7,  // 波次间隔缩短30%
        
        // 阳光参数
        sunProductionMultiplier: 0.7,    // 阳光产生速度减少30%
        initialSunMultiplier: 0.7,       // 初始阳光减少30%
        sunValueMultiplier: 0.9,         // 阳光价值减少10%
        
        // 植物参数
        plantDamageMultiplier: 0.9,     // 植物伤害减少10%
        plantCooldownMultiplier: 1.2,   // 植物冷却时间增加20%
        
        // 关卡参数
        levelInitialSunBonus: -30,      // 每关减少初始阳光
        levelSunProductionBonus: -0.1   // 每关阳光产生速度减少
    },
    NIGHTMARE: {
        id: 'nightmare',
        name: '噩梦',
        description: '极限挑战！僵尸大军，资源极度匮乏',
        icon: '💀',
        color: '#9C27B0',
        // 僵尸参数
        zombieSpeedMultiplier: 2.0,      // 僵尸速度翻倍
        zombieHealthMultiplier: 2.0,    // 僵尸血量翻倍
        zombieSpawnMultiplier: 1.8,     // 僵尸数量增加80%
        zombieWaveDelayMultiplier: 0.5,  // 波次间隔缩短50%
        
        // 阳光参数
        sunProductionMultiplier: 0.5,   // 阳光产生速度减半
        initialSunMultiplier: 0.5,      // 初始阳光减半
        sunValueMultiplier: 0.8,        // 阳光价值减少20%
        
        // 植物参数
        plantDamageMultiplier: 0.8,     // 植物伤害减少20%
        plantCooldownMultiplier: 1.5,   // 植物冷却时间增加50%
        
        // 关卡参数
        levelInitialSunBonus: -50,     // 每关大幅减少初始阳光
        levelSunProductionBonus: -0.15  // 每关阳光产生速度大幅减少
    }
};

/**
 * 获取难度配置
 */
export function getDifficultyConfig(difficultyId) {
    return DIFFICULTY_LEVELS[difficultyId.toUpperCase()] || DIFFICULTY_LEVELS.NORMAL;
}

/**
 * 获取所有难度列表
 */
export function getAllDifficulties() {
    return Object.values(DIFFICULTY_LEVELS);
}

/**
 * 应用难度到关卡配置
 */
export function applyDifficultyToLevel(levelConfig, difficultyConfig) {
    const modified = { ...levelConfig };
    
    // 调整初始阳光
    modified.initialSun = Math.max(25, Math.floor(
        levelConfig.initialSun * difficultyConfig.initialSunMultiplier + 
        difficultyConfig.levelInitialSunBonus
    ));
    
    // 调整波次延迟
    modified.waves = levelConfig.waves.map(wave => ({
        ...wave,
        delay: Math.max(3000, Math.floor(wave.delay * difficultyConfig.zombieWaveDelayMultiplier))
    }));
    
    // 调整僵尸数量
    if (difficultyConfig.zombieSpawnMultiplier !== 1) {
        modified.waves = modified.waves.map(wave => {
            let newZombies = [...wave.zombies];
            
            if (difficultyConfig.zombieSpawnMultiplier > 1) {
                // 增加僵尸（困难、噩梦模式）
                const additionalCount = Math.floor(wave.zombies.length * (difficultyConfig.zombieSpawnMultiplier - 1));
                
                for (let i = 0; i < additionalCount; i++) {
                    const randomLane = Math.floor(Math.random() * 5);
                    const zombieTypes = ['basic', 'conehead', 'buckethead'];
                    const randomType = zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
                    newZombies.push({ type: randomType, lane: randomLane });
                }
            } else if (difficultyConfig.zombieSpawnMultiplier < 1) {
                // 减少僵尸（简单模式）
                const targetCount = Math.max(1, Math.floor(wave.zombies.length * difficultyConfig.zombieSpawnMultiplier));
                
                // 随机保留部分僵尸，至少保留1个
                if (targetCount < newZombies.length) {
                    // 打乱数组
                    newZombies = newZombies.sort(() => Math.random() - 0.5);
                    // 只保留目标数量
                    newZombies = newZombies.slice(0, targetCount);
                }
            }
            
            return { ...wave, zombies: newZombies };
        });
    }
    
    return modified;
}

