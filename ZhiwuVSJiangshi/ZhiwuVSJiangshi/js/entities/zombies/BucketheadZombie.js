/**
 * 铁桶僵尸 - 头戴铁桶，非常耐打
 */

import { Zombie } from '../Zombie.js';

export class BucketheadZombie extends Zombie {
    constructor(config, row, x, y) {
        super(config, row, x, y);
        this.bucketHealth = config.bucketHealth || 300;
        this.maxBucketHealth = this.bucketHealth;
        this.hasBucket = true;
    }
    
    takeDamage(damage) {
        if (this.hasBucket && this.bucketHealth > 0) {
            this.bucketHealth -= damage;
            if (this.bucketHealth <= 0) {
                this.hasBucket = false;
                const remainingDamage = Math.abs(this.bucketHealth);
                this.bucketHealth = 0;
                if (remainingDamage > 0) {
                    super.takeDamage(remainingDamage);
                }
            }
        } else {
            super.takeDamage(damage);
        }
    }
    
    getHealthPercent() {
        const totalHealth = this.maxHealth + this.maxBucketHealth;
        const currentHealth = this.health + this.bucketHealth;
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
        
        // 绘制铁桶（如果还有）
        if (this.hasBucket) {
            // 铁桶主体
            ctx.fillStyle = this.headColor;
            ctx.beginPath();
            ctx.moveTo(-20, -20);
            ctx.lineTo(-18, -55);
            ctx.lineTo(18, -55);
            ctx.lineTo(20, -20);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#4A5568';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 铁桶把手
            ctx.strokeStyle = '#4A5568';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, -55, 12, Math.PI, 0);
            ctx.stroke();
            
            // 铁桶条纹
            ctx.strokeStyle = '#5A6A7A';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-19, -30);
            ctx.lineTo(19, -30);
            ctx.moveTo(-18, -45);
            ctx.lineTo(18, -45);
            ctx.stroke();
            
            // 根据损坏程度添加凹痕
            const bucketPercent = this.bucketHealth / this.maxBucketHealth;
            if (bucketPercent < 0.7) {
                ctx.fillStyle = '#5A6A7A';
                ctx.beginPath();
                ctx.ellipse(-8, -38, 5, 3, 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            if (bucketPercent < 0.4) {
                ctx.beginPath();
                ctx.ellipse(10, -48, 4, 2, -0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(5, -28, 6, 3, 0.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 绘制眼睛（从铁桶下面露出）
        if (!this.hasBucket) {
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
        } else {
            // 铁桶遮住大部分脸，只露出眼睛缝隙
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.ellipse(-8, -22, 5, 3, 0, 0, Math.PI * 2);
            ctx.ellipse(8, -22, 5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-7, -22, 2, 0, Math.PI * 2);
            ctx.arc(9, -22, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
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
        if (this.health < this.maxHealth || this.bucketHealth < this.maxBucketHealth) {
            this.renderHealthBar(ctx);
        }
    }
    
    reset() {
        super.reset();
        this.bucketHealth = this.maxBucketHealth;
        this.hasBucket = true;
    }
}

