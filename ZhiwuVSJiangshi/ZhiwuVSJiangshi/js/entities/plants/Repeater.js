/**
 * 双发射手 - 一次发射两颗豌豆
 */

import { Peashooter } from './Peashooter.js';

export class Repeater extends Peashooter {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        this.shotsPerAttack = 2;
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
        
        // 绘制茎（深绿色）
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(-5, 10, 10, 30);
        
        // 绘制后面的头部
        ctx.save();
        ctx.translate(-15, 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.8, this.height / 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#388E3C';
        ctx.fill();
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 后面头部的嘴巴
        ctx.beginPath();
        ctx.ellipse(this.width / 4, 0, 7, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1B5E20';
        ctx.fill();
        ctx.restore();
        
        // 绘制前面的头部
        ctx.beginPath();
        ctx.ellipse(5, 0, this.width / 2.2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制嘴巴（发射口）
        ctx.beginPath();
        ctx.ellipse(this.width / 3 + 5, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1B5E20';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 3 + 5, 0, 6, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-3, -8, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制叶子
        ctx.fillStyle = '#4CAF50';
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

