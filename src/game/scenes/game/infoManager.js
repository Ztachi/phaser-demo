/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 10:37:25
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:50:00
 * @FilePath: /my-phaser-game/src/game/scenes/game/infoManager.js
 * @Description: 信息管理器 - 负责游戏内UI显示，使用Phaser官方Data Manager
 */

import { 
    initializeGameData, 
    addScore, 
    getFormattedScore, 
    resetGameData,
    GAME_DATA_DEFAULTS 
} from "@/register";

export class InfoManager {
    // 场景引用
    scene;
    // 分数文本对象
    scoreText;
    // 等级文本对象
    levelText;

    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     */
    constructor(scene) {
        this.scene = scene;
        // 初始化游戏数据到registry（全局数据管理器）
        initializeGameData(this.scene.registry);
    }

    /**
     * @description: 创建UI元素
     */
    create() {
        // 创建分数文本
        this.scoreText = this.scene.add.text(
            16,
            16,
            getFormattedScore(this.scene.registry),
            {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "Arial",
            }
        );

        // 创建等级文本
        this.levelText = this.scene.add.text(
            16,
            56,
            `等级: ${this.scene.registry.get('level')}`,
            {
                fontSize: "24px",
                fill: "#ffff00",
                fontFamily: "Arial",
            }
        );

        // 设置游戏状态为正在游戏
        this.scene.registry.set('gameState', GAME_DATA_DEFAULTS.GAME_STATE_PLAYING);

        // 初始更新显示
        this.updateDisplay();
    }

    /**
     * @description: 增加分数
     * @param {Number} points 增加的分数
     */
    addScore(points = GAME_DATA_DEFAULTS.POINTS_PER_STAR) {
        // 使用统一的增加分数函数
        addScore(this.scene.registry, points);
        // 直接更新UI显示
        this.updateDisplay();
    }

    /**
     * @description: 更新UI显示
     */
    updateDisplay() {
        // 更新分数显示
        this.scoreText?.setText(getFormattedScore(this.scene.registry));

        // 更新等级显示
        this.levelText?.setText(`等级: ${this.scene.registry.get('level')}`);
    }

    /**
     * @description: 重置分数
     */
    resetScore() {
        // 使用统一的重置函数
        resetGameData(this.scene.registry);
        // 直接更新UI显示
        this.updateDisplay();
    }

    /**
     * @description: 获取当前分数
     * @return {Number} 当前分数
     */
    getCurrentScore() {
        return this.scene.registry.get('score');
    }

    /**
     * @description: 获取当前等级
     * @return {Number} 当前等级
     */
    getCurrentLevel() {
        return this.scene.registry.get('level');
    }

    /**
     * @description: 销毁信息管理器
     */
    destroy() {
        // 销毁UI元素
        this.scoreText?.destroy();
        this.levelText?.destroy();
        this.scoreText = null;
        this.levelText = null;
        this.scene = null;
    }
}
