/**
 * 坚果墙 - 高生命值防御植物
 */

import { Plant } from '../Plant.js';

export class WallNut extends Plant {
    constructor(config, row, col, x, y) {
        super(config, row, col, x, y);
    }
    
    render(ctx) {
        // 轻微晃动
        const wobble = Math.sin(this.animationTime * 0.002 + this.swayOffset) * 1;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(wobble * Math.PI / 180);
        
        const healthPercent = this.getHealthPercent();
        
        // 根据生命值改变外观
        let shellColor = '#DEB887';
        let crackLevel = 0;
        
        if (healthPercent <= 0.33) {
            shellColor = '#A0826D';
            crackLevel = 2;
        } else if (healthPercent <= 0.66) {
            shellColor = '#C4A882';
            crackLevel = 1;
        }
        
        // 绘制坚果主体
        ctx.beginPath();
        ctx.ellipse(0, 5, this.width / 2.3, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = shellColor;
        ctx.fill();
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制裂痕
        if (crackLevel >= 1) {
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, -15);
            ctx.lineTo(-5, 0);
            ctx.lineTo(-12, 15);
            ctx.stroke();
        }
        
        if (crackLevel >= 2) {
            ctx.beginPath();
            ctx.moveTo(8, -10);
            ctx.lineTo(12, 5);
            ctx.lineTo(5, 20);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(0, 5);
            ctx.stroke();
        }
        
        // 绘制眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(-10, -5, 8, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(10, -5, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -5, 4, 0, Math.PI * 2);
        ctx.arc(12, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制嘴巴 - 根据生命值变化表情
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (healthPercent > 0.66) {
            // 开心
            ctx.arc(0, 8, 10, 0.1 * Math.PI, 0.9 * Math.PI);
        } else if (healthPercent > 0.33) {
            // 担忧
            ctx.moveTo(-8, 12);
            ctx.lineTo(8, 12);
        } else {
            // 痛苦
            ctx.arc(0, 15, 8, 1.1 * Math.PI, 1.9 * Math.PI);
        }
        ctx.stroke();
        
        ctx.restore();
        
        // 绘制生命值条
        if (this.health < this.maxHealth) {
            this.renderHealthBar(ctx);
        }
    }
}

