/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 11:20:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:30:00
 * @FilePath: /my-phaser-game/src/stores/gameStore.js
 * @Description: 游戏状态管理 - 使用Pinia Composition API管理游戏数据
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * @description: 游戏状态Store - 使用Composition API写法
 */
export const useGameStore = defineStore('game', () => {
    // 状态定义 - 使用ref创建响应式状态
    // 当前分数
    const score = ref(0);
    // 最高分数 - 从localStorage加载
    const highScore = ref(parseInt(localStorage.getItem('highScore') || '0'));
    // 游戏状态 ('menu', 'playing', 'gameOver')
    const gameState = ref('menu');
    // 游戏等级
    const level = ref(1);
    // 收集的星星数量
    const starsCollected = ref(0);

    // 计算属性 - 使用computed创建派生状态
    /**
     * @description: 获取格式化的分数字符串
     * @return {String} 格式化的分数
     */
    const formattedScore = computed(() => {
        return `分数: ${score.value}`;
    });

    /**
     * @description: 获取格式化的最高分数字符串
     * @return {String} 格式化的最高分数
     */
    const formattedHighScore = computed(() => {
        return `最高分: ${highScore.value}`;
    });

    /**
     * @description: 检查是否创造了新记录
     * @return {Boolean} 是否为新记录
     */
    const isNewRecord = computed(() => {
        return score.value > highScore.value;
    });

    /**
     * @description: 获取游戏统计信息
     * @return {Object} 统计信息
     */
    const gameStats = computed(() => ({
        currentScore: score.value,
        highScore: highScore.value,
        level: level.value,
        starsCollected: starsCollected.value,
        isPlaying: gameState.value === 'playing'
    }));

    // 动作方法 - 使用普通函数定义
    /**
     * @description: 增加分数
     * @param {Number} points 增加的分数
     */
    const addScore = (points = 10) => {
        score.value += points;
        starsCollected.value++;
        
        // 检查是否升级(每100分升一级)
        const newLevel = Math.floor(score.value / 100) + 1;
        if (newLevel > level.value) {
            level.value = newLevel;
        }
    };

    /**
     * @description: 重置当前游戏分数
     */
    const resetScore = () => {
        score.value = 0;
        level.value = 1;
        starsCollected.value = 0;
    };

    /**
     * @description: 更新最高分数
     */
    const updateHighScore = () => {
        if (score.value > highScore.value) {
            highScore.value = score.value;
            // 保存到本地存储
            localStorage.setItem('highScore', highScore.value.toString());
        }
    };

    /**
     * @description: 设置游戏状态
     * @param {String} state 游戏状态 ('menu', 'playing', 'gameOver')
     */
    const setGameState = (state) => {
        gameState.value = state;
        
        // 如果游戏结束，更新最高分
        if (state === 'gameOver') {
            updateHighScore();
        }
    };

    /**
     * @description: 开始新游戏
     */
    const startNewGame = () => {
        resetScore();
        setGameState('playing');
    };

    /**
     * @description: 游戏结束
     */
    const gameOver = () => {
        setGameState('gameOver');
        updateHighScore();
    };

    /**
     * @description: 返回主菜单
     */
    const backToMenu = () => {
        setGameState('menu');
    };

    /**
     * @description: 直接设置分数(用于测试或特殊情况)
     * @param {Number} scoreValue 分数值
     */
    const setScore = (scoreValue) => {
        score.value = Math.max(0, scoreValue);
    };

    /**
     * @description: 清空所有数据(重置游戏)
     */
    const clearAllData = () => {
        score.value = 0;
        highScore.value = 0;
        level.value = 1;
        starsCollected.value = 0;
        gameState.value = 'menu';
        localStorage.removeItem('highScore');
    };

    // 返回所有需要暴露的状态、计算属性和方法
    return {
        // 状态
        score,
        highScore,
        gameState,
        level,
        starsCollected,
        
        // 计算属性
        formattedScore,
        formattedHighScore,
        isNewRecord,
        gameStats,
        
        // 方法
        addScore,
        resetScore,
        updateHighScore,
        setGameState,
        startNewGame,
        gameOver,
        backToMenu,
        setScore,
        clearAllData
    };
});
