/**
 * 输入处理器 - 处理鼠标和触屏输入
 */

export class Input {
    constructor(canvas) {
        this.canvas = canvas;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.clickHandlers = [];
        this.moveHandlers = [];
        
        this.init();
    }
    
    init() {
        // 鼠标事件
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // 触屏事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }
    
    /**
     * 获取相对于Canvas的坐标
     */
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    handleMouseMove(e) {
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.mouseX = coords.x;
        this.mouseY = coords.y;
        
        for (const handler of this.moveHandlers) {
            handler(coords.x, coords.y);
        }
    }
    
    handleMouseDown(e) {
        this.isMouseDown = true;
    }
    
    handleMouseUp(e) {
        this.isMouseDown = false;
    }
    
    handleClick(e) {
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.triggerClick(coords.x, coords.y);
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
            this.mouseX = coords.x;
            this.mouseY = coords.y;
            this.isMouseDown = true;
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
            this.mouseX = coords.x;
            this.mouseY = coords.y;
            
            for (const handler of this.moveHandlers) {
                handler(coords.x, coords.y);
            }
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.isMouseDown = false;
        // 触屏点击
        this.triggerClick(this.mouseX, this.mouseY);
    }
    
    triggerClick(x, y) {
        for (const handler of this.clickHandlers) {
            handler(x, y);
        }
    }
    
    /**
     * 注册点击事件处理器
     */
    onClick(handler) {
        this.clickHandlers.push(handler);
    }
    
    /**
     * 注册移动事件处理器
     */
    onMove(handler) {
        this.moveHandlers.push(handler);
    }
    
    /**
     * 移除点击事件处理器
     */
    offClick(handler) {
        const index = this.clickHandlers.indexOf(handler);
        if (index !== -1) {
            this.clickHandlers.splice(index, 1);
        }
    }
    
    /**
     * 获取当前鼠标位置
     */
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }
}

