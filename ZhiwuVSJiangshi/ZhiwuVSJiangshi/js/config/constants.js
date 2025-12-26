/**
 * 游戏常量配置
 * Plants vs Zombies - Web Version
 */

// 画布尺寸
export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 600;

// 草坪网格配置
export const GRID_ROWS = 5;
export const GRID_COLS = 9;
export const GRID_OFFSET_X = 40;
export const GRID_OFFSET_Y = 100;
export const CELL_WIDTH = 80;
export const CELL_HEIGHT = 100;

// 游戏速度
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;

// 阳光配置 (儿童友好版 - 更快产生阳光)
export const INITIAL_SUN = 100; // 初始阳光增加
export const SUN_VALUE = 25;
export const SKY_SUN_INTERVAL = 5000; // 天空掉落阳光间隔(ms) - 加快一倍
export const SUNFLOWER_SUN_INTERVAL = 10000; // 向日葵产阳光间隔(ms) - 加快2.4倍
export const SUN_LIFETIME = 15000; // 阳光存在时间(ms) - 延长
export const SUN_FALL_SPEED = 0.8; // 阳光下落速度 - 稍慢一点

// 植物配置
export const PLANT_TYPES = {
    SUNFLOWER: 'sunflower',
    PEASHOOTER: 'peashooter',
    WALLNUT: 'wallnut',
    SNOWPEA: 'snowpea',
    REPEATER: 'repeater'
};

// 僵尸配置
export const ZOMBIE_TYPES = {
    BASIC: 'basic',
    CONEHEAD: 'conehead',
    BUCKETHEAD: 'buckethead'
};

// 游戏状态
export const GAME_STATE = {
    MENU: 'menu',
    LEVEL_SELECT: 'levelSelect',
    PLAYING: 'playing',
    PAUSED: 'paused',
    WIN: 'win',
    LOSE: 'lose'
};

// 颜色配置 - 卡通风格
export const COLORS = {
    SKY_TOP: '#87CEEB',
    SKY_BOTTOM: '#E0F6FF',
    GRASS_LIGHT: '#7EC850',
    GRASS_DARK: '#5DB336',
    GRID_LINE: 'rgba(0, 100, 0, 0.3)',
    SUN_GLOW: '#FFD700',
    UI_PRIMARY: '#4A7C23',
    UI_SECONDARY: '#8B4513',
    TEXT_DARK: '#2D2D2D',
    TEXT_LIGHT: '#FFFFFF'
};

// 动画配置
export const ANIMATION = {
    PLANT_SWAY_SPEED: 0.05,
    ZOMBIE_WALK_SPEED: 0.1,
    SUN_BOUNCE_SPEED: 0.08,
    PROJECTILE_SPEED: 5
};

// 音效配置
export const AUDIO = {
    MUSIC_VOLUME: 0.3,
    SFX_VOLUME: 0.5
};

// 层级 (z-index)
export const LAYERS = {
    BACKGROUND: 0,
    GRID: 1,
    PLANTS: 2,
    ZOMBIES: 3,
    PROJECTILES: 4,
    SUN: 5,
    UI: 10
};

