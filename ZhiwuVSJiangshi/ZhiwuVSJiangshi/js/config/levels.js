/**
 * 关卡配置数据
 */

export const LEVELS_CONFIG = [
    {
        id: 1,
        name: '第一关',
        subtitle: '认识向日葵',
        description: '学习种植向日葵收集阳光',
        initialSun: 150,
        availablePlants: ['sunflower', 'peashooter'],
        waves: [
            { delay: 10000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 25000, zombies: [{ type: 'basic', lane: 1 }, { type: 'basic', lane: 3 }] },
            { delay: 40000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 2 }, { type: 'basic', lane: 4 }] }
        ],
        tutorial: true
    },
    {
        id: 2,
        name: '第二关',
        subtitle: '更多僵尸',
        description: '僵尸数量增加了',
        initialSun: 100,
        availablePlants: ['sunflower', 'peashooter'],
        waves: [
            { delay: 15000, zombies: [{ type: 'basic', lane: 1 }] },
            { delay: 25000, zombies: [{ type: 'basic', lane: 2 }, { type: 'basic', lane: 3 }] },
            { delay: 40000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 1 }, { type: 'basic', lane: 4 }] },
            { delay: 55000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 2 }, { type: 'basic', lane: 3 }, { type: 'basic', lane: 4 }] }
        ]
    },
    {
        id: 3,
        name: '第三关',
        subtitle: '坚果墙登场',
        description: '学习使用坚果墙防御',
        initialSun: 100,
        availablePlants: ['sunflower', 'peashooter', 'wallnut'],
        waves: [
            { delay: 15000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 25000, zombies: [{ type: 'basic', lane: 1 }, { type: 'basic', lane: 2 }] },
            { delay: 40000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 2 }, { type: 'basic', lane: 4 }] },
            { delay: 55000, zombies: [{ type: 'conehead', lane: 2 }] },
            { delay: 70000, zombies: [{ type: 'basic', lane: 1 }, { type: 'conehead', lane: 3 }] }
        ]
    },
    {
        id: 4,
        name: '第四关',
        subtitle: '路障僵尸',
        description: '小心戴路障的僵尸',
        initialSun: 75,
        availablePlants: ['sunflower', 'peashooter', 'wallnut'],
        waves: [
            { delay: 12000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 22000, zombies: [{ type: 'conehead', lane: 1 }] },
            { delay: 35000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 3 }, { type: 'conehead', lane: 2 }] },
            { delay: 50000, zombies: [{ type: 'conehead', lane: 1 }, { type: 'conehead', lane: 4 }] },
            { delay: 65000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 1 }, { type: 'conehead', lane: 2 }, { type: 'basic', lane: 3 }, { type: 'basic', lane: 4 }] }
        ]
    },
    {
        id: 5,
        name: '第五关',
        subtitle: '寒冰射手',
        description: '学习使用寒冰射手减缓僵尸',
        initialSun: 100,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea'],
        waves: [
            { delay: 12000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 22000, zombies: [{ type: 'basic', lane: 1 }, { type: 'basic', lane: 3 }] },
            { delay: 35000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'conehead', lane: 4 }] },
            { delay: 50000, zombies: [{ type: 'basic', lane: 1 }, { type: 'conehead', lane: 2 }, { type: 'basic', lane: 3 }] },
            { delay: 65000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'conehead', lane: 1 }, { type: 'conehead', lane: 2 }, { type: 'conehead', lane: 3 }, { type: 'conehead', lane: 4 }] }
        ]
    },
    {
        id: 6,
        name: '第六关',
        subtitle: '铁桶僵尸',
        description: '铁桶僵尸出现了！',
        initialSun: 75,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea'],
        waves: [
            { delay: 12000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 22000, zombies: [{ type: 'conehead', lane: 1 }, { type: 'basic', lane: 3 }] },
            { delay: 35000, zombies: [{ type: 'buckethead', lane: 2 }] },
            { delay: 50000, zombies: [{ type: 'basic', lane: 0 }, { type: 'buckethead', lane: 2 }, { type: 'basic', lane: 4 }] },
            { delay: 65000, zombies: [{ type: 'conehead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'conehead', lane: 3 }] },
            { delay: 80000, zombies: [{ type: 'buckethead', lane: 0 }, { type: 'conehead', lane: 2 }, { type: 'buckethead', lane: 4 }] }
        ]
    },
    {
        id: 7,
        name: '第七关',
        subtitle: '双发射手',
        description: '学习使用双发射手',
        initialSun: 100,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater'],
        waves: [
            { delay: 10000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 20000, zombies: [{ type: 'basic', lane: 1 }, { type: 'conehead', lane: 3 }] },
            { delay: 32000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'basic', lane: 2 }, { type: 'conehead', lane: 4 }] },
            { delay: 45000, zombies: [{ type: 'buckethead', lane: 1 }, { type: 'buckethead', lane: 3 }] },
            { delay: 60000, zombies: [{ type: 'basic', lane: 0 }, { type: 'conehead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'conehead', lane: 3 }, { type: 'basic', lane: 4 }] }
        ]
    },
    {
        id: 8,
        name: '第八关',
        subtitle: '大波僵尸',
        description: '僵尸大军来袭',
        initialSun: 75,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater'],
        waves: [
            { delay: 10000, zombies: [{ type: 'basic', lane: 1 }, { type: 'basic', lane: 3 }] },
            { delay: 20000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'conehead', lane: 2 }, { type: 'conehead', lane: 4 }] },
            { delay: 35000, zombies: [{ type: 'basic', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'basic', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'basic', lane: 4 }] },
            { delay: 50000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'conehead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'conehead', lane: 3 }, { type: 'conehead', lane: 4 }] },
            { delay: 65000, zombies: [{ type: 'buckethead', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'buckethead', lane: 4 }] }
        ]
    },
    {
        id: 9,
        name: '第九关',
        subtitle: '极限挑战',
        description: '准备好接受挑战了吗？',
        initialSun: 50,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater'],
        waves: [
            { delay: 8000, zombies: [{ type: 'basic', lane: 2 }] },
            { delay: 16000, zombies: [{ type: 'conehead', lane: 1 }, { type: 'conehead', lane: 3 }] },
            { delay: 28000, zombies: [{ type: 'basic', lane: 0 }, { type: 'buckethead', lane: 2 }, { type: 'basic', lane: 4 }] },
            { delay: 40000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'conehead', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'conehead', lane: 4 }] },
            { delay: 55000, zombies: [{ type: 'buckethead', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'buckethead', lane: 4 }] },
            { delay: 70000, zombies: [{ type: 'basic', lane: 0 }, { type: 'conehead', lane: 0 }, { type: 'basic', lane: 1 }, { type: 'conehead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'basic', lane: 3 }, { type: 'conehead', lane: 3 }, { type: 'basic', lane: 4 }, { type: 'conehead', lane: 4 }] }
        ]
    },
    {
        id: 10,
        name: '第十关',
        subtitle: '最终决战',
        description: '保卫家园的最后一战！',
        initialSun: 50,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater'],
        waves: [
            { delay: 8000, zombies: [{ type: 'conehead', lane: 2 }] },
            { delay: 15000, zombies: [{ type: 'basic', lane: 0 }, { type: 'basic', lane: 1 }, { type: 'basic', lane: 3 }, { type: 'basic', lane: 4 }] },
            { delay: 25000, zombies: [{ type: 'buckethead', lane: 1 }, { type: 'buckethead', lane: 3 }] },
            { delay: 38000, zombies: [{ type: 'conehead', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'conehead', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'conehead', lane: 4 }] },
            { delay: 52000, zombies: [{ type: 'buckethead', lane: 0 }, { type: 'buckethead', lane: 1 }, { type: 'buckethead', lane: 2 }, { type: 'buckethead', lane: 3 }, { type: 'buckethead', lane: 4 }] },
            { delay: 68000, zombies: [{ type: 'basic', lane: 0 }, { type: 'conehead', lane: 0 }, { type: 'buckethead', lane: 0 }, { type: 'basic', lane: 1 }, { type: 'conehead', lane: 1 }, { type: 'buckethead', lane: 1 }, { type: 'basic', lane: 2 }, { type: 'conehead', lane: 2 }, { type: 'buckethead', lane: 2 }, { type: 'basic', lane: 3 }, { type: 'conehead', lane: 3 }, { type: 'buckethead', lane: 3 }, { type: 'basic', lane: 4 }, { type: 'conehead', lane: 4 }, { type: 'buckethead', lane: 4 }] }
        ]
    }
];

// 获取关卡配置
export function getLevelConfig(levelId) {
    return LEVELS_CONFIG.find(level => level.id === levelId);
}

// 获取总关卡数
export function getTotalLevels() {
    return LEVELS_CONFIG.length;
}

