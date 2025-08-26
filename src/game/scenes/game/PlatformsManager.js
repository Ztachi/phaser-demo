/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-25 14:40:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:51:12
 * @FilePath: /my-phaser-game/src/game/scenes/game/PlatformsManager.js
 * @Description: 平台管理器 - 负责创建和管理游戏中的平台
 */

export class PlatformsManager {
    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     */
    constructor(scene) {
        this.scene = scene;
        this.platforms = null;
    }

    /**
     * @description: 创建平台组
     * @return {Phaser.Physics.Arcade.StaticGroup} 平台静态组
     */
    create() {
        // 创建平台静态组
        this.platforms = this.scene.physics.add.staticGroup();
        
        // 创建地面平台 - 需要缩放并刷新物理体
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        
        // 创建悬浮平台
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(700, 220, "ground");

        return this.platforms;
    }

    /**
     * @description: 获取平台组
     * @return {Phaser.Physics.Arcade.StaticGroup} 平台静态组
     */
    getPlatforms() {
        return this.platforms;
    }

    /**
     * @description: 添加新平台
     * @param {number} x X坐标
     * @param {number} y Y坐标
     * @param {string} texture 贴图名称
     * @param {number} scale 缩放比例
     * @return {Phaser.Physics.Arcade.Sprite} 创建的平台精灵
     */
    addPlatform(x, y, texture = "ground", scale = 1) {
        const platform = this.platforms.create(x, y, texture);
        if (scale !== 1) {
            platform.setScale(scale).refreshBody();
        }
        return platform;
    }

    /**
     * @description: 销毁平台管理器
     */
    destroy() {
        if (this.platforms) {
            this.platforms.destroy();
            this.platforms = null;
        }
    }
}
