/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-27 11:44:50
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:01:44
 * @FilePath: /my-phaser-game/src/game/scenes/AudioScene.js
 * @Description: 音频场景 - 管理全局背景音乐，通过EventBus事件控制
 */
import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import {
    AUDIO_EVENTS,
    AUDIO_ASSETS,
    AUDIO_CONFIG,
} from "../../const/audioEvents";

export class AudioScene extends Scene {
    // 背景音乐对象
    bgm;
    //获取星星的音频
    getStarAudio;

    constructor() {
        super("AudioScene");
    }

    /**
     * @description: 预加载音频资源
     */
    preload() {
        this.load.setPath("assets/audio");
        // 加载背景音乐
        this.load.audio(AUDIO_ASSETS.BGM, "bgm.mp3");
        // 加载获取星星的音频
        this.load.audio(AUDIO_ASSETS.GET_STAR, "getStar.mp3");
        // 加载触碰炸弹的音频
        this.load.audio(AUDIO_ASSETS.TOUCH_BOMB, "boom.mp3");
    }

    /**
     * @description: 创建音频场景
     */
    create() {
        // 创建背景音乐
        this.bgm = this.sound.add(AUDIO_ASSETS.BGM, {
            loop: AUDIO_CONFIG.BGM_LOOP,
        });

        // 创建获取星星的音频
        this.getStarAudio = this.sound.add(AUDIO_ASSETS.GET_STAR);
        // 创建触碰炸弹的音频
        this.touchBombAudio = this.sound.add(AUDIO_ASSETS.TOUCH_BOMB);

        // 设置EventBus音频事件监听器
        this.setupAudioEventListeners();

        console.log("AudioScene创建完成，启动Preloader场景");

        // AudioScene加载完成后，启动下一个场景
        this.scene.launch("Preloader");
    }

    /**
     * @description: 设置EventBus音频事件监听器
     */
    setupAudioEventListeners() {
        // 监听背景音乐播放事件
        EventBus.on(AUDIO_EVENTS.BGM_PLAY, this.playBGM, this);

        // 监听背景音乐停止事件
        EventBus.on(AUDIO_EVENTS.BGM_STOP, this.stopBGM, this);

        // 监听背景音乐暂停事件
        EventBus.on(AUDIO_EVENTS.BGM_PAUSE, this.pauseBGM, this);

        // 监听背景音乐恢复事件
        EventBus.on(AUDIO_EVENTS.BGM_RESUME, this.resumeBGM, this);

        // 监听音量设置事件
        EventBus.on(AUDIO_EVENTS.BGM_SET_VOLUME, this.setVolume, this);

        // 监听获取星星事件
        EventBus.on(AUDIO_EVENTS.GET_STAR, this.playGetStarAudio, this);

        // 监听触碰炸弹事件
        EventBus.on(AUDIO_EVENTS.TOUCH_BOMB, this.playTouchBombAudio, this);

        console.log("已设置EventBus音频事件监听器");
    }

    /**
     * @description: 播放背景音乐
     */
    playBGM() {
        if (this.bgm && !this.bgm.isPlaying) {
            console.log("开始播放背景音乐");
            this.bgm.play();
        }
    }

    /**
     * @description: 停止背景音乐
     */
    stopBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            console.log("停止播放背景音乐");
            this.bgm.stop();
        }
    }

    /**
     * @description: 播放获取星星的音频
     */
    playGetStarAudio() {
        console.log("开始播放获取星星的音频");
        this.getStarAudio.play();
    }

    /**
     * @description: 播放触碰炸弹的音频
     */
    playTouchBombAudio() {
        console.log("开始播放触碰炸弹的音频");
        this.touchBombAudio.play();
    }

    /**
     * @description: 暂停背景音乐
     */
    pauseBGM() {
        if (this.bgm && this.bgm.isPlaying) {
            console.log("暂停播放背景音乐");
            this.bgm.pause();
        }
    }

    /**
     * @description: 恢复背景音乐
     */
    resumeBGM() {
        if (this.bgm && this.bgm.isPaused) {
            console.log("恢复播放背景音乐");
            this.bgm.resume();
        }
    }

    /**
     * @description: 设置音量
     * @param {Number} volume 音量值 (0-1)
     */
    setVolume(volume) {
        if (this.bgm) {
            this.bgm.setVolume(Math.max(0, Math.min(1, volume)));
        }
    }

    /**
     * @description: 销毁场景时清理资源
     */
    destroy() {
        console.log("AudioScene正在销毁");

        // 移除EventBus事件监听
        EventBus.off(AUDIO_EVENTS.BGM_PLAY, this.playBGM, this);
        EventBus.off(AUDIO_EVENTS.BGM_STOP, this.stopBGM, this);
        EventBus.off(AUDIO_EVENTS.BGM_PAUSE, this.pauseBGM, this);
        EventBus.off(AUDIO_EVENTS.BGM_RESUME, this.resumeBGM, this);
        EventBus.off(AUDIO_EVENTS.BGM_SET_VOLUME, this.setVolume, this);

        // 停止并销毁音频
        this.sound.removeAll();
    }
}

