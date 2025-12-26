/**
 * 阳光类 - 游戏货币资源
 */

import { Entity } from './Entity.js';
import { SUN_VALUE, SUN_LIFETIME, SUN_FALL_SPEED } from '../config/constants.js';

export class Sun extends Entity {
    constructor(x, y, targetY = null, value = SUN_VALUE) {
        super(x, y, 50, 50);
        
        this.value = value;
        this.targetY = targetY; // 目标Y坐标（天空掉落时使用）
        this.lifetime = SUN_LIFETIME;
        this.age = 0;
        
        // 状态
        this.isFalling = targetY !== null;
        this.isCollecting = false;
        this.collectTargetX = 0;
        this.collectTargetY = 0;
        
        // 动画
        this.bounceOffset = 0;
        this.glowPhase = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.isCollecting) {
            // 收集动画 - 飞向阳光计数器
            const dx = this.collectTargetX - this.x;
            const dy = this.collectTargetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 10) {
                this.destroy();
                return;
            }
            
            const speed = 15;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;
            
            // 收集时缩小
            this.width = Math.max(20, this.width - 1);
            this.height = this.width;
            return;
        }
        
        if (this.isFalling) {
            // 下落动画
            if (this.y < this.targetY) {
                this.y += SUN_FALL_SPEED * (deltaTime / 16.67);
                if (this.y >= this.targetY) {
                    this.y = this.targetY;
                    this.isFalling = false;
                }
            }
        }
        
        // 生命周期
        this.age += deltaTime;
        
        // 弹跳动画
        this.bounceOffset = Math.sin(this.animationTime * 0.005) * 5;
        
        // 发光动画
        this.glowPhase += deltaTime * 0.003;
    }
    
    /**
     * 检查是否过期
     */
    isExpired() {
        return this.age >= this.lifetime;
    }
    
    /**
     * 获取透明度（快过期时渐隐）
     */
    getAlpha() {
        const fadeStart = this.lifetime * 0.7;
        if (this.age > fadeStart) {
            return 1 - (this.age - fadeStart) / (this.lifetime - fadeStart);
        }
        return 1;
    }
    
    /**
     * 开始收集动画
     */
    collect(targetX, targetY) {
        this.isCollecting = true;
        this.collectTargetX = targetX;
        this.collectTargetY = targetY;
    }
    
    render(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.globalAlpha = this.getAlpha();
        ctx.translate(this.x, this.y + this.bounceOffset);
        
        // 发光效果
        const glowSize = 10 + Math.sin(this.glowPhase) * 5;
        const gradient = ctx.createRadialGradient(
            0, 0, 0,
            0, 0, this.width / 2 + glowSize
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2 + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 阳光主体
        const sunGradient = ctx.createRadialGradient(
            -5, -5, 0,
            0, 0, this.width / 2
        );
        sunGradient.addColorStop(0, '#FFEB3B');
        sunGradient.addColorStop(0.7, '#FFC107');
        sunGradient.addColorStop(1, '#FF9800');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = sunGradient;
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#F57C00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 光芒
        ctx.strokeStyle = '#FFEB3B';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.animationTime * 0.001;
            const innerRadius = this.width / 2 + 2;
            const outerRadius = this.width / 2 + 10;
            
            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * innerRadius,
                Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
                Math.cos(angle) * outerRadius,
                Math.sin(angle) * outerRadius
            );
            ctx.stroke();
        }
        
        // 笑脸
        ctx.fillStyle = '#F57C00';
        // 眼睛
        ctx.beginPath();
        ctx.arc(-8, -5, 4, 0, Math.PI * 2);
        ctx.arc(8, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        // 微笑
        ctx.strokeStyle = '#F57C00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 3, 10, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        
        // 高光
        ctx.beginPath();
        ctx.arc(-8, -8, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        ctx.restore();
    }
    
    reset() {
        super.reset();
        this.age = 0;
        this.isFalling = false;
        this.isCollecting = false;
        this.width = 50;
        this.height = 50;
        this.bounceOffset = 0;
    }
}

