/**
 * 游戏常量定义
 */

// 游戏面板尺寸
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 28;

// 游戏时间参数
export const LOCK_DELAY = 500;        // 锁定延迟（毫秒）
export const SOFT_DROP_SPEED = 50;    // 软降速度（毫秒/格）
export const DAS_DELAY = 170;         // 延迟自动移动（毫秒）
export const ARR_SPEED = 50;          // 自动重复速度（毫秒）

// 动画时间
export const LINE_CLEAR_DURATION = 300;   // 消行动画时长
export const LEVEL_UP_DURATION = 1000;    // 升级动画时长
export const FIREWORK_DURATION = 3000;    // 烟花持续时间

// 游戏状态
export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// 游戏事件
export const GAME_EVENTS = {
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  
  PIECE_SPAWN: 'piece:spawn',
  PIECE_MOVE: 'piece:move',
  PIECE_ROTATE: 'piece:rotate',
  PIECE_LOCK: 'piece:lock',
  PIECE_HARD_DROP: 'piece:hardDrop',
  
  LINES_CLEAR: 'lines:clear',
  SCORE_UPDATE: 'score:update',
  LEVEL_UP: 'level:up',
  
  HIGH_SCORE_BEAT: 'highscore:beat'
};

// 方块类型
export const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// 方块形状定义（每种方块的4个旋转状态）
export const TETROMINO_SHAPES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]]
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
  ]
};

// 方块颜色
export const TETROMINO_COLORS = {
  I: '#4FC3F7',  // 天蓝色
  O: '#FFD54F',  // 金黄色
  T: '#BA68C8',  // 紫色
  S: '#81C784',  // 草绿色
  Z: '#FF8A65',  // 珊瑚红
  J: '#64B5F6',  // 深蓝色
  L: '#FFB74D'   // 橙色
};

// 踢墙数据（SRS标准）
export const WALL_KICK_DATA = {
  // JLSTZ方块的踢墙数据
  JLSTZ: {
    '0->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '1->0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '1->2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '2->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '2->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    '3->2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '3->0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '0->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
  },
  // I方块的踢墙数据
  I: {
    '0->1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '1->0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '1->2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    '2->1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '2->3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '3->2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '3->0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '0->3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
  }
};

// 积分规则
export const SCORE_TABLE = {
  1: 100,   // 消除1行
  2: 300,   // 消除2行
  3: 500,   // 消除3行
  4: 800    // 消除4行（俄罗斯方块！）
};

// 等级系统
export const LEVELS = [
  { level: 1,  score: 0,      icon: '🐣', name: '新手蛋蛋',     speed: 1000 },
  { level: 2,  score: 1000,   icon: '🐥', name: '小黄鸡',       speed: 900 },
  { level: 3,  score: 3000,   icon: '🐤', name: '快乐鸟',       speed: 800 },
  { level: 4,  score: 6000,   icon: '🐔', name: '聪明鸡',       speed: 700 },
  { level: 5,  score: 10000,  icon: '🦅', name: '飞翔鹰',       speed: 600 },
  { level: 6,  score: 15000,  icon: '🦄', name: '神奇独角兽',   speed: 500 },
  { level: 7,  score: 25000,  icon: '🐉', name: '传说龙龙',     speed: 450 },
  { level: 8,  score: 40000,  icon: '⭐', name: '超级明星',     speed: 400 },
  { level: 9,  score: 60000,  icon: '🌟', name: '闪耀之星',     speed: 350 },
  { level: 10, score: 100000, icon: '👑', name: '方块大王',     speed: 300 }
];

// 烟花颜色
export const FIREWORK_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF69B4',
  '#FFD700', '#00CED1'
];

// 背景颜色
export const COLORS = {
  BG_GRADIENT_START: '#E0F7FA',
  BG_GRADIENT_END: '#F3E5F5',
  GRID_LINE: 'rgba(0, 0, 0, 0.08)',
  GHOST_PIECE: 'rgba(0, 0, 0, 0.15)',
  PANEL_BG: 'rgba(255, 255, 255, 0.95)'
};

// 存储键名
export const STORAGE_KEYS = {
  HIGH_SCORE: 'tetris_highScore',
  RECENT_SCORES: 'tetris_recentScores',
  SETTINGS: 'tetris_settings'
};

// 难度配置
export const DIFFICULTY_LEVELS = {
  easy: {
    id: 'easy',
    name: '简单',
    icon: '🌱',
    description: '适合初学者',
    speedMultiplier: 1.5,    // 速度变慢50%
    scoreMultiplier: 0.5,    // 得分减半
    color: '#81C784'         // 绿色
  },
  normal: {
    id: 'normal',
    name: '普通',
    icon: '⭐',
    description: '标准难度',
    speedMultiplier: 1.0,    // 标准速度
    scoreMultiplier: 1.0,    // 标准得分
    color: '#64B5F6'         // 蓝色
  },
  hard: {
    id: 'hard',
    name: '困难',
    icon: '🔥',
    description: '挑战高手',
    speedMultiplier: 0.6,    // 速度加快40%
    scoreMultiplier: 1.5,    // 得分1.5倍
    color: '#FF8A65'         // 橙红色
  }
};

