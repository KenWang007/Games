/**
 * 植物卡片栏组件
 */

import { PLANTS_CONFIG } from '../config/plants.js';

export class CardBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cards = [];
        this.selectedPlantId = null;
        this.cooldowns = {}; // 植物冷却时间
        this.onSelectCallback = null;
        this.shovelSelected = false; // 铲子是否被选中
        this.shovelContainer = null;
        this.tooltip = null;
        this.initShovel();
        this.createTooltip();
    }
    
    /**
     * 创建tooltip元素
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'card-tooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10000;
            display: none;
            white-space: nowrap;
            font-family: 'Comic Sans MS', cursive;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(this.tooltip);
    }
    
    /**
     * 显示tooltip
     */
    showTooltip(text, x, y) {
        this.tooltip.textContent = text;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = (y - 40) + 'px';
    }
    
    /**
     * 隐藏tooltip
     */
    hideTooltip() {
        this.tooltip.style.display = 'none';
    }
    
    /**
     * 初始化铲子工具
     */
    initShovel() {
        this.shovelContainer = document.getElementById('shovel-container');
        if (this.shovelContainer) {
            this.shovelContainer.addEventListener('click', () => {
                this.toggleShovel();
            });
            
            // 铲子的tooltip
            this.shovelContainer.addEventListener('mouseenter', (e) => {
                const rect = this.shovelContainer.getBoundingClientRect();
                this.showTooltip('铲子 - 移除植物', rect.left + rect.width / 2, rect.top);
            });
            
            this.shovelContainer.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            this.shovelContainer.addEventListener('mousemove', (e) => {
                this.showTooltip('铲子 - 移除植物', e.clientX, e.clientY);
            });
        }
    }
    
    /**
     * 切换铲子选中状态
     */
    toggleShovel() {
        this.shovelSelected = !this.shovelSelected;
        console.log('[CardBar] 铲子选中状态:', this.shovelSelected);
        
        if (this.shovelSelected) {
            // 选中铲子，取消植物选择（但不取消铲子）
            this.selectedPlantId = null;
            for (const card of this.cards) {
                card.element.classList.remove('selected');
            }
            this.shovelContainer.classList.add('selected');
            document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>⛏️</text></svg>") 16 16, auto';
            console.log('[CardBar] 铲子已选中，光标已更改');
        } else {
            // 取消铲子选择
            this.shovelContainer.classList.remove('selected');
            document.body.style.cursor = 'default';
            console.log('[CardBar] 铲子已取消选中');
        }
        
        if (this.onSelectCallback) {
            this.onSelectCallback(this.shovelSelected ? 'shovel' : null);
        }
    }
    
    /**
     * 检查铲子是否被选中
     */
    isShovelSelected() {
        return this.shovelSelected;
    }
    
    /**
     * 取消铲子选择
     */
    deselectShovel() {
        if (this.shovelSelected) {
            this.shovelSelected = false;
            if (this.shovelContainer) {
                this.shovelContainer.classList.remove('selected');
            }
            document.body.style.cursor = 'default';
        }
    }
    
    /**
     * 初始化卡片栏
     */
    init(availablePlants, sunSystem) {
        this.sunSystem = sunSystem;
        this.container.innerHTML = '';
        this.cards = [];
        this.cooldowns = {};
        
        for (const plantId of availablePlants) {
            const config = PLANTS_CONFIG[plantId];
            if (config) {
                const card = this.createCard(config);
                this.container.appendChild(card);
                this.cards.push({ id: plantId, element: card, config });
                this.cooldowns[plantId] = 0;
            }
        }
    }
    
    /**
     * 创建单个卡片元素
     */
    createCard(config) {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.dataset.plantId = config.id;
        
        card.innerHTML = `
            <div class="card-image">${config.emoji}</div>
            <div class="card-cost">
                <span class="mini-sun"></span>
                <span>${config.sunCost}</span>
            </div>
            <div class="cooldown-overlay"></div>
        `;
        
        // 添加样式
        const cardImage = card.querySelector('.card-image');
        cardImage.style.fontSize = '32px';
        cardImage.style.lineHeight = '45px';
        cardImage.style.textAlign = 'center';
        
        // 鼠标悬停事件
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            this.showTooltip(config.name, rect.left + rect.width / 2, rect.top);
        });
        
        card.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
        
        card.addEventListener('mousemove', (e) => {
            this.showTooltip(config.name, e.clientX, e.clientY);
        });
        
        // 点击事件
        card.addEventListener('click', () => {
            this.selectCard(config.id);
        });
        
        return card;
    }
    
    /**
     * 选择卡片
     */
    selectCard(plantId) {
        const config = PLANTS_CONFIG[plantId];
        if (!config) return;
        
        // 检查冷却
        if (this.cooldowns[plantId] > 0) {
            this.shakeCard(plantId);
            return;
        }
        
        // 检查阳光
        if (!this.sunSystem.canAfford(config.sunCost)) {
            this.shakeCard(plantId);
            return;
        }
        
        // 取消铲子选择
        this.deselectShovel();
        
        // 切换选中状态
        if (this.selectedPlantId === plantId) {
            this.deselectAll();
        } else {
            this.deselectAll();
            this.selectedPlantId = plantId;
            this.updateCardStates();
            
            if (this.onSelectCallback) {
                this.onSelectCallback(plantId);
            }
        }
    }
    
    /**
     * 取消所有选中
     */
    deselectAll() {
        this.selectedPlantId = null;
        this.deselectShovel();
        for (const card of this.cards) {
            card.element.classList.remove('selected');
        }
    }
    
    /**
     * 卡片抖动效果（阳光不足或冷却中）
     */
    shakeCard(plantId) {
        const card = this.cards.find(c => c.id === plantId);
        if (card) {
            card.element.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                card.element.style.animation = '';
            }, 300);
        }
    }
    
    /**
     * 使用植物后开始冷却
     */
    startCooldown(plantId) {
        const config = PLANTS_CONFIG[plantId];
        if (config) {
            this.cooldowns[plantId] = config.cooldown;
        }
        this.deselectAll();
    }
    
    /**
     * 更新冷却时间
     */
    update(deltaTime) {
        for (const plantId in this.cooldowns) {
            if (this.cooldowns[plantId] > 0) {
                this.cooldowns[plantId] -= deltaTime;
                if (this.cooldowns[plantId] < 0) {
                    this.cooldowns[plantId] = 0;
                }
            }
        }
        this.updateCardStates();
    }
    
    /**
     * 更新卡片状态（选中、禁用、冷却）
     */
    updateCardStates() {
        for (const card of this.cards) {
            const config = card.config;
            const isSelected = this.selectedPlantId === card.id;
            const isOnCooldown = this.cooldowns[card.id] > 0;
            const canAfford = this.sunSystem.canAfford(config.sunCost);
            
            // 选中状态
            card.element.classList.toggle('selected', isSelected);
            
            // 禁用状态
            card.element.classList.toggle('disabled', isOnCooldown || !canAfford);
            
            // 冷却进度条
            const overlay = card.element.querySelector('.cooldown-overlay');
            if (isOnCooldown) {
                const progress = (this.cooldowns[card.id] / config.cooldown) * 100;
                overlay.style.height = `${progress}%`;
            } else {
                overlay.style.height = '0%';
            }
        }
    }
    
    /**
     * 获取当前选中的植物ID
     */
    getSelectedPlantId() {
        return this.selectedPlantId;
    }
    
    /**
     * 获取选中植物的配置
     */
    getSelectedPlantConfig() {
        if (this.selectedPlantId) {
            return PLANTS_CONFIG[this.selectedPlantId];
        }
        return null;
    }
    
    /**
     * 设置选择回调
     */
    onSelect(callback) {
        this.onSelectCallback = callback;
    }
    
    /**
     * 重置卡片栏
     */
    reset() {
        this.selectedPlantId = null;
        for (const plantId in this.cooldowns) {
            this.cooldowns[plantId] = 0;
        }
        this.updateCardStates();
    }
}

