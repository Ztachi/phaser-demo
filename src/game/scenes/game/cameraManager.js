/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 11:28:07
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 11:32:08
 * @FilePath: /my-phaser-game/src/game/scenes/game/cameraManager.js
 * @Description: 相机管理器 负责管理游戏中的相机
 */

export class CameraManager {
    mainCamera = null;
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * @description: 创建并配置相机
     * @param {Object} playerManager 玩家管理器
     * @param {Object} worldBounds 世界边界 {width, height}
     * @return {CameraManager} 返回自身以支持链式调用
     */
    create(playerManager, worldBounds) {
        this.mainCamera = this.scene.cameras.main;
        
        // 设置相机边界，防止显示世界外内容
        if (worldBounds) {
            this.mainCamera.setBounds(0, 0, worldBounds.width, worldBounds.height);
        }
        
        // 设置相机跟随玩家，添加平滑跟随效果
        this.mainCamera.startFollow(playerManager.player, false, 0.1, 0.1);
        
        // 设置死区，减少相机抖动（相机中心区域玩家移动不会触发相机移动）
        this.mainCamera.setDeadzone(100, 50);
        
        return this;
    }
}

