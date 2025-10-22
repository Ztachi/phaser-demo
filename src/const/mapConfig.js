/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-10-12 11:30:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-10-22 11:40:53
 * @FilePath: /my-phaser-game/src/const/mapConfig.js
 * @Description: 地图生成配置常量
 */

/**
 * @description: 地图配置常量
 */
export const MAP_CONFIG = {
    // 世界大小
    WORLD_WIDTH: 3200,
    WORLD_HEIGHT: 1000, // 进一步缩减高度，确保能看到顶部
    
    // 玩家能力参数（基于PlayerManager的配置）
    PLAYER_JUMP_POWER: 430, // 跳跃力度
    PLAYER_GRAVITY: 700, // 重力
    PLAYER_MOVE_SPEED: 160, // 移动速度
    PLAYER_HEIGHT: 60, // 角色高度（估算）
    
    // 平台生成参数
    PLATFORM_WIDTH: 400, // 平台默认宽度
    PLATFORM_HEIGHT: 32, // 平台高度
    GROUND_Y: 984, // 地面Y坐标（世界高度 - 16，让平台底部贴近边界）
    
    // 安全距离（确保可达性）
    MAX_VERTICAL_GAP: 160, // 最大垂直间距（二段跳能达到的高度）
    MIN_VERTICAL_GAP: 100, // 最小垂直间距（确保角色能跳上去，不能太大）
    MAX_HORIZONTAL_GAP: 280, // 最大水平间距
    MIN_HORIZONTAL_SPACING: 450, // 最小水平间距（避免平台横向重叠，考虑平台宽度400）
    
    // 填充平台配置
    FILL_PLATFORM_COUNT: 15 // 在关键平台之间填充的随机平台数量（减少以满足更严格的间距要求）
};

/**
 * @description: 星星配置常量
 */
export const STAR_CONFIG = {
    // 星星总数范围（随机）
    MIN_TOTAL_STARS: 15,
    MAX_TOTAL_STARS: 34,
    
    // 星星生成位置配置
    PLATFORM_STAR_RATIO: 0.8, // 80%的星星生成在平台附近
    STAR_ABOVE_PLATFORM_MIN: 30, // 星星在平台上方最小距离
    STAR_ABOVE_PLATFORM_MAX: 100, // 星星在平台上方最大距离
    STAR_MIN_DISTANCE_X: 120, // 星星X轴之间最小距离（避免X轴重叠）
    STAR_MIN_DISTANCE_Y: 60, // 星星Y轴之间最小距离
    
    // 星星穿透平台概率配置
    BOUNCE_STOP_PROBABILITY: 0.5, // 星星碰到平台停止的概率（50%）
    GROUND_STOP_PROBABILITY: 1.0 // 地面平台停止概率（100%，避免掉出游戏区域）
};

