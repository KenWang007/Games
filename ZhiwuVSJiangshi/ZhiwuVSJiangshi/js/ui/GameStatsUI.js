/**
 * 游戏统计信息UI组件
 * 显示关卡、积分、消灭僵尸数、等级和徽章
 */

export class GameStatsUI {
    constructor() {
        // 等级配置
        this.levelConfig = [
            { minKills: 0, level: 1, title: '新手园丁', badge: '🌱', color: '#90EE90' },
            { minKills: 10, level: 2, title: '初级守护者', badge: '🌿', color: '#32CD32' },
            { minKills: 30, level: 3, title: '植物学徒', badge: '🌻', color: '#FFD700' },
            { minKills: 60, level: 4, title: '花园卫士', badge: '🛡️', color: '#4169E1' },
            { minKills: 100, level: 5, title: '僵尸克星', badge: '⚔️', color: '#FF6347' },
            { minKills: 150, level: 6, title: '植物大师', badge: '🏆', color: '#9932CC' },
            { minKills: 200, level: 7, title: '传奇园丁', badge: '👑', color: '#FFD700' },
            { minKills: 300, level: 8, title: '植物英雄', badge: '🦸', color: '#FF4500' },
            { minKills: 500, level: 9, title: '僵尸终结者', badge: '💀', color: '#8B0000' },
            { minKills: 1000, level: 10, title: '花园之神', badge: '🌟', color: '#FFD700' }
        ];
        
        // 动画状态
        this.scoreAnimation = 0;
        this.lastScore = 100;
        this.displayScore = 100; // 初始分数至少100
        this.levelUpAnimation = 0;
        this.lastLevel = 1;
        
        // 用户偏好设置 - 从localStorage读取
        this.isStatsVisible = this.loadStatsPreference();
        
        // 按钮绑定标志
        this.buttonBound = false;
        
        // 创建HTML侧边栏
        this.createSidebar();
        
        // 绑定切换按钮事件（延迟执行）
        this.bindToggleButton();
        
        // 应用初始显示状态
        this.applyInitialState();
    }
    
    /**
     * 应用初始显示状态
     */
    applyInitialState() {
        // 根据用户偏好设置初始状态
        if (this.isStatsVisible) {
            // 不立即显示，等待游戏调用show()
        } else {
            this.hide();
        }
    }
    
    /**
     * 从localStorage加载统计面板显示偏好
     */
    loadStatsPreference() {
        try {
            const saved = localStorage.getItem('pvz_stats_visible');
            // 默认显示，除非用户明确设置为隐藏
            return saved === null ? true : saved === 'true';
        } catch (e) {
            return true;
        }
    }
    
    /**
     * 保存统计面板显示偏好到localStorage
     */
    saveStatsPreference(visible) {
        try {
            localStorage.setItem('pvz_stats_visible', visible);
        } catch (e) {
            console.warn('无法保存统计面板偏好设置');
        }
    }
    
    /**
     * 绑定切换按钮事件
     */
    bindToggleButton() {
        // 使用 setTimeout 确保 DOM 完全加载
        setTimeout(() => {
            const toggleBtn = document.getElementById('btn-toggle-stats');
            if (toggleBtn) {
                // 移除可能存在的旧事件监听器
                toggleBtn.replaceWith(toggleBtn.cloneNode(true));
                const newBtn = document.getElementById('btn-toggle-stats');
                
                newBtn.addEventListener('click', () => {
                    console.log('统计面板切换按钮被点击');
                    this.toggleStats();
                });
                
                // 更新按钮图标
                this.updateToggleButton();
                console.log('统计面板切换按钮已绑定');
            } else {
                console.warn('未找到统计面板切换按钮 #btn-toggle-stats');
            }
        }, 500);
    }
    
    /**
     * 切换统计面板显示/隐藏
     */
    toggleStats() {
        // 检查是否在移动端横屏模式
        const isMobileLandscape = window.innerWidth <= 920 && window.matchMedia('(orientation: landscape)').matches;
        
        if (isMobileLandscape && !this.isStatsVisible) {
            // 在移动端横屏时，不允许显示统计面板
            this.showToggleToast('横屏模式下无法显示统计面板');
            return;
        }
        
        this.isStatsVisible = !this.isStatsVisible;
        this.saveStatsPreference(this.isStatsVisible);
        
        if (this.isStatsVisible) {
            this.forceShow();
        } else {
            this.hide();
        }
        
        this.updateToggleButton();
        
        // 添加提示
        this.showToggleToast(this.isStatsVisible ? '统计面板已显示 📊' : '统计面板已隐藏 📋');
    }
    
    /**
     * 更新切换按钮的图标
     */
    updateToggleButton() {
        const toggleBtn = document.getElementById('btn-toggle-stats');
        if (toggleBtn) {
            toggleBtn.textContent = this.isStatsVisible ? '📊' : '📋';
            toggleBtn.title = this.isStatsVisible ? '隐藏统计面板' : '显示统计面板';
        }
    }
    
    /**
     * 显示切换提示
     */
    showToggleToast(message) {
        // 创建或获取提示元素
        let toast = document.getElementById('stats-toggle-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'stats-toggle-toast';
            toast.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }
    
    /**
     * 创建HTML侧边栏
     */
    createSidebar() {
        // 检查是否已存在
        if (document.getElementById('game-stats-sidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.id = 'game-stats-sidebar';
        sidebar.innerHTML = `
            <div class="stats-header">
                <span class="stats-badge" id="stats-badge">🌱</span>
                <div class="stats-title-area">
                    <div class="stats-title" id="stats-title">新手园丁</div>
                    <div class="stats-level" id="stats-level">Lv.1</div>
                </div>
            </div>
            <div class="stats-progress-area">
                <div class="stats-progress-bar">
                    <div class="stats-progress-fill" id="stats-progress-fill"></div>
                </div>
                <div class="stats-progress-text" id="stats-progress-text">还需 10 只</div>
            </div>
            <div class="stats-divider"></div>
            <div class="stats-row">
                <span class="stats-label">🎯 累计积分</span>
                <span class="stats-value" id="stats-score">0</span>
            </div>
            <div class="stats-row">
                <span class="stats-label">🧟 消灭僵尸</span>
                <span class="stats-value" id="stats-kills">0 只</span>
            </div>
            <div class="stats-divider"></div>
            <div class="stats-section-title">本局战绩</div>
            <div class="stats-row small">
                <span class="stats-label">🎯 难度等级</span>
                <span class="stats-value difficulty-badge" id="stats-difficulty">普通</span>
            </div>
            <div class="stats-row small">
                <span class="stats-label">🎮 当前关卡</span>
                <span class="stats-value" id="stats-current-level">第 1 关</span>
            </div>
            <div class="stats-row small">
                <span class="stats-label">🌊 波次进度</span>
                <span class="stats-value" id="stats-wave">1/3</span>
            </div>
            <div class="stats-row small">
                <span class="stats-label">💀 本局击杀</span>
                <span class="stats-value" id="stats-session-kills">0</span>
            </div>
            <div class="stats-row small">
                <span class="stats-label">☀️ 收集阳光</span>
                <span class="stats-value" id="stats-session-sun">0</span>
            </div>
        `;
        
        // 添加样式
        this.addStyles();
        
        document.body.appendChild(sidebar);
        this.sidebar = sidebar;
    }
    
    /**
     * 添加侧边栏样式
     */
    addStyles() {
        if (document.getElementById('game-stats-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'game-stats-styles';
        style.textContent = `
            #game-stats-sidebar {
                position: fixed;
                right: calc(50% - 900px / 2 - 260px);
                top: calc(50% - 600px / 2);
                width: 240px;
                height: 600px;
                background: linear-gradient(180deg, rgba(30, 60, 30, 0.95) 0%, rgba(20, 40, 20, 0.95) 100%);
                border: 3px solid #4CAF50;
                border-radius: 15px;
                padding: 20px;
                font-family: 'Comic Sans MS', cursive;
                color: #FFF;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                display: none;
                z-index: 100;
                overflow-y: auto;
            }
            
            #game-stats-sidebar.visible {
                display: flex;
                flex-direction: column;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* 针对小屏幕的响应式设计 */
            @media (max-width: 1200px) {
                #game-stats-sidebar {
                    right: 10px;
                    width: 200px;
                    height: auto;
                    max-height: 90vh;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            
            /* 移动端横屏模式 - 完全隐藏统计面板 */
            @media (max-width: 920px) and (orientation: landscape) {
                #game-stats-sidebar {
                    display: none !important;
                }
                
                #game-stats-sidebar.visible {
                    display: none !important;
                }
            }
            
            .stats-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            
            .stats-badge {
                font-size: 42px;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                transition: transform 0.3s ease;
            }
            
            .stats-badge.level-up {
                animation: badgePulse 0.5s ease-out;
            }
            
            @keyframes badgePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            
            .stats-title-area {
                flex: 1;
            }
            
            .stats-title {
                font-size: 16px;
                font-weight: bold;
                color: #90EE90;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                transition: color 0.3s ease;
            }
            
            .stats-level {
                font-size: 13px;
                color: #AAA;
            }
            
            .stats-progress-area {
                margin-bottom: 12px;
            }
            
            .stats-progress-bar {
                height: 10px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .stats-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                border-radius: 5px;
                transition: width 0.3s ease;
                width: 0%;
            }
            
            .stats-progress-text {
                font-size: 11px;
                color: #888;
                text-align: center;
            }
            
            .stats-divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                margin: 10px 0;
            }
            
            .stats-section-title {
                font-size: 13px;
                color: #8BC34A;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .stats-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .stats-row.small {
                margin-bottom: 8px;
            }
            
            .stats-row.small .stats-label {
                font-size: 13px;
            }
            
            .stats-row.small .stats-value {
                font-size: 14px;
            }
            
            .stats-label {
                font-size: 14px;
                color: #CCC;
            }
            
            .stats-value {
                font-size: 16px;
                font-weight: bold;
                color: #FFD700;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            #stats-kills {
                color: #FF6B6B;
            }
            
            #stats-session-kills {
                color: #FF6B6B;
            }
            
            #stats-session-sun {
                color: #FFD700;
            }
            
            .difficulty-badge {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px !important;
            }
            
            .difficulty-badge.easy {
                background: rgba(76, 175, 80, 0.3);
                color: #8BC34A !important;
            }
            
            .difficulty-badge.normal {
                background: rgba(33, 150, 243, 0.3);
                color: #64B5F6 !important;
            }
            
            .difficulty-badge.hard {
                background: rgba(255, 152, 0, 0.3);
                color: #FFB74D !important;
            }
            
            .difficulty-badge.nightmare {
                background: rgba(156, 39, 176, 0.3);
                color: #CE93D8 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 显示侧边栏
     */
    show() {
        if (this.sidebar && this.isStatsVisible) {
            this.sidebar.classList.add('visible');
        }
        // 确保按钮已绑定
        this.ensureButtonBound();
    }
    
    /**
     * 强制显示侧边栏（忽略用户偏好，用于初始化）
     */
    forceShow() {
        if (this.sidebar) {
            this.sidebar.classList.add('visible');
        }
        // 确保按钮已绑定
        this.ensureButtonBound();
    }
    
    /**
     * 确保切换按钮已绑定
     */
    ensureButtonBound() {
        if (!this.buttonBound) {
            this.bindToggleButton();
            this.buttonBound = true;
        }
    }
    
    /**
     * 隐藏侧边栏
     */
    hide() {
        if (this.sidebar) {
            this.sidebar.classList.remove('visible');
        }
    }
    
    /**
     * 根据击杀数获取等级信息
     */
    getLevelInfo(totalKills) {
        let levelInfo = this.levelConfig[0];
        
        for (const config of this.levelConfig) {
            if (totalKills >= config.minKills) {
                levelInfo = config;
            } else {
                break;
            }
        }
        
        // 计算到下一级的进度
        const currentIndex = this.levelConfig.indexOf(levelInfo);
        const nextLevel = this.levelConfig[currentIndex + 1];
        
        let progress = 1;
        let killsToNext = 0;
        
        if (nextLevel) {
            const killsInLevel = totalKills - levelInfo.minKills;
            const killsNeeded = nextLevel.minKills - levelInfo.minKills;
            progress = killsInLevel / killsNeeded;
            killsToNext = nextLevel.minKills - totalKills;
        }
        
        return {
            ...levelInfo,
            progress,
            killsToNext,
            isMaxLevel: !nextLevel
        };
    }
    
    /**
     * 计算积分
     */
    calculateScore(stats) {
        // 积分计算公式
        const zombieScore = stats.totalZombiesKilled * 100;
        const sunScore = Math.floor(stats.totalSunCollected / 10) * 10;
        const plantScore = stats.totalPlantsPlanted * 20;
        const winBonus = stats.totalWins * 500;
        
        const totalScore = zombieScore + sunScore + plantScore + winBonus;
        
        // 确保分数至少是100分
        return Math.max(100, totalScore);
    }
    
    /**
     * 更新动画
     */
    update(deltaTime, currentScore, totalKills) {
        // 分数滚动动画
        if (this.displayScore !== currentScore) {
            const diff = currentScore - this.displayScore;
            const step = Math.max(1, Math.abs(diff) * 0.1);
            
            if (diff > 0) {
                this.displayScore = Math.min(currentScore, this.displayScore + step);
            } else {
                this.displayScore = Math.max(currentScore, this.displayScore - step);
            }
        }
        
        // 等级提升动画
        const levelInfo = this.getLevelInfo(totalKills);
        if (levelInfo.level > this.lastLevel) {
            this.levelUpAnimation = 1;
            this.lastLevel = levelInfo.level;
        }
        
        if (this.levelUpAnimation > 0) {
            this.levelUpAnimation -= deltaTime * 0.001;
        }
    }
    
    /**
     * 渲染游戏内统计信息面板
     */
    render(ctx, gameData) {
        const { currentLevel, levelConfig, sessionStats, totalStats, waveProgress, difficultyConfig } = gameData;
        
        // 计算当前积分和等级
        const totalKills = totalStats.totalZombiesKilled + sessionStats.zombiesKilled;
        const score = this.calculateScore({
            ...totalStats,
            totalZombiesKilled: totalKills,
            totalSunCollected: totalStats.totalSunCollected + sessionStats.sunCollected,
            totalPlantsPlanted: totalStats.totalPlantsPlanted + sessionStats.plantsPlanted
        });
        
        const levelInfo = this.getLevelInfo(totalKills);
        
        // 更新动画
        this.update(16.67, score, totalKills);
        
        // 更新HTML侧边栏
        this.updateSidebar(currentLevel, levelConfig, sessionStats, waveProgress, score, totalKills, levelInfo, difficultyConfig);
        
        // 不在Canvas上绘制顶部信息，避免与HTML顶部栏重叠
        // 所有信息已在右侧统计面板显示
    }
    
    /**
     * 更新HTML侧边栏内容
     */
    updateSidebar(currentLevel, levelConfig, sessionStats, waveProgress, score, totalKills, levelInfo, difficultyConfig) {
        // 更新徽章
        const badgeEl = document.getElementById('stats-badge');
        if (badgeEl) {
            if (badgeEl.textContent !== levelInfo.badge) {
                badgeEl.textContent = levelInfo.badge;
                badgeEl.classList.add('level-up');
                setTimeout(() => badgeEl.classList.remove('level-up'), 500);
            }
        }
        
        // 更新称号
        const titleEl = document.getElementById('stats-title');
        if (titleEl) {
            titleEl.textContent = levelInfo.title;
            titleEl.style.color = levelInfo.color;
        }
        
        // 更新等级
        const levelEl = document.getElementById('stats-level');
        if (levelEl) {
            levelEl.textContent = `Lv.${levelInfo.level}`;
        }
        
        // 更新进度条
        const progressFill = document.getElementById('stats-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${levelInfo.progress * 100}%`;
            progressFill.style.background = `linear-gradient(90deg, ${levelInfo.color}, ${this.adjustColor(levelInfo.color, 30)})`;
        }
        
        // 更新进度文字
        const progressText = document.getElementById('stats-progress-text');
        if (progressText) {
            if (levelInfo.isMaxLevel) {
                progressText.textContent = '✨ 已达最高等级 ✨';
                progressText.style.color = '#FFD700';
            } else {
                progressText.textContent = `还需 ${levelInfo.killsToNext} 只`;
                progressText.style.color = '#888';
            }
        }
        
        // 更新积分
        const scoreEl = document.getElementById('stats-score');
        if (scoreEl) {
            scoreEl.textContent = Math.floor(this.displayScore).toLocaleString();
        }
        
        // 更新总击杀
        const killsEl = document.getElementById('stats-kills');
        if (killsEl) {
            killsEl.textContent = `${totalKills} 只`;
        }
        
        // 更新当前关卡
        const currentLevelEl = document.getElementById('stats-current-level');
        if (currentLevelEl) {
            currentLevelEl.textContent = `第 ${currentLevel} 关`;
        }
        
        // 更新波次
        const waveEl = document.getElementById('stats-wave');
        if (waveEl) {
            waveEl.textContent = `${waveProgress.currentWave}/${waveProgress.totalWaves}`;
        }
        
        // 更新本局击杀
        const sessionKillsEl = document.getElementById('stats-session-kills');
        if (sessionKillsEl) {
            sessionKillsEl.textContent = sessionStats.zombiesKilled;
        }
        
        // 更新本局阳光
        const sessionSunEl = document.getElementById('stats-session-sun');
        if (sessionSunEl) {
            sessionSunEl.textContent = sessionStats.sunCollected;
        }
        
        // 更新难度显示
        const difficultyEl = document.getElementById('stats-difficulty');
        if (difficultyEl && difficultyConfig) {
            difficultyEl.textContent = `${difficultyConfig.icon} ${difficultyConfig.name}`;
            difficultyEl.className = `stats-value difficulty-badge ${difficultyConfig.id}`;
        }
    }
    
    /**
     * 渲染顶部信息栏（简洁版，只显示关卡和波次）
     */
    renderTopBar(ctx, currentLevel, levelConfig, waveProgress) {
        // 左上角关卡信息背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.roundRect(5, 5, 140, 40, 8);
        ctx.fill();
        
        // 关卡文字
        ctx.font = 'bold 16px "Comic Sans MS", cursive';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'left';
        ctx.fillText(`第 ${currentLevel} 关`, 12, 25);
        
        ctx.font = '11px "Comic Sans MS", cursive';
        ctx.fillStyle = '#CCC';
        ctx.fillText(levelConfig ? levelConfig.name : '', 12, 40);
        
        // 波次进度（右上角）
        const progressBarX = 155;
        const progressBarY = 12;
        const progressBarWidth = 120;
        const progressBarHeight = 16;
        
        // 进度条背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.roundRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 8);
        ctx.fill();
        
        // 进度条填充
        const progress = waveProgress.currentWave / waveProgress.totalWaves;
        const progressGradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
        progressGradient.addColorStop(0, '#4CAF50');
        progressGradient.addColorStop(1, '#8BC34A');
        ctx.fillStyle = progressGradient;
        ctx.beginPath();
        ctx.roundRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight, 8);
        ctx.fill();
        
        // 进度文字
        ctx.font = 'bold 11px "Comic Sans MS", cursive';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.fillText(`波次 ${waveProgress.currentWave}/${waveProgress.totalWaves}`, progressBarX + progressBarWidth / 2, progressBarY + 12);
    }
    
    /**
     * 调整颜色亮度
     */
    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    /**
     * 渲染等级提升动画
     */
    renderLevelUpEffect(ctx, levelInfo) {
        if (this.levelUpAnimation <= 0) return;
        
        const alpha = this.levelUpAnimation;
        const scale = 1 + (1 - this.levelUpAnimation) * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(475, 300);
        ctx.scale(scale, scale);
        
        // 光芒效果
        ctx.fillStyle = levelInfo.color;
        ctx.shadowColor = levelInfo.color;
        ctx.shadowBlur = 30;
        
        ctx.font = 'bold 48px "Comic Sans MS", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 等级提升! 🎉', 0, -20);
        
        ctx.font = 'bold 36px "Comic Sans MS", cursive';
        ctx.fillText(`${levelInfo.badge} ${levelInfo.title}`, 0, 30);
        
        ctx.restore();
    }
}

