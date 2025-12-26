/**
 * 路障僵尸 - 头戴路障，更耐打
 */

import { Zombie } from '../Zombie.js';

export class ConeheadZombie extends Zombie {
    constructor(config, row, x, y) {
        super(config, row, x, y);
        this.coneHealth = config.coneHealth || 100;
        this.maxConeHealth = this.coneHealth;
        this.hasCone = true;
    }
    
    takeDamage(damage) {
        if (this.hasCone && this.coneHealth > 0) {
            this.coneHealth -= damage;
            if (this.coneHealth <= 0) {
                this.hasCone = false;
                // 路障掉落后，剩余伤害转移到身体
                const remainingDamage = Math.abs(this.coneHealth);
                this.coneHealth = 0;
                if (remainingDamage > 0) {
                    super.takeDamage(remainingDamage);
                }
            }
        } else {
            super.takeDamage(damage);
        }
    }
    
    getHealthPercent() {
        const totalHealth = this.maxHealth + this.maxConeHealth;
        const currentHealth = this.health + this.coneHealth;
        return currentHealth / totalHealth;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 减速时变蓝
        if (this.isSlowed()) {
            ctx.filter = 'hue-rotate(180deg) saturate(0.7)';
        }
        
        // 行走摇晃
        const wobble = this.state === 'walking' 
            ? Math.sin(this.walkCycle) * 3 
            : 0;
        ctx.rotate(wobble * Math.PI / 180);
        
        // 绘制身体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 10, 20, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制手臂
        const armAngle = this.state === 'eating' 
            ? Math.sin(this.armSwing) * 0.3 
            : Math.sin(this.walkCycle) * 0.2;
        
        ctx.save();
        ctx.translate(-15, 0);
        ctx.rotate(-0.5 + armAngle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-5, 0, 10, 35);
        ctx.restore();
        
        ctx.save();
        ctx.translate(15, 0);
        ctx.rotate(0.5 - armAngle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-5, 0, 10, 35);
        ctx.restore();
        
        // 绘制头部
        ctx.beginPath();
        ctx.arc(0, -25, 22, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制路障（如果还有）
        if (this.hasCone) {
            ctx.fillStyle = this.headColor;
            ctx.beginPath();
            ctx.moveTo(-18, -25);
            ctx.lineTo(0, -60);
            ctx.lineTo(18, -25);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#CC7000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 路障条纹
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-12, -35);
            ctx.lineTo(-6, -50);
            ctx.moveTo(0, -30);
            ctx.lineTo(0, -55);
            ctx.moveTo(12, -35);
            ctx.lineTo(6, -50);
            ctx.stroke();
        }
        
        // 绘制眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-8, -28, 7, 0, Math.PI * 2);
        ctx.arc(8, -28, 7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-6, -28, 3, 0, Math.PI * 2);
        ctx.arc(10, -28, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.state === 'eating') {
            ctx.arc(0, -15, 8, 0, Math.PI);
            ctx.fillStyle = '#8B0000';
            ctx.fill();
        } else {
            ctx.moveTo(-8, -15);
            ctx.lineTo(8, -15);
        }
        ctx.stroke();
        
        ctx.restore();
        
        // 绘制生命值条
        if (this.health < this.maxHealth || this.coneHealth < this.maxConeHealth) {
            this.renderHealthBar(ctx);
        }
    }
    
    reset() {
        super.reset();
        this.coneHealth = this.maxConeHealth;
        this.hasCone = true;
    }
}

