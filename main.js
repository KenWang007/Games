// 游戏中心主脚本
// 提供增强的用户体验和交互效果

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        animationDuration: 300,
        particleCount: 20,
        enableParticles: true,
        enableSoundEffects: false // 音效默认关闭，可以根据需要启用
    };

    // ==================== 初始化 ====================
    document.addEventListener('DOMContentLoaded', function() {
        initGameCards();
        initAccessibility();
        addKeyboardNavigation();
        logGameHubInfo();
        registerServiceWorker();
    });

    // ==================== Service Worker 注册 ====================
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('%c✅ Service Worker 注册成功', 'color: #66BB6A; font-size: 12px;');
                    console.log('Scope:', registration.scope);
                })
                .catch((error) => {
                    console.log('%c❌ Service Worker 注册失败', 'color: #FF6B9D; font-size: 12px;');
                    console.log('Error:', error);
                });
        }
    }

    // ==================== 游戏卡片初始化 ====================
    function initGameCards() {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach((card, index) => {
            // 为每个卡片添加点击效果
            const button = card.querySelector('.card-button');
            
            if (button) {
                button.addEventListener('click', function(e) {
                    handleGameSelection(e, card, button.href);
                });

                // 添加鼠标移入效果
                card.addEventListener('mouseenter', function() {
                    card.style.setProperty('--hover-scale', '1.02');
                });

                card.addEventListener('mouseleave', function() {
                    card.style.setProperty('--hover-scale', '1');
                });
            }

            // 为每个卡片添加唯一标识
            card.setAttribute('data-game-index', index);
        });
    }

    // ==================== 游戏选择处理 ====================
    function handleGameSelection(event, card, gameUrl) {
        // 可选：添加粒子效果
        if (CONFIG.enableParticles) {
            createParticleEffect(event.clientX, event.clientY, card);
        }

        // 记录选择的游戏
        const gameTitle = card.querySelector('.card-title').textContent;
        logGameSelection(gameTitle);

        // 可选：添加点击动画
        card.classList.add('card-clicked');
        setTimeout(() => {
            card.classList.remove('card-clicked');
        }, CONFIG.animationDuration);
    }

    // ==================== 粒子效果 ====================
    function createParticleEffect(x, y, card) {
        const colors = getCardColors(card);
        
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            
            animateParticle(particle);
        }
    }

    function getCardColors(card) {
        if (card.classList.contains('tetris-card')) {
            return ['#7E57C2', '#9575CD', '#B39DDB'];
        } else if (card.classList.contains('pvz-card')) {
            return ['#66BB6A', '#81C784', '#A5D6A7'];
        }
        return ['#4FC3F7', '#81D4FA', '#B3E5FC'];
    }

    function animateParticle(particle) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        const lifetime = 1000;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / lifetime;
            
            if (progress < 1) {
                const x = parseFloat(particle.style.left) + vx;
                const y = parseFloat(particle.style.top) + vy + progress * 2; // 重力效果
                
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = 1 - progress;
                particle.style.transform = `scale(${1 - progress * 0.5})`;
                
                requestAnimationFrame(update);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(update);
    }

    // ==================== 无障碍支持 ====================
    function initAccessibility() {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            card.setAttribute('role', 'article');
            const button = card.querySelector('.card-button');
            if (button) {
                const gameTitle = card.querySelector('.card-title').textContent;
                button.setAttribute('aria-label', `开始玩 ${gameTitle}`);
            }
        });
    }

    // ==================== 键盘导航 ====================
    function addKeyboardNavigation() {
        const buttons = document.querySelectorAll('.card-button');
        
        document.addEventListener('keydown', function(e) {
            // 使用数字键1-2快速选择游戏
            if (e.key === '1' || e.key === '2') {
                const index = parseInt(e.key) - 1;
                if (buttons[index]) {
                    buttons[index].focus();
                    e.preventDefault();
                }
            }
            
            // ESC键滚动到顶部
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // 添加焦点样式
        buttons.forEach(button => {
            button.addEventListener('focus', function() {
                this.parentElement.parentElement.style.outline = '3px solid rgba(79, 195, 247, 0.6)';
                this.parentElement.parentElement.style.outlineOffset = '4px';
            });

            button.addEventListener('blur', function() {
                this.parentElement.parentElement.style.outline = 'none';
            });
        });
    }

    // ==================== 日志记录 ====================
    function logGameHubInfo() {
        console.log('%c🎮 游戏中心已加载', 'color: #4FC3F7; font-size: 16px; font-weight: bold;');
        console.log('%c提示：按数字键 1-2 快速选择游戏', 'color: #666; font-size: 12px;');
        
        // 统计可用游戏数
        const gameCount = document.querySelectorAll('.game-card').length;
        console.log(`%c共有 ${gameCount} 个游戏可供选择`, 'color: #66BB6A; font-size: 12px;');
    }

    function logGameSelection(gameName) {
        console.log(`%c✨ 启动游戏: ${gameName}`, 'color: #FF6B9D; font-size: 14px; font-weight: bold;');
    }

    // ==================== 性能优化 ====================
    // 使用 Intersection Observer 优化动画
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.game-card').forEach(card => {
            observer.observe(card);
        });
    }

    // ==================== 彩蛋功能 ====================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow 3s linear infinite';
        console.log('%c🎉 恭喜你发现了彩蛋！', 'color: #FF6B9D; font-size: 20px; font-weight: bold;');
        
        // 添加彩虹动画样式
        if (!document.getElementById('rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // 3秒后恢复正常
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }

    // ==================== 导出API（可选） ====================
    window.GameHub = {
        version: '1.0.0',
        enableParticles: function(enabled) {
            CONFIG.enableParticles = enabled;
        },
        getGameCount: function() {
            return document.querySelectorAll('.game-card').length;
        }
    };

})();

