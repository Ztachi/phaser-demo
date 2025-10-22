/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-22 11:48:16
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-10-11 04:59:33
 * @FilePath: /my-phaser-game/src/game/scenes/game/index.js
 * @Description: 游戏主场景 - 使用模块化架构管理游戏组件
 */
import { Scene } from "phaser";
import { EventBus } from "@/game/EventBus";
import { AUDIO_EVENTS } from "@/const/audioEvents";
import { PlatformsManager } from "./PlatformsManager";
import { PlayerManager } from "./PlayerManager";
import { StarManager } from "./starManager";
import { InfoManager } from "./infoManager";
import { BombsManager } from "./bombsManager";
import { InputController } from "./InputController";
import { CameraManager } from "./cameraManager";
import { MapGenerator } from "./MapGenerator";

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
    // 相机管理器
    cameraManager;
    // 地图生成器
    mapGenerator;
    // 地图数据
    mapData;
    
    constructor() {
        super("Game");
    }

    /**
     * @description: 场景创建方法
     */
    create() {
        // 生成地图数据
        this.mapGenerator = new MapGenerator();
        this.mapData = this.mapGenerator.generate();

        // 设置物理世界边界
        this.physics.world.setBounds(
            0, 
            0, 
            this.mapData.worldBounds.width, 
            this.mapData.worldBounds.height
        );

        // 添加背景 - 固定在相机视口，不随世界滚动
        const background = this.add.image(400, 300, "sky");
        background.setScrollFactor(0);

        // 初始化管理器
        this._initializeManagers();

        // 设置物理碰撞
        this._setupPhysics();

        // 发送音频事件 - 进入游戏场景时播放背景音乐
        EventBus.emit(AUDIO_EVENTS.BGM_PLAY);

        // 场景准备完成事件
        EventBus.emit("current-scene-ready", this);
    }

    /**
     * @description: 初始化各个管理器
     * @private
     */
    _initializeManagers() {
        // 创建平台管理器并传入地图数据
        this.platformsManager = new PlatformsManager(this);
        this.platformsManager.create(this.mapData.platforms);

        // 创建玩家管理器并初始化玩家（起始位置在地图左下区域）
        this.playerManager = new PlayerManager(this);
        this.playerManager.create(100, this.mapData.worldBounds.height - 200);

        // 创建星星管理器并传入星星位置数据和平台数据
        this.starManager = new StarManager(this);
        this.starManager.create(this.mapData.stars, this.mapData.platforms);

        // 创建信息管理器并传入总星星数量
        this.infoManager = new InfoManager(this);
        this.infoManager.create(this.mapData.stars.length);

        // 创建炸弹管理器
        this.bombsManager = new BombsManager(this);
        this.bombsManager.create();

        // 创建输入控制器
        this.inputController = new InputController(this, this.playerManager);
        this.inputController.create();

        // 创建相机管理器并传入世界边界
        this.cameraManager = new CameraManager(this);
        this.cameraManager.create(this.playerManager, this.mapData.worldBounds);
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

        // 设置星星与平台的碰撞检测（使用自定义碰撞处理实现穿透逻辑）
        this.physics.add.collider(
            this.starManager.getStars(),
            this.platformsManager.getPlatforms(),
            null,
            (star, platform) => this.starManager.starPlatformCollision(star, platform),
            this
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
        // 播放触碰炸弹的音频
        EventBus.emit(AUDIO_EVENTS.TOUCH_BOMB);

        // 延迟一下再切换场景，让玩家看到碰撞效果
        this.time.delayedCall(1000, () => {
            // 发送音频事件 - 退出游戏场景时停止背景音乐
            EventBus.emit(AUDIO_EVENTS.BGM_STOP);
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
        // 播放获取星星的音频
        EventBus.emit(AUDIO_EVENTS.GET_STAR);
        
        // 更新剩余星星数量显示
        const remainingCount = stars.countActive(true);
        this.infoManager.updateRemainingStars(remainingCount);
        
        // 如果星星组没有星星，则创建炸弹并重置星星
        if (remainingCount === 0) {
            // 重新生成星星数据（随机数量和X坐标）
            const newStarsData = this.mapGenerator.regenerateStars();
            this.mapData.stars = newStarsData;
            
            // 获取当前星星数组
            const starsArray = stars.children.entries;
            
            // 如果新一轮星星数量多于当前星星数量，需要创建新星星
            while (starsArray.length < newStarsData.length) {
                const newStar = stars.create(0, 0, "star");
                newStar.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
                starsArray.push(newStar);
            }
            
            // 如果新一轮星星数量少于当前星星数量，禁用多余的星星
            if (starsArray.length > newStarsData.length) {
                for (let i = newStarsData.length; i < starsArray.length; i++) {
                    starsArray[i].disableBody(true, true);
                }
            }
            
            // 启用星星（使用新的X坐标）
            for (let i = 0; i < newStarsData.length; i++) {
                const star = starsArray[i];
                // 重置星星的落地标记，允许重新下落和判断
                star.setData('hasLanded', false);
                // 启用星星，使用新的随机X坐标
                star.enableBody(true, newStarsData[i].x, 0, true, true);
            }
            
            // 更新剩余星星数量为新的总数
            this.infoManager.updateRemainingStars(newStarsData.length);
            
            // 根据新的世界边界随机生成炸弹的x坐标
            const worldWidth = this.mapData.worldBounds.width;
            const x = Phaser.Math.Between(100, worldWidth - 100);
            
            // 创建炸弹
            const bomb = this.bombsManager.getBombs().create(x, 16, "bomb");
            // 设置炸弹的反弹（完全弹性，保持一直跳跃）
            bomb.setBounce(1);
            // 设置炸弹的碰撞世界边界
            bomb.setCollideWorldBounds(true);
            // 设置炸弹的速度（增大X方向速度，形成抛物线而非原地跳）
            bomb.setVelocity(Phaser.Math.Between(-300, 300), 20);
        }
    }

    /**
     * @description: 场景更新方法(每帧调用)
     */
    update() {
        // 更新输入控制器，处理玩家移动和跳跃
        this.inputController?.update();
        
        // 更新星星方向箭头
        if (this.playerManager && this.starManager && this.infoManager) {
            const player = this.playerManager.getPlayer();
            const stars = this.starManager.getStars();
            
            // 获取所有活跃的星星
            const activeStars = stars?.getChildren().filter(star => star.active) || [];
            
            // 更新箭头指向
            this.infoManager.updateStarArrow(
                { x: player.x, y: player.y },
                activeStars
            );
        }
    }

    /**
     * @description: 切换到游戏结束场景
     */
    changeScene() {
        // 发送音频事件 - 退出游戏场景时停止背景音乐
        EventBus.emit(AUDIO_EVENTS.BGM_STOP);
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

