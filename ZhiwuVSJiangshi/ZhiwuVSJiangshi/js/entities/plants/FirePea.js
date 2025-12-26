/**
 * 火焰射手 - 发射火焰豌豆，伤害更高
 */

import { Peashooter } from './Peashooter.js';

export class FirePea extends Peashooter {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        this.flamePhase = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.flamePhase += deltaTime * 0.015;
    }
    
    render(ctx) {
        // 摇摆动画
        const sway = Math.sin(this.animationTime * 0.003 + this.swayOffset) * 2;
        
        // 射击后坐力动画
        let recoil = 0;
        if (this.isShootingAnimation) {
            const progress = this.shootAnimationTime / 200;
            recoil = Math.sin(progress * Math.PI) * 6;
        }
        
        ctx.save();
        ctx.translate(this.x - recoil, this.y);
        ctx.rotate(sway * Math.PI / 180);
        
        // 火焰光晕效果
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 20 + Math.sin(this.flamePhase * 2) * 8;
        
        // 绘制茎（深橙色）
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(-5, 10, 10, 30);
        
        // 绘制头部（火红色渐变）
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.4, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // 绘制火焰头发
        ctx.fillStyle = '#FF6B00';
        for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i - 2) * 0.4;
            const flameHeight = 15 + Math.sin(this.flamePhase + i) * 5;
            const flameWidth = 6 + Math.sin(this.flamePhase * 2 + i) * 2;
            
            ctx.save();
            ctx.translate(Math.cos(angle) * 15, Math.sin(angle) * 10 - 10);
            ctx.rotate(angle + Math.PI / 2);
            
            // 火焰形状
            ctx.beginPath();
            ctx.moveTo(-flameWidth, 0);
            ctx.quadraticCurveTo(-flameWidth / 2, -flameHeight * 0.6, 0, -flameHeight);
            ctx.quadraticCurveTo(flameWidth / 2, -flameHeight * 0.6, flameWidth, 0);
            ctx.closePath();
            
            const flameGradient = ctx.createLinearGradient(0, 0, 0, -flameHeight);
            flameGradient.addColorStop(0, '#FF4500');
            flameGradient.addColorStop(0.5, '#FF8C00');
            flameGradient.addColorStop(1, '#FFFF00');
            ctx.fillStyle = flameGradient;
            ctx.fill();
            
            ctx.restore();
        }
        
        // 绘制嘴巴（发射口）- 喷火
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#8B0000';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 6, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4500';
        ctx.fill();
        
        // 口中的火焰
        if (this.isShootingAnimation) {
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.ellipse(this.width / 3 + 5, 0, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制眼睛（愤怒的火焰眼睛）
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-5, -8, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 红色瞳孔
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-2, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 高光
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(-4, -10, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 愤怒的眉毛
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -18);
        ctx.lineTo(-2, -14);
        ctx.stroke();
        
        // 绘制叶子（橙红色调）
        ctx.fillStyle = '#FF6347';
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

