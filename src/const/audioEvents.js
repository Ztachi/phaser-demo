/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 09:30:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 09:57:25
 * @FilePath: /my-phaser-game/src/const/audioEvents.js
 * @Description: 音频事件常量管理 - 统一管理所有音频相关的事件名称
 */

/**
 * @description: 音频控制事件常量
 */
export const AUDIO_EVENTS = {
    // 背景音乐控制
    BGM_PLAY: 'audio:bgm:play',
    BGM_STOP: 'audio:bgm:stop', 
    BGM_PAUSE: 'audio:bgm:pause',
    BGM_RESUME: 'audio:bgm:resume',
    
    // 音量控制
    BGM_SET_VOLUME: 'audio:bgm:setVolume',
    
    // 场景音频控制
    SCENE_AUDIO_INIT: 'audio:scene:init',
    SCENE_AUDIO_ENTER: 'audio:scene:enter',
    SCENE_AUDIO_EXIT: 'audio:scene:exit',
    
    // 音效控制
    SFX_PLAY: 'audio:sfx:play',
    SFX_STOP: 'audio:sfx:stop',

    // 获取星星
    GET_STAR: 'audio:getStar',
    // 触碰炸弹
    TOUCH_BOMB: 'audio:touchBomb',
};

/**
 * @description: 音频资源常量
 */
export const AUDIO_ASSETS = {
    // 背景音乐
    BGM: 'bgm',
    // 获取星星
    GET_STAR: 'getStar',
    // 触碰炸弹
    TOUCH_BOMB: 'touchBomb',
    // 可以在这里添加更多音频资源ID
};

/**
 * @description: 音频配置常量
 */
export const AUDIO_CONFIG = {
    // 默认音量
    DEFAULT_BGM_VOLUME: 0.5,
    DEFAULT_SFX_VOLUME: 0.7,
    
    // 音频循环设置
    BGM_LOOP: true,
    SFX_LOOP: false,
};
