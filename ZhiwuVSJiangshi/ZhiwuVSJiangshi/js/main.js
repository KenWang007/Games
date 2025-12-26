/**
 * 植物大战僵尸 - 网页版
 * 入口文件
 */

import { Game } from './core/Game.js';

// 等待所有资源加载完成（包括CSS布局）
window.addEventListener('load', () => {
    console.log('🌻 植物大战僵尸 - 网页版');
    console.log('适合10岁以下小朋友的卡通塔防游戏');
    
    // 使用setTimeout确保Canvas完全渲染
    setTimeout(() => {
        console.log('🎮 开始初始化游戏...');
        
        // 创建游戏实例
        const game = new Game('game-canvas');
        
        // 暴露到全局（用于调试）
        window.game = game;
        
        console.log('✅ 游戏初始化完成！点击"开始游戏"开始玩吧！');
    }, 100); // 延迟100ms确保Canvas布局完成
});

