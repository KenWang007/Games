/**
 * 植物大战僵尸 - 网页版
 * 入口文件
 */

import { Game } from './core/Game.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌻 植物大战僵尸 - 网页版');
    console.log('适合10岁以下小朋友的卡通塔防游戏');
    
    // 创建游戏实例
    const game = new Game('game-canvas');
    
    // 暴露到全局（用于调试）
    window.game = game;
    
    console.log('游戏初始化完成！点击"开始游戏"开始玩吧！');
});

