/**
 * 植物配置数据
 */

export const PLANTS_CONFIG = {
    sunflower: {
        id: 'sunflower',
        name: '向日葵',
        description: '产生阳光的好帮手',
        sunCost: 50,
        cooldown: 5000, // 冷却时间缩短
        health: 100,
        attackDamage: 0,
        attackInterval: 0,
        sunProduction: 25,
        sunInterval: 10000, // 产阳光更快
        color: '#FFD700',
        emoji: '🌻'
    },
    peashooter: {
        id: 'peashooter',
        name: '豌豆射手',
        description: '发射豌豆攻击僵尸',
        sunCost: 100,
        cooldown: 5000, // 冷却时间缩短
        health: 100,
        attackDamage: 20,
        attackInterval: 1200, // 攻击更快
        projectileSpeed: 6, // 子弹更快
        projectileColor: '#32CD32',
        color: '#32CD32',
        emoji: '🌱'
    },
    wallnut: {
        id: 'wallnut',
        name: '坚果墙',
        description: '坚硬的防御墙',
        sunCost: 50,
        cooldown: 20000, // 冷却时间缩短
        health: 500, // 更耐打
        attackDamage: 0,
        attackInterval: 0,
        color: '#DEB887',
        emoji: '🥔'
    },
    snowpea: {
        id: 'snowpea',
        name: '寒冰射手',
        description: '发射冰冻豌豆，减缓僵尸',
        sunCost: 150, // 便宜一点
        cooldown: 5000,
        health: 100,
        attackDamage: 20,
        attackInterval: 1200,
        projectileSpeed: 6,
        projectileColor: '#00BFFF',
        slowEffect: 0.3, // 减速效果更强
        slowDuration: 4000, // 持续更久
        color: '#00BFFF',
        emoji: '❄️',
        isIce: true
    },
    repeater: {
        id: 'repeater',
        name: '双发射手',
        description: '一次发射两颗豌豆',
        sunCost: 175, // 便宜一点
        cooldown: 5000,
        health: 100,
        attackDamage: 20,
        attackInterval: 1200,
        projectileSpeed: 6,
        projectileColor: '#32CD32',
        shotsPerAttack: 2,
        color: '#228B22',
        emoji: '🌱🌱'
    },
    gatlingpea: {
        id: 'gatlingpea',
        name: '机枪射手',
        description: '一次发射四颗豌豆，火力凶猛',
        sunCost: 250,
        cooldown: 5000,
        health: 100,
        attackDamage: 20,
        attackInterval: 1000, // 攻击更快
        projectileSpeed: 7,
        projectileColor: '#32CD32',
        shotsPerAttack: 4,
        color: '#006400',
        emoji: '🌱🌱🌱🌱'
    },
    poisonpea: {
        id: 'poisonpea',
        name: '毒豌豆射手',
        description: '发射毒豌豆，持续消耗僵尸血量',
        sunCost: 175,
        cooldown: 5000,
        health: 100,
        attackDamage: 10, // 初始伤害较低
        attackInterval: 1200,
        projectileSpeed: 6,
        projectileColor: '#9932CC',
        poisonDamage: 5, // 每秒毒伤害
        poisonDuration: 3000, // 中毒持续时间
        color: '#9932CC',
        emoji: '☠️',
        isPoison: true
    },
    firepea: {
        id: 'firepea',
        name: '火焰射手',
        description: '发射火焰豌豆，伤害更高',
        sunCost: 200,
        cooldown: 5000,
        health: 100,
        attackDamage: 40, // 高伤害
        attackInterval: 1500, // 攻击稍慢
        projectileSpeed: 6,
        projectileColor: '#FF4500',
        color: '#FF4500',
        emoji: '🔥',
        isFire: true
    }
};

// 初始可用植物（第一关）
export const INITIAL_PLANTS = ['sunflower', 'peashooter'];

// 按关卡解锁的植物
export const PLANT_UNLOCKS = {
    1: ['sunflower', 'peashooter'],
    2: ['wallnut'],
    3: ['snowpea'],
    4: ['repeater'],
    5: ['poisonpea'],
    6: ['firepea'],
    7: ['gatlingpea']
};

