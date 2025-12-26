/**
 * UI管理器
 */

export class UIManager {
    constructor() {
        // 获取UI元素
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        
        this.menuScreen = document.getElementById('menu-screen');
        this.winScreen = document.getElementById('win-screen');
        this.loseScreen = document.getElementById('lose-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.confirmScreen = document.getElementById('confirm-screen');
        
        this.sunValueElement = document.getElementById('sun-value');
        this.topBar = document.getElementById('top-bar');
        this.menuStats = document.getElementById('menu-stats');
        this.starRating = document.getElementById('star-rating');
        
        // 按钮
        this.btnStart = document.getElementById('btn-start');
        this.btnNext = document.getElementById('btn-next');
        this.btnRetry = document.getElementById('btn-retry');
        this.btnResume = document.getElementById('btn-resume');
        this.btnPause = document.getElementById('btn-pause');
        this.btnSound = document.getElementById('btn-sound');
        this.btnAlmanac = document.getElementById('btn-almanac');
        this.btnMenuAlmanac = document.getElementById('btn-menu-almanac');
        this.btnMenuReset = document.getElementById('btn-menu-reset');
        this.btnDifficulty = document.getElementById('btn-difficulty');
        this.btnPauseAlmanac = document.getElementById('btn-pause-almanac');
        this.btnQuit = document.getElementById('btn-quit');
        this.btnConfirmReset = document.getElementById('btn-confirm-reset');
        this.btnCancelReset = document.getElementById('btn-cancel-reset');
        
        // 状态
        this.isSoundOn = true;
        
        // 回调
        this.onAlmanacCallback = null;
        this.onResetCallback = null;
        this.onQuitCallback = null;
        this.onDifficultyCallback = null;
        
        this.initEventListeners();
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 暂停按钮
        if (this.btnPause) {
            this.btnPause.addEventListener('click', () => {
                if (this.onPauseCallback) {
                    this.onPauseCallback();
                }
            });
        }
        
        // 音效按钮
        if (this.btnSound) {
            this.btnSound.addEventListener('click', () => {
                this.isSoundOn = !this.isSoundOn;
                this.btnSound.textContent = this.isSoundOn ? '🔊' : '🔇';
                if (this.onSoundToggleCallback) {
                    this.onSoundToggleCallback(this.isSoundOn);
                }
            });
        }
        
        // 继续按钮
        if (this.btnResume) {
            this.btnResume.addEventListener('click', () => {
                if (this.onResumeCallback) {
                    this.onResumeCallback();
                }
            });
        }
        
        // 图鉴按钮（游戏中）
        if (this.btnAlmanac) {
            this.btnAlmanac.addEventListener('click', () => {
                if (this.onAlmanacCallback) {
                    this.onAlmanacCallback();
                }
            });
        }
        
        // 图鉴按钮（菜单）
        if (this.btnMenuAlmanac) {
            this.btnMenuAlmanac.addEventListener('click', () => {
                if (this.onAlmanacCallback) {
                    this.onAlmanacCallback();
                }
            });
        }
        
        // 图鉴按钮（暂停）
        if (this.btnPauseAlmanac) {
            this.btnPauseAlmanac.addEventListener('click', () => {
                if (this.onAlmanacCallback) {
                    this.onAlmanacCallback();
                }
            });
        }
        
        // 难度选择按钮
        if (this.btnDifficulty) {
            this.btnDifficulty.addEventListener('click', () => {
                if (this.onDifficultyCallback) {
                    this.onDifficultyCallback();
                }
            });
        }
        
        // 重置按钮
        if (this.btnMenuReset) {
            this.btnMenuReset.addEventListener('click', () => {
                this.showConfirm();
            });
        }
        
        // 确认重置
        if (this.btnConfirmReset) {
            this.btnConfirmReset.addEventListener('click', () => {
                this.hideConfirm();
                if (this.onResetCallback) {
                    this.onResetCallback();
                }
            });
        }
        
        // 取消重置
        if (this.btnCancelReset) {
            this.btnCancelReset.addEventListener('click', () => {
                this.hideConfirm();
            });
        }
        
        // 返回主菜单
        if (this.btnQuit) {
            this.btnQuit.addEventListener('click', () => {
                if (this.onQuitCallback) {
                    this.onQuitCallback();
                }
            });
        }
    }
    
    /**
     * 显示加载进度
     */
    showLoading(progress, text = '正在加载...') {
        this.loadingScreen.style.display = 'flex';
        this.loadingProgress.style.width = `${progress}%`;
        this.loadingText.textContent = text;
    }
    
    /**
     * 隐藏加载界面
     */
    hideLoading() {
        this.loadingScreen.style.display = 'none';
    }
    
    /**
     * 显示主菜单
     */
    showMenu() {
        this.hideAllScreens();
        this.menuScreen.classList.add('active');
        this.topBar.style.display = 'none';
    }
    
    /**
     * 隐藏主菜单
     */
    hideMenu() {
        this.menuScreen.classList.remove('active');
        this.topBar.style.display = 'flex';
    }
    
    /**
     * 更新菜单统计显示
     */
    updateMenuStats(stats) {
        if (this.menuStats) {
            this.menuStats.innerHTML = `
                ⭐ 总星数: ${stats.totalStars || 0} | 
                🎮 已玩: ${stats.totalGamesPlayed || 0}次 | 
                🏆 胜利: ${stats.totalWins || 0}次
            `;
        }
    }
    
    /**
     * 显示胜利界面
     */
    showWin(stars = 3) {
        this.winScreen.classList.add('active');
        this.updateStarRating(stars);
    }
    
    /**
     * 更新星级显示
     */
    updateStarRating(stars) {
        if (this.starRating) {
            const starElements = this.starRating.querySelectorAll('.star');
            starElements.forEach((star, index) => {
                star.classList.toggle('earned', index < stars);
            });
        }
    }
    
    /**
     * 隐藏胜利界面
     */
    hideWin() {
        this.winScreen.classList.remove('active');
    }
    
    /**
     * 显示失败界面
     */
    showLose() {
        this.loseScreen.classList.add('active');
    }
    
    /**
     * 隐藏失败界面
     */
    hideLose() {
        this.loseScreen.classList.remove('active');
    }
    
    /**
     * 显示暂停界面
     */
    showPause() {
        this.pauseScreen.classList.add('active');
    }
    
    /**
     * 隐藏暂停界面
     */
    hidePause() {
        this.pauseScreen.classList.remove('active');
    }
    
    /**
     * 显示确认对话框
     */
    showConfirm() {
        if (this.confirmScreen) {
            this.confirmScreen.classList.add('active');
        }
    }
    
    /**
     * 隐藏确认对话框
     */
    hideConfirm() {
        if (this.confirmScreen) {
            this.confirmScreen.classList.remove('active');
        }
    }
    
    /**
     * 隐藏所有覆盖界面
     */
    hideAllScreens() {
        this.menuScreen.classList.remove('active');
        this.winScreen.classList.remove('active');
        this.loseScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        if (this.confirmScreen) {
            this.confirmScreen.classList.remove('active');
        }
    }
    
    /**
     * 更新阳光显示
     */
    updateSunDisplay(value) {
        this.sunValueElement.textContent = value;
        
        // 数字变化动画
        this.sunValueElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.sunValueElement.style.transform = 'scale(1)';
        }, 100);
    }
    
    /**
     * 设置开始按钮回调
     */
    onStartClick(callback) {
        if (this.btnStart) {
            this.btnStart.addEventListener('click', callback);
        }
    }
    
    /**
     * 设置下一关按钮回调
     */
    onNextClick(callback) {
        if (this.btnNext) {
            this.btnNext.addEventListener('click', callback);
        }
    }
    
    /**
     * 设置重试按钮回调
     */
    onRetryClick(callback) {
        if (this.btnRetry) {
            this.btnRetry.addEventListener('click', callback);
        }
    }
    
    /**
     * 设置暂停回调
     */
    onPause(callback) {
        this.onPauseCallback = callback;
    }
    
    /**
     * 设置继续回调
     */
    onResume(callback) {
        this.onResumeCallback = callback;
    }
    
    /**
     * 设置音效切换回调
     */
    onSoundToggle(callback) {
        this.onSoundToggleCallback = callback;
    }
    
    /**
     * 设置图鉴回调
     */
    onAlmanac(callback) {
        this.onAlmanacCallback = callback;
    }
    
    /**
     * 设置重置回调
     */
    onReset(callback) {
        this.onResetCallback = callback;
    }
    
    /**
     * 设置退出回调
     */
    onQuit(callback) {
        this.onQuitCallback = callback;
    }
    
    /**
     * 设置难度选择回调
     */
    onDifficultyClick(callback) {
        this.onDifficultyCallback = callback;
    }
    
    /**
     * 设置音效按钮状态
     */
    setSoundEnabled(enabled) {
        this.isSoundOn = enabled;
        if (this.btnSound) {
            this.btnSound.textContent = enabled ? '🔊' : '🔇';
        }
    }
}
