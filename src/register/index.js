/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 10:45:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:45:00
 * @FilePath: /my-phaser-game/src/register/index.js
 * @Description: 注册表管理统一导出文件
 */

// 导出游戏数据初始化相关功能
export {
    GAME_DATA_DEFAULTS,
    getHighScoreFromStorage,
    saveHighScoreToStorage,
    initializeGameData,
    resetGameData,
    setGameOverState,
    addScore,
    getFormattedScore,
    isNewRecord
} from './gameDataInit';
