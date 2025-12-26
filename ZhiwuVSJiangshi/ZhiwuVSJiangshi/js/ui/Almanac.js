/**
 * 植物图鉴组件
 */

import { PLANTS_CONFIG } from '../config/plants.js';
import { ZOMBIES_CONFIG } from '../config/zombies.js';

export class Almanac {
    constructor() {
        this.isOpen = false;
        this.currentTab = 'plants'; // plants, zombies
        this.selectedItem = null;
        this.unlockedPlants = ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'repeater', 'gatlingpea', 'poisonpea', 'firepea'];
        this.unlockedZombies = ['basic'];
        
        this.overlay = null;
        this.onCloseCallback = null;
        
        this.plantDescriptions = {
            sunflower: {
                name: '向日葵',
                description: '向日葵是你的阳光工厂！它们每隔一段时间就会产生阳光，让你能种植更多的植物。',
                funFact: '向日葵总是面朝太阳微笑，它们是花园里最乐观的植物！',
                stats: { 阳光消耗: 50, 生命值: 100, 产阳光: '25/10秒' }
            },
            peashooter: {
                name: '豌豆射手',
                description: '豌豆射手是你的基础攻击植物，它会向僵尸发射豌豆进行攻击。',
                funFact: '豌豆射手每天都要练习瞄准，所以它的命中率特别高！',
                stats: { 阳光消耗: 100, 生命值: 100, 攻击力: 20, 击杀僵尸: '3发' }
            },
            wallnut: {
                name: '坚果墙',
                description: '坚果墙有着超强的防御力，可以挡住僵尸很长时间，给你的攻击植物争取时间。',
                funFact: '坚果墙虽然看起来很坚强，但其实它很怕痒！',
                stats: { 阳光消耗: 50, 生命值: 500, 攻击力: 0 }
            },
            snowpea: {
                name: '寒冰射手',
                description: '寒冰射手发射的冰冻豌豆不仅能造成伤害，还能大幅减慢僵尸的移动速度。',
                funFact: '寒冰射手最喜欢冬天，因为那时它感觉最舒服！',
                stats: { 阳光消耗: 150, 生命值: 100, 攻击力: 20, 特效: '减速70%' }
            },
            repeater: {
                name: '双发射手',
                description: '双发射手一次可以发射两颗豌豆，火力是普通豌豆射手的两倍！',
                funFact: '双发射手有两个嘴巴，所以它吃饭的速度也是别人的两倍！',
                stats: { 阳光消耗: 175, 生命值: 100, 攻击力: '20x2' }
            },
            gatlingpea: {
                name: '机枪射手',
                description: '机枪射手是终极火力输出！一次发射四颗豌豆，让僵尸无处可逃！',
                funFact: '机枪射手曾经是军队里的神射手，退役后来花园保护大家！',
                stats: { 阳光消耗: 250, 生命值: 100, 攻击力: '20x4', 特点: '超高火力' }
            },
            poisonpea: {
                name: '毒豌豆射手',
                description: '毒豌豆射手发射的毒豌豆会让僵尸中毒，持续受到伤害！',
                funFact: '毒豌豆射手是在毒蘑菇那里学的毒术，现在用来对付僵尸！',
                stats: { 阳光消耗: 175, 生命值: 100, 攻击力: 10, 毒伤害: '5/秒', 持续: '3秒' }
            },
            firepea: {
                name: '火焰射手',
                description: '火焰射手发射的火焰豌豆伤害超高，能快速消灭僵尸！',
                funFact: '火焰射手脾气比较火爆，但对朋友们都很热情！',
                stats: { 阳光消耗: 200, 生命值: 100, 攻击力: 40, 特点: '高伤害' }
            }
        };
        
        this.zombieDescriptions = {
            basic: {
                name: '普通僵尸',
                description: '最普通的僵尸，慢慢地走向你的房子。3发豌豆就能消灭它！',
                funFact: '普通僵尸最喜欢的食物是脑子，但它也不介意吃点植物当零食。',
                stats: { 生命值: 60, 速度: '很慢', 攻击力: 10, 击杀需要: '3发' }
            },
            conehead: {
                name: '路障僵尸',
                description: '戴着路障的僵尸，路障能吸收2发豌豆，然后再打3发消灭它。',
                funFact: '路障僵尸觉得戴路障很时尚，是僵尸界的潮流引领者！',
                stats: { 生命值: '60+40', 速度: '很慢', 攻击力: 10, 击杀需要: '5发' }
            },
            buckethead: {
                name: '铁桶僵尸',
                description: '戴着铁桶的僵尸，铁桶能吸收3发豌豆，然后再打3发消灭它。',
                funFact: '铁桶僵尸的铁桶是从工地偷来的，它觉得这样看起来很酷！',
                stats: { 生命值: '60+60', 速度: '超慢', 攻击力: 10, 击杀需要: '6发' }
            }
        };
        
        this.createOverlay();
    }
    
    /**
     * 创建图鉴界面
     */
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'almanac-overlay';
        this.overlay.innerHTML = `
            <div class="almanac-container">
                <div class="almanac-header">
                    <h2>📖 图鉴</h2>
                    <button class="almanac-close-btn">✕</button>
                </div>
                <div class="almanac-tabs">
                    <button class="almanac-tab active" data-tab="plants">🌱 植物</button>
                    <button class="almanac-tab" data-tab="zombies">🧟 僵尸</button>
                </div>
                <div class="almanac-content">
                    <div class="almanac-grid" id="almanac-grid"></div>
                    <div class="almanac-detail" id="almanac-detail">
                        <p class="almanac-hint">点击左侧图标查看详情</p>
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        this.addStyles();
        
        // 绑定事件
        this.bindEvents();
        
        document.body.appendChild(this.overlay);
    }
    
    /**
     * 添加图鉴样式
     */
    addStyles() {
        if (document.getElementById('almanac-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'almanac-styles';
        style.textContent = `
            .almanac-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .almanac-overlay.active {
                display: flex;
            }
            
            .almanac-container {
                width: 800px;
                max-width: 95vw;
                height: 500px;
                max-height: 90vh;
                background: linear-gradient(180deg, #F5DEB3 0%, #DEB887 100%);
                border-radius: 20px;
                border: 4px solid #8B4513;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .almanac-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: #8B4513;
                color: white;
            }
            
            .almanac-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .almanac-close-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: none;
                background: #F44336;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .almanac-close-btn:hover {
                transform: scale(1.1);
            }
            
            .almanac-tabs {
                display: flex;
                gap: 10px;
                padding: 10px 20px;
                background: rgba(139, 69, 19, 0.2);
            }
            
            .almanac-tab {
                padding: 10px 20px;
                border: 2px solid #8B4513;
                border-radius: 10px;
                background: #F5DEB3;
                font-family: 'Comic Sans MS', cursive;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .almanac-tab:hover {
                background: #FFE4B5;
            }
            
            .almanac-tab.active {
                background: #8B4513;
                color: white;
            }
            
            .almanac-content {
                flex: 1;
                display: flex;
                padding: 15px;
                gap: 15px;
                overflow: hidden;
            }
            
            .almanac-grid {
                width: 200px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                overflow-y: auto;
                padding-right: 10px;
            }
            
            .almanac-item {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.5);
                border: 3px solid #8B4513;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .almanac-item:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .almanac-item.selected {
                border-color: #FFD700;
                box-shadow: 0 0 15px #FFD700;
            }
            
            .almanac-item.locked {
                background: rgba(0, 0, 0, 0.3);
                cursor: default;
            }
            
            .almanac-item.locked:hover {
                transform: none;
                box-shadow: none;
            }
            
            .almanac-item.multi-char-emoji {
                font-size: 1.2rem;
                line-height: 1.2;
            }
            
            .almanac-detail {
                flex: 1;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                padding: 20px;
                overflow-y: auto;
            }
            
            .almanac-hint {
                color: #888;
                text-align: center;
                margin-top: 100px;
            }
            
            .detail-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 2px solid #DEB887;
            }
            
            .detail-icon {
                font-size: 4rem;
            }
            
            .detail-icon.multi-char-emoji-detail {
                font-size: 2rem;
                line-height: 1.2;
            }
            
            .detail-name {
                font-size: 1.8rem;
                color: #4A7C23;
                margin: 0;
            }
            
            .detail-description {
                font-size: 1rem;
                line-height: 1.6;
                color: #333;
                margin-bottom: 15px;
            }
            
            .detail-funfact {
                background: #FFF8DC;
                border-left: 4px solid #FFD700;
                padding: 10px 15px;
                margin-bottom: 15px;
                font-style: italic;
                color: #666;
            }
            
            .detail-stats {
                background: rgba(74, 124, 35, 0.1);
                border-radius: 8px;
                padding: 15px;
            }
            
            .detail-stats h4 {
                margin: 0 0 10px 0;
                color: #4A7C23;
            }
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px dashed #ccc;
            }
            
            .stat-row:last-child {
                border-bottom: none;
            }
            
            .stat-label {
                color: #666;
            }
            
            .stat-value {
                font-weight: bold;
                color: #333;
            }
            
            .new-badge {
                background: #F44336;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.7rem;
                margin-left: 10px;
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 关闭按钮
        this.overlay.querySelector('.almanac-close-btn').addEventListener('click', () => {
            this.close();
        });
        
        // 点击背景关闭
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // 标签切换
        this.overlay.querySelectorAll('.almanac-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
    }
    
    /**
     * 打开图鉴
     */
    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.renderGrid();
    }
    
    /**
     * 关闭图鉴
     */
    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }
    
    /**
     * 设置关闭回调
     */
    onClose(callback) {
        this.onCloseCallback = callback;
    }
    
    /**
     * 切换标签
     */
    switchTab(tab) {
        this.currentTab = tab;
        this.selectedItem = null;
        
        // 更新标签样式
        this.overlay.querySelectorAll('.almanac-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        this.renderGrid();
        this.renderDetail();
    }
    
    /**
     * 设置解锁的植物
     */
    setUnlockedPlants(plants) {
        this.unlockedPlants = plants;
    }
    
    /**
     * 设置解锁的僵尸
     */
    setUnlockedZombies(zombies) {
        this.unlockedZombies = zombies;
    }
    
    /**
     * 解锁植物
     */
    unlockPlant(plantId) {
        if (!this.unlockedPlants.includes(plantId)) {
            this.unlockedPlants.push(plantId);
        }
    }
    
    /**
     * 解锁僵尸
     */
    unlockZombie(zombieId) {
        if (!this.unlockedZombies.includes(zombieId)) {
            this.unlockedZombies.push(zombieId);
        }
    }
    
    /**
     * 渲染网格
     */
    renderGrid() {
        const grid = this.overlay.querySelector('#almanac-grid');
        grid.innerHTML = '';
        
        const items = this.currentTab === 'plants' ? PLANTS_CONFIG : ZOMBIES_CONFIG;
        const unlocked = this.currentTab === 'plants' ? this.unlockedPlants : this.unlockedZombies;
        
        for (const id in items) {
            const item = items[id];
            const isUnlocked = unlocked.includes(id);
            
            const div = document.createElement('div');
            div.className = `almanac-item ${isUnlocked ? '' : 'locked'} ${this.selectedItem === id ? 'selected' : ''}`;
            div.innerHTML = isUnlocked ? item.emoji : '❓';
            
            // 为多字符emoji添加特殊样式
            if (isUnlocked && item.emoji.length > 2) {
                div.classList.add('multi-char-emoji');
            }
            
            if (isUnlocked) {
                div.addEventListener('click', () => {
                    this.selectItem(id);
                });
            }
            
            grid.appendChild(div);
        }
    }
    
    /**
     * 选择项目
     */
    selectItem(id) {
        this.selectedItem = id;
        this.renderGrid();
        this.renderDetail();
    }
    
    /**
     * 渲染详情
     */
    renderDetail() {
        const detail = this.overlay.querySelector('#almanac-detail');
        
        if (!this.selectedItem) {
            detail.innerHTML = '<p class="almanac-hint">点击左侧图标查看详情</p>';
            return;
        }
        
        const descriptions = this.currentTab === 'plants' ? this.plantDescriptions : this.zombieDescriptions;
        const config = this.currentTab === 'plants' ? PLANTS_CONFIG[this.selectedItem] : ZOMBIES_CONFIG[this.selectedItem];
        const info = descriptions[this.selectedItem];
        
        if (!info || !config) {
            detail.innerHTML = '<p class="almanac-hint">暂无详情</p>';
            return;
        }
        
        let statsHtml = '';
        for (const [key, value] of Object.entries(info.stats)) {
            statsHtml += `
                <div class="stat-row">
                    <span class="stat-label">${key}</span>
                    <span class="stat-value">${value}</span>
                </div>
            `;
        }
        
        detail.innerHTML = `
            <div class="detail-header">
                <span class="detail-icon ${config.emoji.length > 2 ? 'multi-char-emoji-detail' : ''}">${config.emoji}</span>
                <h3 class="detail-name">${info.name}</h3>
            </div>
            <p class="detail-description">${info.description}</p>
            <div class="detail-funfact">
                💡 趣味小知识：${info.funFact}
            </div>
            <div class="detail-stats">
                <h4>📊 属性</h4>
                ${statsHtml}
            </div>
        `;
    }
}

