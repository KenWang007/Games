/**
 * 机枪射手 - 一次发射四颗豌豆，火力凶猛
 */

import { Peashooter } from './Peashooter.js';

export class GatlingPea extends Peashooter {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        this.shotsPerAttack = 4;
        this.barrelRotation = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        // 枪管旋转动画
        if (this.isShootingAnimation) {
            this.barrelRotation += deltaTime * 0.05;
        }
    }
    
    render(ctx) {
        // 摇摆动画
        const sway = Math.sin(this.animationTime * 0.003 + this.swayOffset) * 2;
        
        // 射击后坐力动画
        let recoil = 0;
        if (this.isShootingAnimation) {
            const progress = this.shootAnimationTime / 200;
            recoil = Math.sin(progress * Math.PI) * 8;
        }
        
        ctx.save();
        ctx.translate(this.x - recoil, this.y);
        ctx.rotate(sway * Math.PI / 180);
        
        // 绘制茎（深绿色，更粗壮）
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(-6, 10, 12, 32);
        
        // 绘制主体（更大更强壮）
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#006400';
        ctx.fill();
        ctx.strokeStyle = '#004D00';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制机枪管（四个）
        ctx.save();
        ctx.translate(15, 0);
        ctx.rotate(this.barrelRotation);
        
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate((i / 4) * Math.PI * 2);
            ctx.fillStyle = '#2E7D32';
            ctx.beginPath();
            ctx.roundRect(-4, -15, 8, 25, 3);
            ctx.fill();
            ctx.strokeStyle = '#1B5E20';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
        
        // 中心圆
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#1B5E20';
        ctx.fill();
        ctx.restore();
        
        // 绘制眼睛（更凶狠的眼神）
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-8, -8, 9, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -8, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 眉毛（凶狠的表情）
        ctx.strokeStyle = '#004D00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -18);
        ctx.lineTo(-3, -15);
        ctx.stroke();
        
        // 头盔
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(0, -15, 18, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制叶子
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.ellipse(-28, 15, 14, 7, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(22, 18, 12, 6, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // 绘制生命值条（如果受伤）
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
}

