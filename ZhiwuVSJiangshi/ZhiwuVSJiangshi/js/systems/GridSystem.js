/**
 * 草坪网格系统 - 管理5x9的游戏格子
 */

import { GRID_ROWS, GRID_COLS, GRID_OFFSET_X, GRID_OFFSET_Y, CELL_WIDTH, CELL_HEIGHT, COLORS } from '../config/constants.js';

export class GridSystem {
    constructor() {
        this.rows = GRID_ROWS;
        this.cols = GRID_COLS;
        this.offsetX = GRID_OFFSET_X;
        this.offsetY = GRID_OFFSET_Y;
        this.cellWidth = CELL_WIDTH;
        this.cellHeight = CELL_HEIGHT;
        
        // 网格数据：存储每个格子中的植物
        this.grid = this.createEmptyGrid();
        
        // 当前悬停的格子
        this.hoverCell = null;
    }
    
    /**
     * 创建空网格
     */
    createEmptyGrid() {
        const grid = [];
        for (let row = 0; row < this.rows; row++) {
            grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                grid[row][col] = null;
            }
        }
        return grid;
    }
    
    /**
     * 重置网格
     */
    reset() {
        this.grid = this.createEmptyGrid();
        this.hoverCell = null;
    }
    
    /**
     * 像素坐标转网格坐标
     */
    pixelToGrid(x, y) {
        const col = Math.floor((x - this.offsetX) / this.cellWidth);
        const row = Math.floor((y - this.offsetY) / this.cellHeight);
        
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return { row, col };
        }
        return null;
    }
    
    /**
     * 网格坐标转像素坐标（格子中心）
     */
    gridToPixel(row, col) {
        return {
            x: this.offsetX + col * this.cellWidth + this.cellWidth / 2,
            y: this.offsetY + row * this.cellHeight + this.cellHeight / 2
        };
    }
    
    /**
     * 网格坐标转像素坐标（格子左上角）
     */
    gridToPixelTopLeft(row, col) {
        return {
            x: this.offsetX + col * this.cellWidth,
            y: this.offsetY + row * this.cellHeight
        };
    }
    
    /**
     * 检查格子是否为空
     */
    isCellEmpty(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return false;
        }
        return this.grid[row][col] === null;
    }
    
    /**
     * 在格子中放置植物
     */
    placePlant(row, col, plant) {
        if (this.isCellEmpty(row, col)) {
            this.grid[row][col] = plant;
            return true;
        }
        return false;
    }
    
    /**
     * 移除格子中的植物
     */
    removePlant(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            const plant = this.grid[row][col];
            this.grid[row][col] = null;
            return plant;
        }
        return null;
    }
    
    /**
     * 获取指定位置的植物
     */
    getPlantAt(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }
    
    /**
     * 获取格子中的植物
     */
    getPlant(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }
    
    /**
     * 获取某一行的所有植物
     */
    getPlantsInRow(row) {
        const plants = [];
        if (row >= 0 && row < this.rows) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    plants.push({
                        plant: this.grid[row][col],
                        col: col
                    });
                }
            }
        }
        return plants;
    }
    
    /**
     * 更新悬停格子
     */
    updateHover(x, y) {
        this.hoverCell = this.pixelToGrid(x, y);
    }
    
    /**
     * 渲染网格
     */
    render(ctx) {
        // 绘制草坪格子
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = this.offsetX + col * this.cellWidth;
                const y = this.offsetY + row * this.cellHeight;
                
                // 交替颜色
                const isLight = (row + col) % 2 === 0;
                ctx.fillStyle = isLight ? COLORS.GRASS_LIGHT : COLORS.GRASS_DARK;
                ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
                
                // 格子边框
                ctx.strokeStyle = COLORS.GRID_LINE;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
            }
        }
        
        // 绘制悬停高亮
        if (this.hoverCell) {
            const { row, col } = this.hoverCell;
            const x = this.offsetX + col * this.cellWidth;
            const y = this.offsetY + row * this.cellHeight;
            
            ctx.fillStyle = this.isCellEmpty(row, col) 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
            
            // 高亮边框
            ctx.strokeStyle = this.isCellEmpty(row, col)
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, this.cellWidth - 4, this.cellHeight - 4);
        }
    }
    
    /**
     * 获取行的Y坐标范围
     */
    getRowYRange(row) {
        const y = this.offsetY + row * this.cellHeight;
        return {
            top: y,
            bottom: y + this.cellHeight,
            center: y + this.cellHeight / 2
        };
    }
    
    /**
     * 获取所有植物
     */
    getAllPlants() {
        const plants = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    plants.push({
                        plant: this.grid[row][col],
                        row: row,
                        col: col
                    });
                }
            }
        }
        return plants;
    }
}

