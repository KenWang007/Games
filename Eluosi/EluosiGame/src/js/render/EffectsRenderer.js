/**
 * EffectsRenderer - 特效渲染器
 * 负责烟花、撒花等粒子效果
 */
import { Particle } from './Particle.js';
import { FIREWORK_COLORS, BOARD_WIDTH, CELL_SIZE } from '../game/constants.js';
import { setupHighDPICanvas, randomChoice } from '../utils/helpers.js';

export class EffectsRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    // Canvas尺寸会在resize时设置
  }

  /**
   * 调整大小
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.ctx = setupHighDPICanvas(this.canvas, width, height);
  }

  /**
   * 清空画布
   */
  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  /**
   * 开始动画循环
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * 停止动画循环
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 动画循环
   */
  animate() {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    
    // 如果还有粒子，继续动画
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.clear();
    }
  }

  /**
   * 更新所有粒子
   */
  update() {
    // 更新并移除死亡粒子
    this.particles = this.particles.filter(particle => {
      particle.update();
      return !particle.isDead;
    });
  }

  /**
   * 渲染所有粒子
   */
  render() {
    this.clear();
    this.particles.forEach(particle => particle.draw(this.ctx));
  }

  /**
   * 播放硬降撒花效果
   * @param {number} x - 方块中心X坐标
   * @param {number} y - 方块落地Y坐标
   * @param {string} color - 方块颜色
   */
  playHardDropEffect(x, y, color) {
    const particleCount = 15;
    const colors = [color, '#FFFFFF', '#FFD700', lightenColor(color, 30)];
    
    for (let i = 0; i < particleCount; i++) {
      // 向上和两侧散开的粒子
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = Math.random() * 4 + 2;
      
      this.particles.push(new Particle(x, y, randomChoice(colors), {
        angle,
        speed,
        gravity: 0.2,
        friction: 0.95,
        decay: 0.03 + Math.random() * 0.02,
        size: Math.random() * 3 + 1,
        shape: Math.random() > 0.5 ? 'star' : 'circle'
      }));
    }
    
    this.start();
  }

  /**
   * 播放消行烟花效果
   * @param {number[]} lines - 被消除的行号
   */
  playLineClearFirework(lines) {
    const count = lines.length;
    
    // 根据消除行数决定烟花规模
    const burstCount = count >= 4 ? 3 : count >= 2 ? 2 : 1;
    const particlesPerBurst = count >= 4 ? 80 : count >= 2 ? 50 : 30;
    
    // 在屏幕中心区域放烟花
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    for (let b = 0; b < burstCount; b++) {
      // 稍微错开位置和时间
      const offsetX = (Math.random() - 0.5) * this.width * 0.4;
      const offsetY = (Math.random() - 0.5) * this.height * 0.3;
      const delay = b * 150;
      
      setTimeout(() => {
        this.createFireworkBurst(
          centerX + offsetX,
          centerY + offsetY,
          particlesPerBurst
        );
      }, delay);
    }
    
    this.start();
  }

  /**
   * 创建一次烟花爆发
   * @param {number} x - 爆发中心X
   * @param {number} y - 爆发中心Y
   * @param {number} count - 粒子数量
   */
  createFireworkBurst(x, y, count) {
    // 随机选择1-2种主色
    const mainColor = randomChoice(FIREWORK_COLORS);
    const secondColor = randomChoice(FIREWORK_COLORS);
    const colors = [mainColor, secondColor, '#FFFFFF', lightenColor(mainColor, 40)];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 6 + 3;
      
      this.particles.push(new Particle(x, y, randomChoice(colors), {
        angle,
        speed,
        gravity: 0.08,
        friction: 0.97,
        decay: 0.012 + Math.random() * 0.01,
        size: Math.random() * 4 + 2,
        shape: randomChoice(['circle', 'star', 'circle'])
      }));
    }
    
    // 添加一些闪光点
    for (let i = 0; i < count / 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      
      this.particles.push(new Particle(x, y, '#FFFFFF', {
        angle,
        speed,
        gravity: 0.05,
        friction: 0.96,
        decay: 0.025 + Math.random() * 0.015,
        size: Math.random() * 2 + 1,
        shape: 'star'
      }));
    }
  }

  /**
   * 播放升级庆祝效果
   */
  playLevelUpEffect() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // 从中心向外的放射状粒子
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#FFFFFF'];
    
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      const speed = Math.random() * 5 + 3;
      
      this.particles.push(new Particle(centerX, centerY, randomChoice(colors), {
        angle,
        speed,
        gravity: 0.02,
        friction: 0.98,
        decay: 0.015,
        size: Math.random() * 5 + 2,
        shape: 'star'
      }));
    }
    
    this.start();
  }

  /**
   * 播放新纪录庆祝效果
   */
  playNewRecordEffect() {
    // 多次烟花爆发
    const positions = [
      { x: this.width * 0.25, y: this.height * 0.3 },
      { x: this.width * 0.5, y: this.height * 0.25 },
      { x: this.width * 0.75, y: this.height * 0.3 },
      { x: this.width * 0.35, y: this.height * 0.5 },
      { x: this.width * 0.65, y: this.height * 0.5 }
    ];
    
    positions.forEach((pos, i) => {
      setTimeout(() => {
        this.createFireworkBurst(pos.x, pos.y, 60);
      }, i * 200);
    });
    
    this.start();
  }

  /**
   * 清除所有粒子
   */
  clearParticles() {
    this.particles = [];
    this.clear();
  }

  /**
   * 是否有活跃的特效
   * @returns {boolean}
   */
  get isActive() {
    return this.particles.length > 0;
  }
}

/**
 * 使颜色变亮
 * @param {string} color - 十六进制颜色
 * @param {number} percent - 变亮百分比
 * @returns {string}
 */
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export default EffectsRenderer;

