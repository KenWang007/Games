/**
 * 豌豆射手 - 发射豌豆攻击僵尸
 */

import { Plant } from '../Plant.js';

export class Peashooter extends Plant {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        
        this.projectileSpeed = config.projectileSpeed || 5;
        this.projectileColor = config.projectileColor || '#32CD32';
        this.shotsPerAttack = config.shotsPerAttack || 1;
        
        // 射击动画
        this.isShootingAnimation = false;
        this.shootAnimationTime = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 射击动画
        if (this.isShootingAnimation) {
            this.shootAnimationTime += deltaTime;
            if (this.shootAnimationTime > 200) {
                this.isShootingAnimation = false;
                this.shootAnimationTime = 0;
            }
        }
    }
    
    /**
     * 触发射击动画
     */
    triggerShootAnimation() {
        this.isShootingAnimation = true;
        this.shootAnimationTime = 0;
    }
    
    /**
     * 获取子弹发射位置
     */
    getProjectileSpawnPosition() {
        return {
            x: this.x + this.width / 2,
            y: this.y
        };
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
        
        // 绘制茎
        ctx.fillStyle = '#228B22';
        ctx.fillRect(-5, 10, 10, 30);
        
        // 绘制头部（椭圆形）
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制嘴巴（发射口）
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1B5E20';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 6, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-8, -8, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制叶子
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.ellipse(-20, 15, 12, 6, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, 18, 10, 5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // 绘制生命值条（如果受伤）
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
}

