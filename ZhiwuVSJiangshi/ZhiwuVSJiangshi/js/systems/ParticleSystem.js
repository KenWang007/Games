/**
 * 粒子系统 - 用于视觉特效
 */

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 200;
    }
    
    /**
     * 创建粒子
     */
    createParticle(x, y, options = {}) {
        if (this.particles.length >= this.maxParticles) {
            // 移除最老的粒子
            this.particles.shift();
        }
        
        const particle = {
            x: x,
            y: y,
            vx: options.vx || (Math.random() - 0.5) * 4,
            vy: options.vy || (Math.random() - 0.5) * 4,
            size: options.size || 5,
            color: options.color || '#FFD700',
            alpha: 1,
            life: options.life || 500,
            maxLife: options.life || 500,
            gravity: options.gravity || 0,
            shrink: options.shrink !== false,
            type: options.type || 'circle'
        };
        
        this.particles.push(particle);
        return particle;
    }
    
    /**
     * 创建爆炸效果
     */
    createExplosion(x, y, color = '#FFD700', count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4 + Math.random() * 4,
                color: color,
                life: 300 + Math.random() * 200,
                gravity: 0.1
            });
        }
    }
    
    /**
     * 创建击中效果
     */
    createHitEffect(x, y) {
        // 绿色豌豆碎片
        for (let i = 0; i < 5; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 4 - 2,
                size: 3 + Math.random() * 3,
                color: '#90EE90',
                life: 200 + Math.random() * 100,
                gravity: 0.2
            });
        }
    }
    
    /**
     * 创建冰冻击中效果
     */
    createIceHitEffect(x, y) {
        // 蓝色冰晶碎片
        for (let i = 0; i < 6; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 3 - 1,
                size: 3 + Math.random() * 4,
                color: '#87CEEB',
                life: 300 + Math.random() * 150,
                gravity: 0.1,
                type: 'star'
            });
        }
    }
    
    /**
     * 创建毒液击中效果
     */
    createPoisonHitEffect(x, y) {
        // 紫色毒液飞溅
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.createParticle(x, y, {
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2),
                size: 4 + Math.random() * 4,
                color: i % 2 === 0 ? '#9932CC' : '#DA70D6',
                life: 400 + Math.random() * 200,
                gravity: 0.05,
                shrink: true
            });
        }
        
        // 毒气上升
        for (let i = 0; i < 4; i++) {
            this.createParticle(x + (Math.random() - 0.5) * 20, y, {
                vx: (Math.random() - 0.5) * 1,
                vy: -Math.random() * 2 - 0.5,
                size: 6 + Math.random() * 6,
                color: 'rgba(153, 50, 204, 0.5)',
                life: 600,
                gravity: -0.03,
                shrink: true
            });
        }
    }
    
    /**
     * 创建火焰击中效果
     */
    createFireHitEffect(x, y) {
        // 火焰爆发
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const speed = 3 + Math.random() * 3;
            this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: 5 + Math.random() * 5,
                color: i % 3 === 0 ? '#FFFF00' : (i % 3 === 1 ? '#FF8C00' : '#FF4500'),
                life: 300 + Math.random() * 150,
                gravity: -0.05,
                shrink: true
            });
        }
        
        // 火星飞溅
        for (let i = 0; i < 6; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 5 - 2,
                size: 2 + Math.random() * 2,
                color: '#FFFF00',
                life: 400,
                gravity: 0.15
            });
        }
    }
    
    /**
     * 创建阳光收集效果
     */
    createSunCollectEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            this.createParticle(x, y, {
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                size: 4,
                color: '#FFD700',
                life: 400,
                gravity: 0
            });
        }
    }
    
    /**
     * 创建种植效果
     */
    createPlantEffect(x, y) {
        // 泥土飞溅
        for (let i = 0; i < 8; i++) {
            this.createParticle(x, y + 20, {
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3 - 1,
                size: 3 + Math.random() * 3,
                color: '#8B4513',
                life: 300,
                gravity: 0.15
            });
        }
    }
    
    /**
     * 创建僵尸死亡效果
     */
    createZombieDeathEffect(x, y) {
        // 绿色烟雾
        for (let i = 0; i < 12; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 2 - 1,
                size: 8 + Math.random() * 8,
                color: '#90EE90',
                life: 500 + Math.random() * 200,
                gravity: -0.02,
                shrink: true
            });
        }
    }
    
    /**
     * 更新所有粒子
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.vx * (deltaTime / 16.67);
            p.y += p.vy * (deltaTime / 16.67);
            
            // 应用重力
            p.vy += p.gravity * (deltaTime / 16.67);
            
            // 更新生命
            p.life -= deltaTime;
            p.alpha = Math.max(0, p.life / p.maxLife);
            
            // 缩小
            if (p.shrink) {
                p.size = p.size * (p.life / p.maxLife);
            }
            
            // 移除死亡粒子
            if (p.life <= 0 || p.size < 0.5) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * 渲染所有粒子
     */
    render(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            
            if (p.type === 'star') {
                // 星形粒子
                this.drawStar(ctx, p.x, p.y, p.size);
            } else {
                // 圆形粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    /**
     * 绘制星形
     */
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? size : size / 2;
            if (i === 0) {
                ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
            } else {
                ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 清空所有粒子
     */
    clear() {
        this.particles = [];
    }
}

