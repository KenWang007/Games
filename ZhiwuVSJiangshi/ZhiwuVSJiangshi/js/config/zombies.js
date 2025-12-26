/**
 * 僵尸配置数据
 */

// 儿童友好版 - 僵尸更慢，更容易击杀（3次击中即死）
export const ZOMBIES_CONFIG = {
    basic: {
        id: 'basic',
        name: '普通僵尸',
        description: '最基础的僵尸',
        health: 60, // 3次击中即死 (20伤害x3=60)
        speed: 0.15, // 速度减半，更慢
        attackDamage: 10,
        attackInterval: 1000,
        color: '#90EE90',
        headColor: '#98FB98',
        emoji: '🧟'
    },
    conehead: {
        id: 'conehead',
        name: '路障僵尸',
        description: '戴着路障的僵尸，稍微耐打一点',
        health: 60, // 身体3次击中
        speed: 0.15, // 速度减半
        attackDamage: 10,
        attackInterval: 1000,
        color: '#90EE90',
        headColor: '#FF8C00',
        coneHealth: 40, // 路障2次击中掉落
        emoji: '🚧'
    },
    buckethead: {
        id: 'buckethead',
        name: '铁桶僵尸',
        description: '戴着铁桶的僵尸，比较耐打',
        health: 60, // 身体3次击中
        speed: 0.12, // 更慢
        attackDamage: 10,
        attackInterval: 1000,
        color: '#90EE90',
        headColor: '#708090',
        bucketHealth: 60, // 铁桶3次击中掉落
        emoji: '🪣'
    }
};

