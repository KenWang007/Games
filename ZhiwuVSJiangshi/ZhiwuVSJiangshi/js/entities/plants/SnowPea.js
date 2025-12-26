/**
 * 寒冰射手 - 发射冰冻豌豆，减缓僵尸
 */

import { Peashooter } from './Peashooter.js';

export class SnowPea extends Peashooter {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
        
        this.slowEffect = config.slowEffect || 0.5;
        this.slowDuration = config.slowDuration || 3000;
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
        
        // 绘制茎（冰蓝色）
        ctx.fillStyle = '#4FC3F7';
        ctx.fillRect(-5, 10, 10, 30);
        
        // 绘制头部（椭圆形，冰蓝色）
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#0288D1';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 冰霜效果
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2 + 3, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#E1F5FE';
        ctx.fill();
        ctx.restore();
        
        // 绘制嘴巴（发射口）
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0277BD';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 3, 0, 6, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#01579B';
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-8, -8, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#01579B';
        ctx.beginPath();
        ctx.arc(-5, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制冰晶装饰
        ctx.strokeStyle = '#B3E5FC';
        ctx.lineWidth = 2;
        // 左侧冰晶
        ctx.beginPath();
        ctx.moveTo(-25, -5);
        ctx.lineTo(-30, -10);
        ctx.moveTo(-25, -5);
        ctx.lineTo(-32, -3);
        ctx.moveTo(-25, -5);
        ctx.lineTo(-28, 2);
        ctx.stroke();
        // 右上冰晶
        ctx.beginPath();
        ctx.moveTo(5, -20);
        ctx.lineTo(8, -28);
        ctx.moveTo(5, -20);
        ctx.lineTo(0, -26);
        ctx.stroke();
        
        // 绘制叶子（冰蓝色）
        ctx.fillStyle = '#4FC3F7';
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

