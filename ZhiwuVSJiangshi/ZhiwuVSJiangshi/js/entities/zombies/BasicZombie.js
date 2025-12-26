/**
 * 普通僵尸
 */

import { Zombie } from '../Zombie.js';

export class BasicZombie extends Zombie {
    constructor(config, row, x, y) {
        super(config, row, x, y);
    }
    
    // 使用基类的默认渲染
}

