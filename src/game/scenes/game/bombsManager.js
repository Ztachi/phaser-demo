/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 11:12:11
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:22:56
 * @FilePath: /my-phaser-game/src/game/scenes/game/bombsManager.js
 * @Description: 炸弹管理器
 */

export class BombsManager {
    // 炸弹组
    bombs;
    constructor(scene) {
        this.scene = scene;
    }
    create() {
        this.bombs = this.scene.physics.add.group();
        return this.bombs;
    }
    getBombs() {
        return this.bombs;
    }
}
