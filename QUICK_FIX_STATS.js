// 🚀 快速修复：统计面板控制脚本
// 复制这段代码到浏览器控制台（F12 → Console）然后按回车运行

(function() {
    console.log('🔧 开始应用统计面板快速修复...');
    
    // 方案1: 直接隐藏统计面板
    function hideStatsPanel() {
        const sidebar = document.getElementById('game-stats-sidebar');
        if (sidebar) {
            sidebar.classList.remove('visible');
            sidebar.style.display = 'none';
            localStorage.setItem('pvz_stats_visible', 'false');
            console.log('✅ 统计面板已隐藏');
            return true;
        }
        return false;
    }
    
    // 方案2: 动态添加切换按钮
    function addToggleButton() {
        // 检查按钮是否已存在
        if (document.getElementById('btn-toggle-stats')) {
            console.log('✅ 按钮已存在');
            return;
        }
        
        // 找到控制按钮容器
        const controlButtons = document.querySelector('.control-buttons');
        if (!controlButtons) {
            console.log('❌ 未找到控制按钮容器');
            return;
        }
        
        // 创建按钮
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = 'btn-toggle-stats';
        btn.title = '切换统计面板';
        btn.textContent = '📊';
        btn.style.cssText = `
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.9));
            border-color: #4CAF50;
        `;
        
        // 添加点击事件
        btn.addEventListener('click', function() {
            const sidebar = document.getElementById('game-stats-sidebar');
            if (!sidebar) return;
            
            const isVisible = sidebar.classList.contains('visible');
            
            if (isVisible) {
                sidebar.classList.remove('visible');
                btn.textContent = '📋';
                btn.title = '显示统计面板';
                localStorage.setItem('pvz_stats_visible', 'false');
                showToast('统计面板已隐藏 📋');
            } else {
                sidebar.classList.add('visible');
                btn.textContent = '📊';
                btn.title = '隐藏统计面板';
                localStorage.setItem('pvz_stats_visible', 'true');
                showToast('统计面板已显示 📊');
            }
        });
        
        // 添加到容器
        controlButtons.appendChild(btn);
        console.log('✅ 切换按钮已添加');
        
        // 根据localStorage设置初始状态
        const savedVisible = localStorage.getItem('pvz_stats_visible');
        if (savedVisible === 'false') {
            btn.textContent = '📋';
            btn.title = '显示统计面板';
            hideStatsPanel();
        }
    }
    
    // 显示提示信息
    function showToast(message) {
        let toast = document.getElementById('stats-toggle-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'stats-toggle-toast';
            toast.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }
    
    // 主执行流程
    console.log('📊 当前统计面板状态检查...');
    
    // 先隐藏面板
    const panelHidden = hideStatsPanel();
    if (panelHidden) {
        console.log('✅ 统计面板已隐藏（即时生效）');
        showToast('✅ 统计面板已隐藏');
    }
    
    // 等待DOM完全加载后添加按钮
    setTimeout(() => {
        addToggleButton();
        console.log('✅ 快速修复完成！');
        console.log('💡 提示：点击右上角的 📊 按钮可以切换显示/隐藏');
    }, 1000);
    
})();

// 使用说明：
// 1. 按 F12 打开浏览器控制台
// 2. 复制这整段代码
// 3. 粘贴到 Console 标签中
// 4. 按回车键运行
// 5. 统计面板会立即隐藏，并添加切换按钮

console.log('🎮 植物大战僵尸 - 统计面板快速修复脚本已加载');
console.log('📝 运行上面的代码来应用修复');

