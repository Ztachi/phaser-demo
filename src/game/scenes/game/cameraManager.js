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
    create(playerManager) {
        this.mainCamera = this.scene.cameras.main;
        // 设置相机跟随玩家
        this.mainCamera.startFollow(playerManager.player);
        return this;
    }
}

