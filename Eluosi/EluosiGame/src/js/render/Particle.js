/**
 * Particle - 粒子类
 * 用于烟花和撒花效果
 */
export class Particle {
  constructor(x, y, color, options = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    
    // 速度
    const angle = options.angle ?? Math.random() * Math.PI * 2;
    const speed = options.speed ?? (Math.random() * 6 + 2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // 物理参数
    this.gravity = options.gravity ?? 0.15;
    this.friction = options.friction ?? 0.98;
    this.alpha = 1;
    this.decay = options.decay ?? (Math.random() * 0.02 + 0.015);
    this.size = options.size ?? (Math.random() * 4 + 2);
    
    // 形状: 'circle', 'star', 'square'
    this.shape = options.shape ?? 'circle';
    
    // 旋转（用于非圆形粒子）
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  /**
   * 更新粒子状态
   */
  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.rotation += this.rotationSpeed;
  }

  /**
   * 绘制粒子
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.alpha <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    switch (this.shape) {
      case 'star':
        this.drawStar(ctx);
        break;
      case 'square':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      case 'circle':
      default:
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }

  /**
   * 绘制星形
   * @param {CanvasRenderingContext2D} ctx
   */
  drawStar(ctx) {
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size / 2;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 粒子是否已消失
   * @returns {boolean}
   */
  get isDead() {
    return this.alpha <= 0;
  }
}

export default Particle;

