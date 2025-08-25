/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-22 11:48:16
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-25 14:39:48
 * @FilePath: /my-phaser-game/src/game/scenes/game/index.js
 * @Description:
 */
import { EventBus } from "../../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    platforms;
    player;
    cursor;
    canDoubleJump = false;
    isDoubleJump = false;
    //是否起跳过
    isJump = false;

    constructor() {
        super("Game");
    }

    create() {
        // 背景
        this.add.image(400, 300, "sky");

        // 平台 静态组
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");
        // 玩家
        this.player = this.physics.add.sprite(100, 450, "dude");
        // 设置玩家反弹
        this.player.setBounce(0.1);
        // 设置玩家碰撞世界边界
        this.player.setCollideWorldBounds(true);
        // 设置玩家重力
        this.player.body.setGravityY(700);
        // 动画
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // 碰撞检测
        this.physics.add.collider(this.player, this.platforms);

        // 键盘控制
        this.cursor = this.input.keyboard.createCursorKeys();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (this.cursor.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

        // if (this.cursor.up.isDown && this.player.body.touching.down) {
        //     this.player.setVelocityY(-430);
        // }

        // 如果玩家在地面，则重置二段跳状态
        if (this.player.body.touching.down) {
            // 重置二段跳状态
            this.isDoubleJump = false;
            // 重置起跳状态
            this.isJump = false;
        }

        // 如果在一段跳之后，玩家松开向上键，则可以进行二段跳
        if (this.canDoubleJump && this.cursor.up.isUp) {
            this.isDoubleJump = true;
        }

        // 如果玩家按下向上键，则进行跳跃
        if (this.cursor.up.isDown) {
            // 如果玩家没有起跳过，则进行跳跃
            if (!this.isJump) {
                this.player.setVelocityY(-430);
                // 起跳过
                this.isJump = true;
                // 一段跳起跳之后，可以进行二段跳
                this.canDoubleJump = true;
            } else if (this.canDoubleJump && this.isDoubleJump) {
                // 进行二段跳
                this.player.setVelocityY(-430);
                // 二段跳起跳之后，重置二段跳状态
                this.canDoubleJump = false;
            }
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

