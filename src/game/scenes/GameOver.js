/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-22 11:48:16
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 13:08:45
 * @FilePath: /my-phaser-game/src/game/scenes/GameOver.js
 * @Description: 游戏结束场景 - 显示最终得分和最高分
 */
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { useGameStore } from '@/stores/gameStore';

export class GameOver extends Scene {
    // 游戏状态store
    gameStore;

    constructor() {
        super('GameOver');
    }

    /**
     * @description: 创建场景
     */
    create() {
        // 获取游戏状态store
        this.gameStore = useGameStore();
        
        // 设置游戏状态为结束并更新最高分
        this.gameStore.gameOver();

        // 设置背景颜色
        this.cameras.main.setBackgroundColor(0x2c3e50);

        // 添加背景图片(如果存在)
        if (this.textures.exists('sky')) {
            this.add.image(400, 300, 'sky').setAlpha(0.3);
        }

        // 游戏结束标题
        this.add.text(400, 200, 'Game Over', {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#e74c3c',
            stroke: '#ffffff', 
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // 最终得分
        this.add.text(400, 280, `最终得分: ${this.gameStore.score}`, {
            fontFamily: 'Arial', 
            fontSize: 32, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // 等级显示
        this.add.text(400, 320, `等级: ${this.gameStore.level}`, {
            fontFamily: 'Arial', 
            fontSize: 24, 
            color: '#f39c12',
            stroke: '#000000', 
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // 收集的星星数量
        this.add.text(400, 350, `收集星星: ${this.gameStore.starsCollected}`, {
            fontFamily: 'Arial', 
            fontSize: 24, 
            color: '#f1c40f',
            stroke: '#000000', 
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // 最高分显示
        this.add.text(400, 400, `最高分: ${this.gameStore.highScore}`, {
            fontFamily: 'Arial', 
            fontSize: 28, 
            color: '#e67e22',
            stroke: '#000000', 
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // 新记录提示
        if (this.gameStore.isNewRecord) {
            this.add.text(400, 440, '🎉 新记录！', {
                fontFamily: 'Arial', 
                fontSize: 24, 
                color: '#2ecc71',
                stroke: '#000000', 
                strokeThickness: 2,
                align: 'center'
            }).setOrigin(0.5);
        }

        // 操作提示
        this.add.text(400, 500, '点击任意键重新开始', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#95a5a6',
            align: 'center'
        }).setOrigin(0.5);

        // 添加键盘监听
        this.input.keyboard.on('keydown', this.handleKeyPress, this);
        
        // 添加鼠标点击监听
        this.input.on('pointerdown', this.handleKeyPress, this);

        EventBus.emit('current-scene-ready', this);
    }

    /**
     * @description: 处理按键或点击事件
     */
    handleKeyPress() {
        // 重新开始游戏
        this.gameStore.startNewGame();
        this.changeScene();
    }

    /**
     * @description: 切换场景
     */
    changeScene() {
        this.scene.start("Game");
    }

    /**
     * @description: 销毁场景时清理资源
     */
    destroy() {
        // 移除事件监听
        this.input.keyboard.off('keydown', this.handleKeyPress, this);
        this.input.off('pointerdown', this.handleKeyPress, this);
        
        // 清空store引用
        this.gameStore = null;
    }
}
