/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-25 14:40:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 09:52:22
 * @FilePath: /my-phaser-game/src/game/scenes/game/PlayerManager.js
 * @Description: 玩家管理器 - 负责玩家的创建、动画和移动逻辑
 */

export class PlayerManager {
    // 场景
    scene;
    // 玩家精灵
    player;
    // 是否可以二段跳，刚执行了一段跳
    canDoubleJump = false;
    // 是否已完成一段跳可以二段跳，松开了跳跃键
    isDoubleJump = false;
    // 是否起跳过
    isJump = false;
    // 移动速度
    moveSpeed = 160;
    // 跳跃力度
    jumpPower = -430;
    // 重力
    gravity = 700;
    // 弹跳系数
    bounce = 0.1;

    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * @description: 创建玩家精灵和动画
     * @param {number} x 初始X坐标
     * @param {number} y 初始Y坐标
     * @return {Phaser.Physics.Arcade.Sprite} 玩家精灵
     */
    create(x = 100, y = 450) {
        // 创建玩家精灵
        this.player = this.scene.physics.add.sprite(x, y, "dude");

        // 设置玩家物理属性
        this.player.setBounce(this.bounce);
        // 设置玩家碰撞世界边界（在大地图中仍然需要，防止玩家掉出地图）
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(this.gravity);

        // 创建动画
        this._createAnimations();

        return this.player;
    }

    /**
     * @description: 创建玩家动画
     * @private
     */
    _createAnimations() {
        // 检查并创建向左移动动画
        if (!this.scene.anims.exists("left")) {
            this.scene.anims.create({
                key: "left",
                frames: this.scene.anims.generateFrameNumbers("dude", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });
        }

        // 检查并创建静止动画
        if (!this.scene.anims.exists("turn")) {
            this.scene.anims.create({
                key: "turn",
                frames: [{ key: "dude", frame: 4 }],
                frameRate: 20,
            });
        }

        // 检查并创建向右移动动画
        if (!this.scene.anims.exists("right")) {
            this.scene.anims.create({
                key: "right",
                frames: this.scene.anims.generateFrameNumbers("dude", {
                    start: 5,
                    end: 8,
                }),
                frameRate: 10,
                repeat: -1,
            });
        }
    }

    /**
     * @description: 玩家向左移动
     */
    moveLeft() {
        this.player.setVelocityX(-this.moveSpeed);
        this.player.anims.play("left", true);
    }

    /**
     * @description: 玩家向右移动
     */
    moveRight() {
        this.player.setVelocityX(this.moveSpeed);
        this.player.anims.play("right", true);
    }

    /**
     * @description: 玩家停止移动
     */
    stopMoving() {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
    }

    /**
     * @description: 玩家跳跃逻辑
     */
    jump() {
        // 如果玩家没有起跳过，则进行第一段跳跃
        if (!this.isJump) {
            this.player.setVelocityY(this.jumpPower);
            this.isJump = true;
            this.canDoubleJump = true; // 一段跳起跳后可以进行二段跳
        } else if (this.canDoubleJump && this.isDoubleJump) {
            // 进行二段跳
            this.player.setVelocityY(this.jumpPower);
            this.canDoubleJump = false; // 二段跳后重置状态
        }
    }

    /**
     * @description: 更新玩家状态(每帧调用)
     * @param {boolean} isUpKeyPressed 向上键是否按下
     * @param {boolean} isUpKeyReleased 向上键是否释放
     */
    updateJumpState(isUpKeyPressed, isUpKeyReleased) {
        // 如果玩家在地面，重置跳跃状态
        if (this.player.body.touching.down) {
            this.isDoubleJump = false;
            this.isJump = false;
        }

        // 如果在一段跳之后，玩家松开向上键，则可以进行二段跳
        if (this.canDoubleJump && isUpKeyReleased) {
            this.isDoubleJump = true;
        }

        // 如果玩家按下向上键，则进行跳跃
        if (isUpKeyPressed) {
            this.jump();
        }
    }

    /**
     * @description: 获取玩家精灵
     * @return {Phaser.Physics.Arcade.Sprite} 玩家精灵
     */
    getPlayer() {
        return this.player;
    }

    /**
     * @description: 设置玩家位置
     * @param {number} x X坐标
     * @param {number} y Y坐标
     */
    setPosition(x, y) {
        this.player?.setPosition(x, y);
    }

    /**
     * @description: 销毁玩家管理器
     */
    destroy() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        // 重置状态
        this.canDoubleJump = false;
        this.isDoubleJump = false;
        this.isJump = false;

        // 清空场景引用
        this.scene = null;
    }
}

