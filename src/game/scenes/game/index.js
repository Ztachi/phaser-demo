/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-22 11:48:16
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:40:50
 * @FilePath: /my-phaser-game/src/game/scenes/game/index.js
 * @Description: 游戏主场景 - 使用模块化架构管理游戏组件
 */
import { EventBus } from "../../EventBus";
import { Scene } from "phaser";
import { PlatformsManager } from "./PlatformsManager";
import { PlayerManager } from "./PlayerManager";
import { StarManager } from "./starManager";
import { InfoManager } from "./infoManager";
import { BombsManager } from "./bombsManager";
import { InputController } from "./InputController";
export class Game extends Scene {
    // 管理器实例
    platformsManager;
    // 玩家管理器
    playerManager;

    // 星星管理器
    starManager;
    // 信息管理器
    infoManager;
    // 炸弹管理器
    bombsManager;
    // 输入控制器
    inputController;
    constructor() {
        super("Game");
    }

    /**
     * @description: 场景创建方法
     */
    create() {
        // 添加背景
        this.add.image(400, 300, "sky");

        // 初始化管理器
        this._initializeManagers();

        // 设置物理碰撞
        this._setupPhysics();

        // 场景准备完成事件
        EventBus.emit("current-scene-ready", this);
    }

    /**
     * @description: 初始化各个管理器
     * @private
     */
    _initializeManagers() {
        // 创建平台管理器并初始化平台
        this.platformsManager = new PlatformsManager(this);
        this.platformsManager.create();

        // 创建玩家管理器并初始化玩家
        this.playerManager = new PlayerManager(this);
        this.playerManager.create(100, 450);

        // 创建星星管理器并初始化星星
        this.starManager = new StarManager(this);
        this.starManager.create();

        // 创建信息管理器
        this.infoManager = new InfoManager(this);
        this.infoManager.create();

        // 创建炸弹管理器
        this.bombsManager = new BombsManager(this);
        this.bombsManager.create();

        // 创建输入控制器
        this.inputController = new InputController(this, this.playerManager);
        this.inputController.create();
    }

    /**
     * @description: 设置物理碰撞
     * @private
     */
    _setupPhysics() {
        // 设置玩家与平台的碰撞检测
        this.physics.add.collider(
            this.playerManager.getPlayer(),
            this.platformsManager.getPlatforms()
        );

        // 设置星星与平台的碰撞检测
        this.physics.add.collider(
            this.starManager.getStars(),
            this.platformsManager.getPlatforms()
        );
        // 设置星星与玩家的碰撞检测
        this.physics.add.overlap(
            this.playerManager.getPlayer(),
            this.starManager.getStars(),
            this._collectStar,
            null,
            this
        );
        // 设置炸弹与平台的碰撞检测
        this.physics.add.collider(
            this.bombsManager.getBombs(),
            this.platformsManager.getPlatforms()
        );
        // 设置炸弹与玩家的碰撞检测
        this.physics.add.collider(
            this.playerManager.getPlayer(),
            this.bombsManager.getBombs(),
            this._hitBomb,
            null,
            this
        );
    }

    /**
     * @description: 炸弹与玩家碰撞
     * @param {*} player
     * @param {*} bomb
     */
    _hitBomb(player, bomb) {
        // 暂停游戏
        this.physics.pause();
        // 设置玩家为红色
        player.setTint(0xff0000);
        // 播放玩家动画
        player.anims.play("turn");

        // 延迟一下再切换场景，让玩家看到碰撞效果
        this.time.delayedCall(1000, () => {
            // 切换到游戏结束场景
            this.scene.start("GameOver");
        });
    }

    /**
     * @description: 收集星星
     * @param {*} player
     * @param {*} star
     */
    _collectStar(player, star) {
        // 获取星星组
        const stars = this.starManager.getStars();
        // 禁用星星
        star.disableBody(true, true);
        // 添加分数
        this.infoManager.addScore(10);

        // 如果星星组没有星星，则创建炸弹
        if (stars.countActive(true) === 0) {
            // 启用星星
            stars.children.iterate((child) => {
                // 启用星星
                child.enableBody(true, child.x, 0, true, true);
            });
            // 随机生成炸弹的x坐标
            const x =
                player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);
            // 创建炸弹
            const bomb = this.bombsManager.getBombs().create(x, 16, "bomb");
            // 设置炸弹的反弹
            bomb.setBounce(1);
            // 设置炸弹的碰撞世界边界
            bomb.setCollideWorldBounds(true);
            // 设置炸弹的速度
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    /**
     * @description: 场景更新方法(每帧调用)
     */
    update() {
        // 更新输入控制器，处理玩家移动和跳跃
        this.inputController?.update();
    }

    /**
     * @description: 切换到游戏结束场景
     */
    changeScene() {
        this.scene.start("GameOver");
    }

    /**
     * @description: 销毁场景时清理资源
     */
    destroy() {
        // 销毁各个管理器
        this.platformsManager?.destroy();
        this.playerManager?.destroy();
        this.starManager?.destroy();
        this.infoManager?.destroy();
        this.bombsManager?.destroy();
        this.inputController?.destroy();

        // 清空引用
        this.platformsManager = null;
        this.playerManager = null;
        this.starManager = null;
        this.infoManager = null;
        this.bombsManager = null;
        this.inputController = null;
    }
}

