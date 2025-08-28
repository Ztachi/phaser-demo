/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 10:10:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:10:00
 * @FilePath: /my-phaser-game/src/registry/gameRegistry.js
 * @Description: 游戏状态注册表 - 替代Pinia的游戏状态管理
 */

import { registryManager } from './registryManager';

/**
 * @description: 游戏状态注册表类
 */
class GameRegistry {
    constructor() {
        // 游戏状态数据
        this.state = {
            // 当前分数
            score: 0,
            // 最高分数 - 从localStorage加载
            highScore: parseInt(localStorage.getItem('highScore') || '0'),
            // 游戏状态 ('menu', 'playing', 'gameOver')
            gameState: 'menu',
            // 游戏等级
            level: 1,
            // 收集的星星数量
            starsCollected: 0
        };
        
        // 注册到管理器
        registryManager.register('game', this);
    }

    /**
     * @description: 获取状态值
     * @param {String} key 状态键
     * @return {*} 状态值
     */
    get(key) {
        return this.state[key];
    }

    /**
     * @description: 设置状态值
     * @param {String} key 状态键
     * @param {*} value 新值
     */
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        // 触发状态变化事件
        registryManager.emit('game', key, value, oldValue);
    }

    /**
     * @description: 批量更新状态
     * @param {Object} updates 要更新的状态对象
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            this.set(key, updates[key]);
        });
    }

    /**
     * @description: 获取完整状态
     * @return {Object} 完整状态对象
     */
    getState() {
        return { ...this.state };
    }

    // ========== 计算属性方法 ==========

    /**
     * @description: 获取格式化的分数字符串
     * @return {String} 格式化的分数
     */
    getFormattedScore() {
        return `分数: ${this.state.score}`;
    }

    /**
     * @description: 获取格式化的最高分数字符串
     * @return {String} 格式化的最高分数
     */
    getFormattedHighScore() {
        return `最高分: ${this.state.highScore}`;
    }

    /**
     * @description: 检查是否创造了新记录
     * @return {Boolean} 是否为新记录
     */
    getIsNewRecord() {
        return this.state.score > this.state.highScore;
    }

    /**
     * @description: 获取游戏统计信息
     * @return {Object} 统计信息
     */
    getGameStats() {
        return {
            currentScore: this.state.score,
            highScore: this.state.highScore,
            level: this.state.level,
            starsCollected: this.state.starsCollected,
            isPlaying: this.state.gameState === 'playing'
        };
    }

    // ========== 动作方法 ==========

    /**
     * @description: 增加分数
     * @param {Number} points 增加的分数
     */
    addScore(points = 10) {
        this.set('score', this.state.score + points);
        this.set('starsCollected', this.state.starsCollected + 1);
        
        // 检查是否升级(每100分升一级)
        const newLevel = Math.floor(this.state.score / 100) + 1;
        if (newLevel > this.state.level) {
            this.set('level', newLevel);
        }
    }

    /**
     * @description: 重置当前游戏分数
     */
    resetScore() {
        this.update({
            score: 0,
            level: 1,
            starsCollected: 0
        });
    }

    /**
     * @description: 更新最高分数
     */
    updateHighScore() {
        if (this.state.score > this.state.highScore) {
            this.set('highScore', this.state.score);
            // 保存到本地存储
            localStorage.setItem('highScore', this.state.highScore.toString());
        }
    }

    /**
     * @description: 设置游戏状态
     * @param {String} state 游戏状态 ('menu', 'playing', 'gameOver')
     */
    setGameState(state) {
        this.set('gameState', state);
        
        // 如果游戏结束，更新最高分
        if (state === 'gameOver') {
            this.updateHighScore();
        }
    }

    /**
     * @description: 开始新游戏
     */
    startNewGame() {
        this.resetScore();
        this.setGameState('playing');
    }

    /**
     * @description: 游戏结束
     */
    gameOver() {
        this.setGameState('gameOver');
        this.updateHighScore();
    }

    /**
     * @description: 返回主菜单
     */
    backToMenu() {
        this.setGameState('menu');
    }

    /**
     * @description: 直接设置分数(用于测试或特殊情况)
     * @param {Number} scoreValue 分数值
     */
    setScore(scoreValue) {
        this.set('score', Math.max(0, scoreValue));
    }

    /**
     * @description: 清空所有数据(重置游戏)
     */
    clearAllData() {
        this.update({
            score: 0,
            highScore: 0,
            level: 1,
            starsCollected: 0,
            gameState: 'menu'
        });
        localStorage.removeItem('highScore');
    }

    /**
     * @description: 监听状态变化
     * @param {String} key 状态键
     * @param {Function} callback 回调函数
     * @return {Function} 取消监听的函数
     */
    watch(key, callback) {
        return registryManager.watch('game', key, callback);
    }

    /**
     * @description: 销毁注册表
     */
    destroy() {
        registryManager.unregister('game');
    }
}

// 创建并导出单例实例
export const gameRegistry = new GameRegistry();

// 导出类用于类型检查或测试
export { GameRegistry };
