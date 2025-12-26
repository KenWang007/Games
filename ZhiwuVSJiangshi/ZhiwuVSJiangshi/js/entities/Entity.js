/**
 * 实体基类 - 所有游戏对象的基类
 */

export class Entity {
    constructor(x = 0, y = 0, width = 50, height = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.layer = 0;
        
        // 动画相关
        this.animationTime = 0;
    }
    
    /**
     * 更新实体状态
     * @param {number} deltaTime - 帧间隔时间(ms)
     */
    update(deltaTime) {
        this.animationTime += deltaTime;
    }
    
    /**
     * 渲染实体
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    render(ctx) {
        // 子类实现
    }
    
    /**
     * 获取实体边界框
     */
    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }
    
    /**
     * 检测与另一个实体的碰撞
     */
    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return !(a.right < b.left || 
                 a.left > b.right || 
                 a.bottom < b.top || 
                 a.top > b.bottom);
    }
    
    /**
     * 检测点是否在实体内
     */
    containsPoint(x, y) {
        const bounds = this.getBounds();
        return x >= bounds.left && x <= bounds.right &&
               y >= bounds.top && y <= bounds.bottom;
    }
    
    /**
     * 设置位置
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * 销毁实体
     */
    destroy() {
        this.active = false;
    }
    
    /**
     * 重置实体（用于对象池）
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.active = true;
        this.animationTime = 0;
    }
}

