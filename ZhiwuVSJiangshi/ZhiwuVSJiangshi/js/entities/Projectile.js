/**
 * 子弹类 - 植物发射的攻击物
 */

import { Entity } from './Entity.js';

export class Projectile extends Entity {
    constructor(x, y, damage, speed, color = '#32CD32', options = {}) {
        super(x, y, 20, 20);
        
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.row = -1; // 所在行
        
        // 特殊效果
        this.isIce = options.isIce || false;
        this.isPoison = options.isPoison || false;
        this.isFire = options.isFire || false;
        
        // 减速效果（冰豌豆）
        this.slowEffect = options.slowEffect || (this.isIce ? 0.3 : 0);
        this.slowDuration = options.slowDuration || (this.isIce ? 4000 : 0);
        
        // 毒效果
        this.poisonDamage = options.poisonDamage || 0;
        this.poisonDuration = options.poisonDuration || 0;
        
        // 动画
        this.rotation = 0;
        this.trailParticles = [];
        this.flickerPhase = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 向右移动
        this.x += this.speed * (deltaTime / 16.67);
        
        // 旋转动画
        this.rotation += deltaTime * 0.01;
        this.flickerPhase += deltaTime * 0.02;
        
        // 更新拖尾粒子
        if (this.isFire || this.isPoison) {
            this.trailParticles.push({
                x: this.x - 5,
                y: this.y + (Math.random() - 0.5) * 8,
                alpha: 1,
                size: 4 + Math.random() * 4
            });
            
            // 更新和移除旧粒子
            for (let i = this.trailParticles.length - 1; i >= 0; i--) {
                this.trailParticles[i].alpha -= 0.1;
                this.trailParticles[i].size *= 0.9;
                if (this.trailParticles[i].alpha <= 0) {
                    this.trailParticles.splice(i, 1);
                }
            }
            
            // 限制粒子数量
            if (this.trailParticles.length > 15) {
                this.trailParticles.shift();
            }
        }
        
        // 超出屏幕销毁
        if (this.x > 950) {
            this.destroy();
        }
    }
    
    render(ctx) {
        // 绘制拖尾粒子
        if (this.isFire || this.isPoison) {
            for (const particle of this.trailParticles) {
                ctx.globalAlpha = particle.alpha * 0.6;
                ctx.fillStyle = this.isFire ? '#FF6B00' : '#8B008B';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.isFire) {
            this.renderFirePea(ctx);
        } else if (this.isPoison) {
            this.renderPoisonPea(ctx);
        } else if (this.isIce) {
            this.renderIcePea(ctx);
        } else {
            this.renderNormalPea(ctx);
        }
        
        ctx.restore();
    }
    
    renderNormalPea(ctx) {
        // 绘制普通豌豆
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#90EE90');
        gradient.addColorStop(1, this.color);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 高光
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }
    
    renderIcePea(ctx) {
        // 绘制冰豌豆
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#E0F7FA');
        gradient.addColorStop(0.5, '#80DEEA');
        gradient.addColorStop(1, '#00BCD4');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#0288D1';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 冰晶效果
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + this.rotation;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                Math.cos(angle) * (this.width / 2 + 4),
                Math.sin(angle) * (this.width / 2 + 4)
            );
            ctx.stroke();
        }
        
        // 高光
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
    
    renderPoisonPea(ctx) {
        // 绘制毒豌豆
        const flicker = 0.8 + Math.sin(this.flickerPhase) * 0.2;
        
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#DA70D6');
        gradient.addColorStop(0.5, '#9932CC');
        gradient.addColorStop(1, '#4B0082');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 毒气光晕
        ctx.shadowColor = '#9932CC';
        ctx.shadowBlur = 10 * flicker;
        ctx.strokeStyle = '#8B008B';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 骷髅标记
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☠', 0, 0);
    }
    
    renderFirePea(ctx) {
        // 绘制火焰豌豆
        const flicker = 0.9 + Math.sin(this.flickerPhase * 2) * 0.1;
        
        // 火焰光晕
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 15 * flicker;
        
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.4, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 火焰尾巴
        ctx.fillStyle = '#FF6B00';
        for (let i = 0; i < 3; i++) {
            const angle = Math.PI + (i - 1) * 0.4 + Math.sin(this.flickerPhase + i) * 0.2;
            const length = 8 + Math.sin(this.flickerPhase * 2 + i) * 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 5);
            ctx.lineTo(
                Math.cos(angle) * (8 + length),
                Math.sin(angle) * (5 + length * 0.3)
            );
            ctx.lineTo(Math.cos(angle + 0.3) * 8, Math.sin(angle + 0.3) * 5);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    /**
     * 设置所在行
     */
    setRow(row) {
        this.row = row;
    }
    
    reset() {
        super.reset();
        this.rotation = 0;
        this.row = -1;
        this.trailParticles = [];
        this.isIce = false;
        this.isPoison = false;
        this.isFire = false;
        this.slowEffect = 0;
        this.slowDuration = 0;
        this.poisonDamage = 0;
        this.poisonDuration = 0;
    }
}

