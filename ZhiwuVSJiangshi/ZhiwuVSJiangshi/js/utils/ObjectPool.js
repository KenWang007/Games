/**
 * 对象池 - 用于复用频繁创建销毁的对象
 * 提高性能，减少GC压力
 */

export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        
        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    /**
     * 获取一个对象
     */
    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        this.active.push(obj);
        return obj;
    }
    
    /**
     * 释放一个对象回池中
     */
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    /**
     * 释放所有活动对象
     */
    releaseAll() {
        while (this.active.length > 0) {
            const obj = this.active.pop();
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    /**
     * 获取活动对象数量
     */
    getActiveCount() {
        return this.active.length;
    }
    
    /**
     * 获取池中对象数量
     */
    getPoolSize() {
        return this.pool.length;
    }
    
    /**
     * 遍历所有活动对象
     */
    forEach(callback) {
        // 使用副本遍历，防止遍历过程中修改
        const activeCopy = [...this.active];
        for (const obj of activeCopy) {
            callback(obj);
        }
    }
    
    /**
     * 过滤活动对象，返回符合条件的对象数组
     */
    filter(predicate) {
        return this.active.filter(predicate);
    }
}

