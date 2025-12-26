/**
 * 毒豌豆射手 - 发射毒豌豆，持续消耗僵尸血量
 */

import { Peashooter } from './Peashooter.js';

export class PoisonPea extends Peashooter {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        this.bubblePhase = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.bubblePhase += deltaTime * 0.005;
    }
    
    render(ctx) {
        // 摇摆动画
        const sway = Math.sin(this.animationTime * 0.003 + this.swayOffset) * 2;
        
        // 射击后坐力动画
        let recoil = 0;
        if (this.isShootingAnimation) {
            const progress = this.shootAnimationTime / 200;
            recoil = Math.sin(progress * Math.PI) * 5;
        }
        
        ctx.save();
        ctx.translate(this.x - recoil, this.y);
        ctx.rotate(sway * Math.PI / 180);
        
        // 毒气光晕效果
        ctx.shadowColor = '#9932CC';
        ctx.shadowBlur = 15 + Math.sin(this.bubblePhase) * 5;
        
        // 绘制茎（紫色调）
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(-5, 10, 10, 30);
        
        // 绘制头部（紫色）
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#DA70D6');
        gradient.addColorStop(0.5, '#9932CC');
        gradient.addColorStop(1, '#4B0082');
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#4B0082';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // 绘制嘴巴（发射口）- 滴着毒液
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#4B0082';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 6, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#2E0854';
        ctx.fill();
        
        // 毒液滴落效果
        const dripY = (Math.sin(this.bubblePhase * 2) + 1) * 5;
        ctx.fillStyle = '#9932CC';
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 10 + dripY, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼睛（邪恶的紫色眼睛）
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-5, -8, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 紫色瞳孔
        ctx.fillStyle = '#9400D3';
        ctx.beginPath();
        ctx.arc(-2, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 高光
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-4, -10, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 毒气泡泡效果
        for (let i = 0; i < 3; i++) {
            const bubbleX = Math.sin(this.bubblePhase + i * 2) * 15;
            const bubbleY = -20 - Math.abs(Math.sin(this.bubblePhase * 0.5 + i)) * 15;
            const bubbleSize = 3 + Math.sin(this.bubblePhase + i) * 1.5;
            
            ctx.fillStyle = `rgba(153, 50, 204, ${0.3 + Math.sin(this.bubblePhase + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制叶子（紫色调）
        ctx.fillStyle = '#8B008B';
        ctx.beginPath();
        ctx.ellipse(-25, 15, 12, 6, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(20, 18, 10, 5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // 绘制生命值条（如果受伤）
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
}

