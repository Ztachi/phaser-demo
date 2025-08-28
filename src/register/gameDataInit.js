/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 10:40:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:40:00
 * @FilePath: /my-phaser-game/src/register/gameDataInit.js
 * @Description: 游戏数据初始化管理 - 统一管理游戏数据的默认值和初始化逻辑
 */

/**
 * @description: 游戏数据默认值常量
 */
export const GAME_DATA_DEFAULTS = {
    // 分数相关
    SCORE: 0,
    LEVEL: 1,
    STARS_COLLECTED: 0,
    
    // 游戏状态
    GAME_STATE_MENU: 'menu',
    GAME_STATE_PLAYING: 'playing',
    GAME_STATE_GAME_OVER: 'gameOver',
    
    // 升级所需分数
    POINTS_PER_LEVEL: 100,
    
    // 每次收集星星的分数
    POINTS_PER_STAR: 10
};

/**
 * @description: 获取最高分数（从localStorage读取）
 * @return {Number} 最高分数
 */
export const getHighScoreFromStorage = () => {
    return parseInt(localStorage.getItem('highScore') || '0');
};

/**
 * @description: 保存最高分数到localStorage
 * @param {Number} score 要保存的分数
 */
export const saveHighScoreToStorage = (score) => {
    localStorage.setItem('highScore', score.toString());
};

/**
 * @description: 初始化游戏数据到registry
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 * @param {Boolean} force 是否强制重新初始化
 */
export const initializeGameData = (registry, force = false) => {
    // 如果数据已存在且不强制初始化，则跳过
    if (!force && registry.has('score')) {
        return;
    }
    
    // 设置初始游戏数据
    registry.set({
        score: GAME_DATA_DEFAULTS.SCORE,
        level: GAME_DATA_DEFAULTS.LEVEL,
        starsCollected: GAME_DATA_DEFAULTS.STARS_COLLECTED,
        highScore: getHighScoreFromStorage(),
        gameState: GAME_DATA_DEFAULTS.GAME_STATE_MENU
    });
    
    console.log('游戏数据已初始化');
};

/**
 * @description: 重置游戏数据（新游戏）
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 */
export const resetGameData = (registry) => {
    registry.set({
        score: GAME_DATA_DEFAULTS.SCORE,
        level: GAME_DATA_DEFAULTS.LEVEL,
        starsCollected: GAME_DATA_DEFAULTS.STARS_COLLECTED,
        gameState: GAME_DATA_DEFAULTS.GAME_STATE_PLAYING
    });
    
    console.log('游戏数据已重置');
};

/**
 * @description: 设置游戏结束状态并更新最高分
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 */
export const setGameOverState = (registry) => {
    const currentScore = registry.get('score');
    const currentHighScore = registry.get('highScore');
    
    // 设置游戏状态
    registry.set('gameState', GAME_DATA_DEFAULTS.GAME_STATE_GAME_OVER);
    
    // 更新最高分
    if (currentScore > currentHighScore) {
        registry.set('highScore', currentScore);
        saveHighScoreToStorage(currentScore);
        console.log(`新记录！最高分更新为: ${currentScore}`);
    }
};

/**
 * @description: 增加分数并检查升级
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 * @param {Number} points 增加的分数
 */
export const addScore = (registry, points = GAME_DATA_DEFAULTS.POINTS_PER_STAR) => {
    const currentScore = registry.get('score');
    const currentStars = registry.get('starsCollected');
    const currentLevel = registry.get('level');
    
    // 更新分数和星星数量
    const newScore = currentScore + points;
    registry.set('score', newScore);
    registry.set('starsCollected', currentStars + 1);
    
    // 检查是否升级
    const newLevel = Math.floor(newScore / GAME_DATA_DEFAULTS.POINTS_PER_LEVEL) + 1;
    if (newLevel > currentLevel) {
        registry.set('level', newLevel);
        console.log(`升级了！当前等级: ${newLevel}`);
    }
};

/**
 * @description: 获取格式化的分数字符串
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 * @return {String} 格式化的分数
 */
export const getFormattedScore = (registry) => {
    return `分数: ${registry.get('score')}`;
};

/**
 * @description: 检查是否创造了新记录
 * @param {Phaser.Data.DataManager} registry Phaser的数据管理器
 * @return {Boolean} 是否为新记录
 */
export const isNewRecord = (registry) => {
    return registry.get('score') > registry.get('highScore');
};
