/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 09:50:57
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:23:20
 * @FilePath: /my-phaser-game/src/game/scenes/game/starManager.js
 * @Description: 星星管理器
 */

export class StarManager {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
    }

    create() {
        this.stars = this.scene.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });
        return this.stars;
    }

    getStars() {
        return this.stars;
    }
}

