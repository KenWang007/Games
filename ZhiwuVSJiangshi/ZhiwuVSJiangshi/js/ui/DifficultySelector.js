/**
 * 难度选择器组件
 */

import { getAllDifficulties } from '../config/difficulty.js';

export class DifficultySelector {
    constructor() {
        this.currentDifficulty = 'normal';
        this.onDifficultyChange = null;
        this.overlay = null;
        this.createOverlay();
    }
    
    /**
     * 创建难度选择界面
     */
    createOverlay() {
        // 如果已存在，先移除
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'difficulty-selector-overlay';
        this.overlay.innerHTML = `
            <div class="difficulty-selector-container">
                <div class="difficulty-selector-header">
                    <h2>🎮 选择难度</h2>
                    <button class="difficulty-selector-close">✕</button>
                </div>
                <div class="difficulty-selector-content">
                    <p class="difficulty-selector-hint">选择适合你的难度等级</p>
                    <div class="difficulty-grid" id="difficulty-grid"></div>
                </div>
            </div>
        `;
        
        this.addStyles();
        this.bindEvents();
        this.renderDifficulties();
        
        document.body.appendChild(this.overlay);
    }
    
    /**
     * 添加样式
     */
    addStyles() {
        if (document.getElementById('difficulty-selector-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'difficulty-selector-styles';
        style.textContent = `
            .difficulty-selector-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }
            
            .difficulty-selector-overlay.active {
                display: flex;
            }
            
            .difficulty-selector-container {
                width: 700px;
                max-width: 95vw;
                background: linear-gradient(180deg, #F5DEB3 0%, #DEB887 100%);
                border-radius: 20px;
                border: 4px solid #8B4513;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }
            
            .difficulty-selector-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: #8B4513;
                color: white;
            }
            
            .difficulty-selector-header h2 {
                margin: 0;
                font-size: 1.8rem;
                font-family: 'Comic Sans MS', cursive;
            }
            
            .difficulty-selector-close {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: #F44336;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .difficulty-selector-close:hover {
                transform: scale(1.1);
            }
            
            .difficulty-selector-content {
                padding: 30px;
            }
            
            .difficulty-selector-hint {
                text-align: center;
                color: #666;
                font-size: 1rem;
                margin-bottom: 20px;
                font-family: 'Comic Sans MS', cursive;
            }
            
            .difficulty-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            
            .difficulty-card {
                background: rgba(255, 255, 255, 0.9);
                border: 3px solid #8B4513;
                border-radius: 15px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                position: relative;
            }
            
            .difficulty-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .difficulty-card.selected {
                border-color: #FFD700;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                background: linear-gradient(180deg, #FFF8DC 0%, #FFE4B5 100%);
            }
            
            .difficulty-icon {
                font-size: 4rem;
                margin-bottom: 10px;
                display: block;
            }
            
            .difficulty-name {
                font-size: 1.5rem;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                font-family: 'Comic Sans MS', cursive;
            }
            
            .difficulty-description {
                font-size: 0.9rem;
                color: #666;
                line-height: 1.5;
                margin-bottom: 15px;
                font-family: 'Comic Sans MS', cursive;
            }
            
            .difficulty-features {
                text-align: left;
                font-size: 0.85rem;
                color: #555;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px dashed #CCC;
            }
            
            .difficulty-features ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .difficulty-features li {
                margin-bottom: 5px;
            }
            
            .difficulty-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #4CAF50;
                color: white;
                padding: 5px 10px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-weight: bold;
            }
            
            .difficulty-badge.hard {
                background: #F44336;
            }
            
            .difficulty-badge.nightmare {
                background: #9C27B0;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 关闭按钮
        this.overlay.querySelector('.difficulty-selector-close').addEventListener('click', () => {
            this.hide();
        });
        
        // 点击背景关闭
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }
    
    /**
     * 渲染难度选项
     */
    renderDifficulties() {
        const grid = this.overlay.querySelector('#difficulty-grid');
        grid.innerHTML = '';
        
        const difficulties = getAllDifficulties();
        const features = {
            easy: ['僵尸移动速度慢', '阳光充足', '僵尸血量较低', '适合新手'],
            normal: ['标准游戏体验', '平衡的难度', '适合大多数玩家'],
            hard: ['僵尸移动更快', '资源紧张', '僵尸更强', '需要策略'],
            nightmare: ['僵尸速度翻倍', '资源极度匮乏', '僵尸血量翻倍', '极限挑战']
        };
        
        difficulties.forEach(diff => {
            const card = document.createElement('div');
            card.className = `difficulty-card ${this.currentDifficulty === diff.id ? 'selected' : ''}`;
            card.dataset.difficulty = diff.id;
            
            const badgeClass = diff.id === 'hard' || diff.id === 'nightmare' ? diff.id : '';
            const badgeText = diff.id === 'easy' ? '推荐' : diff.id === 'normal' ? '标准' : diff.id === 'hard' ? '挑战' : '极限';
            
            card.innerHTML = `
                <span class="difficulty-badge ${badgeClass}">${badgeText}</span>
                <span class="difficulty-icon">${diff.icon}</span>
                <div class="difficulty-name" style="color: ${diff.color}">${diff.name}</div>
                <div class="difficulty-description">${diff.description}</div>
                <div class="difficulty-features">
                    <ul>
                        ${features[diff.id].map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            card.addEventListener('click', () => {
                this.selectDifficulty(diff.id);
            });
            
            grid.appendChild(card);
        });
    }
    
    /**
     * 选择难度
     */
    selectDifficulty(difficultyId) {
        this.currentDifficulty = difficultyId;
        this.renderDifficulties();
        
        if (this.onDifficultyChange) {
            this.onDifficultyChange(difficultyId);
        }
        
        // 延迟关闭，让用户看到选中效果
        setTimeout(() => {
            this.hide();
        }, 300);
    }
    
    /**
     * 显示难度选择器
     */
    show(currentDifficulty = 'normal') {
        if (!this.overlay) {
            this.createOverlay();
        }
        
        // 确保 overlay 在 DOM 中
        if (!document.body.contains(this.overlay)) {
            document.body.appendChild(this.overlay);
        }
        
        this.currentDifficulty = currentDifficulty;
        this.renderDifficulties();
        this.overlay.classList.add('active');
    }
    
    /**
     * 隐藏难度选择器
     */
    hide() {
        this.overlay.classList.remove('active');
    }
    
    /**
     * 设置难度变更回调
     */
    onDifficultySelected(callback) {
        this.onDifficultyChange = callback;
    }
}

