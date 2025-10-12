/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 09:50:57
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-10-12 11:30:00
 * @FilePath: /my-phaser-game/src/game/scenes/game/starManager.js
 * @Description: 星星管理器
 */

import { STAR_CONFIG } from "@/const/mapConfig";

export class StarManager {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
        // 记录所有平台的Y坐标，用于判断是否为顶层平台
        this.platformYPositions = [];
    }

    /**
     * @description: 创建星星组
     * @param {Array} starsData 星星位置数据数组 [{x, y}]
     * @param {Array} platformsData 平台数据数组（用于计算顶层平台）
     * @return {Phaser.Physics.Arcade.Group} 星星组
     */
    create(starsData = [], platformsData = []) {
        // 创建星星组
        this.stars = this.scene.physics.add.group();
        
        // 收集所有悬浮平台的Y坐标并排序，找出顶层平台
        this.platformYPositions = platformsData
            .filter(p => p.y < 1500) // 排除地面平台
            .map(p => p.y)
            .sort((a, b) => a - b); // 从小到大排序，最小的Y值为顶层
        
        // 根据位置数据创建每个星星
        starsData.forEach(starData => {
            const star = this.stars.create(starData.x, starData.y, "star");
            // 设置随机弹跳系数
            star.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
            // 标记星星还未接触过任何平台
            star.setData('hasLanded', false);
        });
        
        return this.stars;
    }

    /**
     * @description: 星星与平台碰撞回调（判断是否穿透平台）
     * @param {Phaser.Physics.Arcade.Sprite} star 星星
     * @param {Phaser.Physics.Arcade.Sprite} platform 平台
     * @return {boolean} 是否发生碰撞（true=碰撞停止，false=穿透）
     */
    starPlatformCollision(star, platform) {
        // 如果星星已经落在某个平台上，不再判断（避免已经在平台上的星星掉落）
        if (star.getData('hasLanded')) {
            return true;
        }
        
        // 判断是否为地面平台（Y坐标接近底部）
        const isGroundPlatform = platform.y >= 900; // 地面平台范围
        
        // 地面平台100%停止，避免掉出游戏区域
        if (isGroundPlatform) {
            star.setData('hasLanded', true);
            return true;
        }
        
        // 其他平台：第一次接触时，50%概率停止，50%概率穿透
        const shouldStop = Math.random() < STAR_CONFIG.BOUNCE_STOP_PROBABILITY;
        
        if (shouldStop) {
            // 标记星星已落在平台上
            star.setData('hasLanded', true);
            return true;
        }
        
        // 穿透平台，不标记，继续下落
        return false;
    }

    /**
     * @description: 获取星星组
     * @return {Phaser.Physics.Arcade.Group} 星星组
     */
    getStars() {
        return this.stars;
    }
}

