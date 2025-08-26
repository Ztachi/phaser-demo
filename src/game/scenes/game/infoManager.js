/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 10:37:25
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:51:49
 * @FilePath: /my-phaser-game/src/game/scenes/game/infoManager.js
 * @Description: 信息管理器 - 负责游戏内UI显示和Pinia状态同步
 */

import { useGameStore } from "@/stores/gameStore";

export class InfoManager {
    // 场景引用
    scene;
    // 分数文本对象
    scoreText;
    // 等级文本对象
    levelText;
    // 游戏状态store
    gameStore;

    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     */
    constructor(scene) {
        this.scene = scene;
        // 获取游戏状态store实例
        this.gameStore = useGameStore();
    }

    /**
     * @description: 创建UI元素
     */
    create() {
        // 创建分数文本
        this.scoreText = this.scene.add.text(
            16,
            16,
            this.gameStore.formattedScore,
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
            `等级: ${this.gameStore.level}`,
            {
                fontSize: "24px",
                fill: "#ffff00",
                fontFamily: "Arial",
            }
        );

        // 设置游戏状态为正在游戏
        this.gameStore.setGameState("playing");

        // 初始更新显示
        this.updateDisplay();
    }

    /**
     * @description: 增加分数
     * @param {Number} points 增加的分数
     */
    addScore(points = 10) {
        // 通过Pinia store更新分数
        this.gameStore.addScore(points);

        // 更新UI显示
        this.updateDisplay();
    }

    /**
     * @description: 更新UI显示
     */
    updateDisplay() {
        // 更新分数显示
        this.scoreText?.setText(this.gameStore.formattedScore, {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "Arial",
        });

        // 更新等级显示
        this.levelText?.setText(`等级: ${this.gameStore.level}`, {
            fontSize: "24px",
            fill: "#ffff00",
            fontFamily: "Arial",
        });
    }

    /**
     * @description: 重置分数
     */
    resetScore() {
        this.gameStore.resetScore();
        this.updateDisplay();
    }

    /**
     * @description: 获取当前分数
     * @return {Number} 当前分数
     */
    getCurrentScore() {
        return this.gameStore.score;
    }

    /**
     * @description: 获取当前等级
     * @return {Number} 当前等级
     */
    getCurrentLevel() {
        return this.gameStore.level;
    }

    /**
     * @description: 销毁信息管理器
     */
    destroy() {
        this.scoreText?.destroy();
        this.levelText?.destroy();
        this.scoreText = null;
        this.levelText = null;
        this.gameStore = null;
    }
}
