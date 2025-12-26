/**
 * EventEmitter - 简单的事件发射器
 * 用于游戏组件间的通信
 */
export class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   * @returns {Function} 取消订阅的函数
   */
  on(event, handler) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event).add(handler);
    
    // 返回取消订阅的函数
    return () => this.off(event, handler);
  }

  /**
   * 订阅一次性事件
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  once(event, handler) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };
    this.on(event, wrapper);
  }

  /**
   * 取消订阅
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  off(event, handler) {
    if (this._events.has(event)) {
      this._events.get(event).delete(handler);
      if (this._events.get(event).size === 0) {
        this._events.delete(event);
      }
    }
  }

  /**
   * 发射事件
   * @param {string} event - 事件名称
   * @param {*} payload - 事件数据
   */
  emit(event, payload) {
    if (this._events.has(event)) {
      this._events.get(event).forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * 移除所有事件监听
   * @param {string} [event] - 可选，指定事件名称
   */
  removeAllListeners(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
  }

  /**
   * 获取事件监听器数量
   * @param {string} event - 事件名称
   * @returns {number}
   */
  listenerCount(event) {
    return this._events.has(event) ? this._events.get(event).size : 0;
  }
}

export default EventEmitter;

