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
     * @param {Array} platformsData 平台数据数组 [{x, y, scale, texture}]
     * @return {Phaser.Physics.Arcade.StaticGroup} 平台静态组
     */
    create(platformsData = []) {
        // 创建平台静态组
        this.platforms = this.scene.physics.add.staticGroup();
        
        // 根据地图数据创建平台
        platformsData.forEach(platformData => {
            const platform = this.platforms.create(
                platformData.x, 
                platformData.y, 
                platformData.texture || "ground"
            );
            
            // 如果需要缩放，则应用缩放并刷新物理体
            if (platformData.scale && platformData.scale !== 1) {
                platform.setScale(platformData.scale).refreshBody();
            }
        });

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
