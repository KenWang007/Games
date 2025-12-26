/**
 * 植物基类
 */

import { Entity } from './Entity.js';
import { CELL_WIDTH, CELL_HEIGHT } from '../config/constants.js';

export class Plant extends Entity {
    constructor(config, row, col, x, y) {
        super(x, y, CELL_WIDTH - 10, CELL_HEIGHT - 10);
        
        this.config = config;
        this.row = row;
        this.col = col;
        
        // 属性
        this.id = config.id;
        this.name = config.name;
        this.health = config.health;
        this.maxHealth = config.health;
        this.attackDamage = config.attackDamage;
        this.attackInterval = config.attackInterval;
        this.color = config.color;
        this.emoji = config.emoji;
        
        // 攻击计时
        this.attackTimer = 0;
        this.canAttack = this.attackDamage > 0;
        
        // 动画
        this.swayOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 攻击计时
        if (this.canAttack) {
            this.attackTimer += deltaTime;
        }
    }
    
    /**
     * 检查是否可以攻击
     */
    canPerformAttack() {
        if (!this.canAttack) return false;
        return this.attackTimer >= this.attackInterval;
    }
    
    /**
     * 执行攻击后重置计时器
     */
    performAttack() {
        this.attackTimer = 0;
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
    }
    
    /**
     * 获取生命值百分比
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
    
    render(ctx) {
        // 摇摆动画
        const sway = Math.sin(this.animationTime * 0.003 + this.swayOffset) * 3;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(sway * Math.PI / 180);
        
        // 绘制植物主体（圆形）
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#2D5016';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制表情
        ctx.font = `${this.width / 1.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
        
        ctx.restore();
        
        // 绘制生命值条（如果受伤）
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
    
    renderHealthBar(ctx) {
        const barWidth = this.width * 0.8;
        const barHeight = 6;
        const x = this.x - barWidth / 2;
        const y = this.y - this.height / 2 - 10;
        
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
        this.attackTimer = 0;
    }
}

