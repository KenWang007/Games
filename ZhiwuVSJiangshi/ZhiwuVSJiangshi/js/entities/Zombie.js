/**
 * 僵尸基类 - 呆萌可爱版
 */

import { Entity } from './Entity.js';
import { CELL_HEIGHT, CANVAS_WIDTH } from '../config/constants.js';

export class Zombie extends Entity {
    constructor(config, row, x, y) {
        super(x, y, 60, CELL_HEIGHT - 10);
        
        this.config = config;
        this.row = row;
        
        // 属性
        this.id = config.id;
        this.name = config.name;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.baseSpeed = config.speed;
        this.attackDamage = config.attackDamage;
        this.attackInterval = config.attackInterval;
        this.color = config.color;
        this.headColor = config.headColor;
        this.emoji = config.emoji;
        
        // 状态
        this.state = 'walking'; // walking, eating, dying
        this.targetPlant = null;
        
        // 攻击计时
        this.attackTimer = 0;
        
        // 减速效果
        this.slowedUntil = 0;
        this.slowMultiplier = 1;
        
        // 中毒效果
        this.poisonedUntil = 0;
        this.poisonDamage = 0;
        this.poisonTimer = 0;
        
        // 动画参数 - 更流畅可爱
        this.walkCycle = 0;
        this.armSwing = 0;
        this.bouncePhase = Math.random() * Math.PI * 2; // 随机起始相位
        this.headBob = 0;
        this.eyeBlink = 0;
        this.blinkTimer = Math.random() * 3000; // 随机眨眼时机
        this.mouthOpen = 0;
        this.legPhase = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新减速效果
        if (this.slowedUntil > 0) {
            this.slowedUntil -= deltaTime;
            if (this.slowedUntil <= 0) {
                this.slowMultiplier = 1;
            }
        }
        
        // 更新中毒效果
        if (this.poisonedUntil > 0) {
            this.poisonedUntil -= deltaTime;
            this.poisonTimer += deltaTime;
            
            // 每秒造成毒伤害
            if (this.poisonTimer >= 1000) {
                this.poisonTimer -= 1000;
                this.takeDamage(this.poisonDamage);
            }
            
            if (this.poisonedUntil <= 0) {
                this.poisonDamage = 0;
            }
        }
        
        // 眨眼动画
        this.blinkTimer -= deltaTime;
        if (this.blinkTimer <= 0) {
            this.eyeBlink = 1;
            this.blinkTimer = 2000 + Math.random() * 2000;
        }
        if (this.eyeBlink > 0) {
            this.eyeBlink -= deltaTime * 0.01;
            if (this.eyeBlink < 0) this.eyeBlink = 0;
        }
        
        // 根据状态更新动画
        if (this.state === 'walking') {
            this.move(deltaTime);
            this.walkCycle += deltaTime * 0.008;
            this.headBob += deltaTime * 0.012;
            this.legPhase += deltaTime * 0.01;
        } else if (this.state === 'eating') {
            this.attackTimer += deltaTime;
            this.armSwing += deltaTime * 0.025;
            this.mouthOpen = Math.abs(Math.sin(this.armSwing * 2));
            this.headBob += deltaTime * 0.015;
        }
    }
    
    /**
     * 移动
     */
    move(deltaTime) {
        const actualSpeed = this.speed * this.slowMultiplier * (deltaTime / 16.67);
        this.x -= actualSpeed;
        this.walkCycle += actualSpeed * 0.1;
    }
    
    /**
     * 检查是否可以攻击
     */
    canAttack() {
        return this.state === 'eating' && this.attackTimer >= this.attackInterval;
    }
    
    /**
     * 执行攻击
     */
    performAttack() {
        this.attackTimer = 0;
        return this.attackDamage;
    }
    
    /**
     * 开始吃植物
     */
    startEating(plant) {
        this.state = 'eating';
        this.targetPlant = plant;
        this.attackTimer = this.attackInterval * 0.5; // 快速开始第一次攻击
    }
    
    /**
     * 停止吃植物
     */
    stopEating() {
        this.state = 'walking';
        this.targetPlant = null;
        this.attackTimer = 0;
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.state = 'dying';
            this.destroy();
        }
    }
    
    /**
     * 应用减速效果
     */
    applySlow(multiplier, duration) {
        this.slowMultiplier = multiplier;
        this.slowedUntil = duration;
    }
    
    /**
     * 应用中毒效果
     */
    applyPoison(damage, duration) {
        this.poisonDamage = damage;
        this.poisonedUntil = duration;
    }
    
    /**
     * 是否被减速
     */
    isSlowed() {
        return this.slowedUntil > 0;
    }
    
    /**
     * 是否中毒
     */
    isPoisoned() {
        return this.poisonedUntil > 0;
    }
    
    /**
     * 检查是否到达左侧边界（游戏失败）
     */
    hasReachedEnd() {
        return this.x < 0;
    }
    
    /**
     * 获取生命值百分比
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 减速时变蓝，中毒时变紫
        if (this.isSlowed() && this.isPoisoned()) {
            ctx.filter = 'hue-rotate(240deg) saturate(0.8)';
        } else if (this.isSlowed()) {
            ctx.filter = 'hue-rotate(180deg) saturate(0.7)';
        } else if (this.isPoisoned()) {
            ctx.filter = 'hue-rotate(280deg) saturate(0.9)';
        }
        
        // 行走时的弹跳和摇晃效果
        const bounce = this.state === 'walking' 
            ? Math.abs(Math.sin(this.walkCycle * 1.5)) * 4 
            : 0;
        const wobble = this.state === 'walking' 
            ? Math.sin(this.walkCycle) * 4 
            : (this.state === 'eating' ? Math.sin(this.headBob) * 2 : 0);
        
        ctx.translate(0, -bounce);
        ctx.rotate(wobble * Math.PI / 180);
        
        // 绘制腿部（呆萌短腿）
        this.renderLegs(ctx);
        
        // 绘制身体（圆润的身体）
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 8, 22, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 身体高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.ellipse(-8, -2, 8, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 8, 22, 32, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制手臂（更可爱的手臂动作）
        this.renderArms(ctx);
        
        // 绘制头部（更大更圆）
        this.renderHead(ctx);
        
        ctx.restore();
        
        // 绘制生命值条
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
    
    renderLegs(ctx) {
        const legSwing = this.state === 'walking' ? Math.sin(this.legPhase) * 0.25 : 0;
        
        // 左腿
        ctx.save();
        ctx.translate(-10, 35);
        ctx.rotate(-legSwing);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-6, 0, 12, 20, 4);
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 小脚丫
        ctx.fillStyle = '#556B2F';
        ctx.beginPath();
        ctx.ellipse(0, 22, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 右腿
        ctx.save();
        ctx.translate(10, 35);
        ctx.rotate(legSwing);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-6, 0, 12, 20, 4);
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 小脚丫
        ctx.fillStyle = '#556B2F';
        ctx.beginPath();
        ctx.ellipse(0, 22, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    renderArms(ctx) {
        const armAngle = this.state === 'eating' 
            ? Math.sin(this.armSwing) * 0.4 + 0.3
            : Math.sin(this.walkCycle) * 0.3;
        
        // 左手臂 - 向前伸出的经典僵尸姿势
        ctx.save();
        ctx.translate(-18, 0);
        ctx.rotate(-0.8 + armAngle);
        // 上臂
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-5, 0, 10, 25, 4);
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 小手
        ctx.beginPath();
        ctx.arc(0, 28, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右手臂
        ctx.save();
        ctx.translate(18, 0);
        ctx.rotate(0.8 - armAngle * 0.5);
        // 上臂
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-5, 0, 10, 25, 4);
        ctx.fill();
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 小手
        ctx.beginPath();
        ctx.arc(0, 28, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    renderHead(ctx) {
        const headTilt = Math.sin(this.headBob * 0.8) * 3;
        
        ctx.save();
        ctx.translate(0, -28);
        ctx.rotate(headTilt * Math.PI / 180);
        
        // 头部主体（更大更圆）
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fillStyle = this.headColor;
        ctx.fill();
        
        // 头部高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.ellipse(-10, -10, 10, 8, -0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制大眼睛（呆萌风格）
        const eyeY = -3;
        const eyeSpacing = 12;
        const blinkScale = 1 - this.eyeBlink * 0.9;
        
        // 眼白
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.save();
        ctx.translate(-eyeSpacing, eyeY);
        ctx.scale(1, blinkScale);
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();
        
        ctx.beginPath();
        ctx.save();
        ctx.translate(eyeSpacing, eyeY);
        ctx.scale(1, blinkScale);
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();
        
        // 瞳孔（看向前方，吃东西时盯着植物）
        if (blinkScale > 0.3) {
            const pupilOffset = this.state === 'eating' ? -2 : 0;
            ctx.fillStyle = '#2F4F4F';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + pupilOffset, eyeY, 5, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + pupilOffset, eyeY, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // 眼睛高光
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(-eyeSpacing + pupilOffset - 2, eyeY - 2, 2, 0, Math.PI * 2);
            ctx.arc(eyeSpacing + pupilOffset - 2, eyeY - 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 可爱的腮红
        ctx.fillStyle = 'rgba(255, 150, 150, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-18, 8, 6, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(18, 8, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        this.renderMouth(ctx);
        
        ctx.restore();
    }
    
    renderMouth(ctx) {
        ctx.strokeStyle = '#556B2F';
        ctx.lineWidth = 2;
        
        if (this.state === 'eating') {
            // 吃东西时：张合的嘴巴，露出小牙齿
            const openAmount = this.mouthOpen * 8 + 4;
            
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.ellipse(0, 15, 10, openAmount, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // 小牙齿
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.moveTo(-6, 15 - openAmount + 2);
            ctx.lineTo(-3, 15 - openAmount + 5);
            ctx.lineTo(0, 15 - openAmount + 2);
            ctx.lineTo(3, 15 - openAmount + 5);
            ctx.lineTo(6, 15 - openAmount + 2);
            ctx.lineTo(6, 15 - openAmount);
            ctx.lineTo(-6, 15 - openAmount);
            ctx.closePath();
            ctx.fill();
        } else {
            // 行走时：呆萌的微笑
            ctx.beginPath();
            ctx.arc(0, 12, 8, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
            
            // 小舌头偶尔伸出
            if (Math.sin(this.walkCycle * 2) > 0.8) {
                ctx.fillStyle = '#FF6B6B';
                ctx.beginPath();
                ctx.ellipse(0, 18, 4, 3, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    renderHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 6;
        const x = this.x - barWidth / 2;
        const y = this.y - this.height / 2 - 15;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // 生命值
        const healthPercent = this.getHealthPercent();
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // 边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }
    
    reset() {
        super.reset();
        this.health = this.maxHealth;
        this.state = 'walking';
        this.targetPlant = null;
        this.attackTimer = 0;
        this.slowedUntil = 0;
        this.slowMultiplier = 1;
        this.walkCycle = 0;
        this.headBob = 0;
        this.eyeBlink = 0;
        this.mouthOpen = 0;
        this.legPhase = 0;
        this.poisonedUntil = 0;
        this.poisonDamage = 0;
        this.poisonTimer = 0;
    }
}

