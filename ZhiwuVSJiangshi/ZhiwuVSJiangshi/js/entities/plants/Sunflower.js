/**
 * 向日葵 - 产生阳光
 */

import { Plant } from '../Plant.js';
import { SUNFLOWER_SUN_INTERVAL } from '../../config/constants.js';

export class Sunflower extends Plant {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        
        this.sunInterval = config.sunInterval || SUNFLOWER_SUN_INTERVAL;
        this.sunTimer = this.sunInterval * 0.6; // 首次产阳光快一些
        this.sunProduction = config.sunProduction || 25;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.sunTimer += deltaTime;
    }
    
    /**
     * 检查是否可以产生阳光
     */
    canProduceSun() {
        return this.sunTimer >= this.sunInterval;
    }
    
    /**
     * 产生阳光后重置计时器
     */
    produceSun() {
        this.sunTimer = 0;
        return this.sunProduction;
    }
    
    render(ctx) {
        // 摇摆动画 - 向日葵摇摆更明显
        const sway = Math.sin(this.animationTime * 0.004 + this.swayOffset) * 5;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(sway * Math.PI / 180);
        
        // 绘制花瓣（多个黄色椭圆）
        const petalCount = 12;
        const petalRadius = this.width / 4;
        ctx.fillStyle = '#FFD700';
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            ctx.save();
            ctx.rotate(angle);
            ctx.translate(0, -this.width / 3);
            ctx.beginPath();
            ctx.ellipse(0, 0, petalRadius / 2, petalRadius, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // 绘制花心（棕色圆）
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
        ctx.strokeStyle = '#5D3A1A';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制笑脸
        ctx.fillStyle = '#000';
        // 眼睛
        ctx.beginPath();
        ctx.arc(-6, -3, 3, 0, Math.PI * 2);
        ctx.arc(6, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        // 微笑
        ctx.beginPath();
        ctx.arc(0, 2, 8, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        // 绘制生命值条（如果受伤）
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
        
        // 阳光产生指示器
        if (this.sunTimer >= this.sunInterval * 0.8) {
            const glowIntensity = (this.sunTimer - this.sunInterval * 0.8) / (this.sunInterval * 0.2);
            ctx.save();
            ctx.globalAlpha = glowIntensity * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.fill();
            ctx.restore();
        }
    }
}

