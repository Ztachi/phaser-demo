/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-10-12 11:30:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-10-12 11:30:00
 * @FilePath: /my-phaser-game/src/const/mapLayouts.js
 * @Description: 地图静态布局数据配置
 */

/**
 * @description: 默认地图布局 - 关键平台配置（手动设定的路径，确保间距合理且能跳上去）
 * 注意：MAX_VERTICAL_GAP = 160px, MAX_HORIZONTAL_GAP = 280px，平台宽度 = 400px
 * 可达距离：水平约 200 + 280 = 480px（考虑平台半宽），垂直最多160px
 */
export const DEFAULT_MAP_LAYOUT = [
    // 起始区域 - 从地面(984)逐步向上
    { x: 250, y: 850 },    // 从地面可跳（向上134px）
    { x: 650, y: 720 },    // 从x:250可跳（dx:400, dy:-130向下）
    
    // 中间区域 - 横向扩展，适度起伏
    { x: 1050, y: 800 },   // 从x:650可跳（dx:400, dy:80向上）
    { x: 1450, y: 680 },   // 从x:1050可跳（dx:400, dy:-120向下）
    { x: 1850, y: 780 },   // 从x:1450可跳（dx:400, dy:100向上）
    { x: 2250, y: 670 },   // 从x:1850可跳（dx:400, dy:-110向下）
    
    // 远端区域 - 继续起伏
    { x: 2650, y: 760 },   // 从x:2250可跳（dx:400, dy:90向上）
    { x: 3000, y: 850 }    // 从x:2650可跳（dx:350, dy:90向上）
];

/**
 * @description: 进阶地图布局 - 更复杂的平台配置（预留，可扩展）
 */
export const ADVANCED_MAP_LAYOUT = [
    // 起始区域 - 更密集的平台
    { x: 150, y: 1450 },
    { x: 350, y: 1350 },
    { x: 550, y: 1250 },
    { x: 750, y: 1150 },
    
    // 中间区域 - 挑战性布局
    { x: 950, y: 1350 },
    { x: 1200, y: 1200 },
    { x: 1450, y: 1050 },
    { x: 1700, y: 1250 },
    { x: 1950, y: 1100 },
    { x: 2200, y: 1300 },
    
    // 远端区域 - 高难度区域
    { x: 2450, y: 1150 },
    { x: 2700, y: 1000 },
    { x: 2950, y: 1200 }
];

/**
 * @description: 简易地图布局 - 适合新手（预留，可扩展）
 */
export const EASY_MAP_LAYOUT = [
    // 起始区域
    { x: 250, y: 1450 },
    { x: 500, y: 1350 },
    { x: 750, y: 1350 },
    
    // 中间区域
    { x: 1000, y: 1350 },
    { x: 1300, y: 1300 },
    { x: 1600, y: 1400 },
    { x: 1900, y: 1350 },
    { x: 2200, y: 1300 },
    
    // 远端区域
    { x: 2500, y: 1350 },
    { x: 2800, y: 1350 },
    { x: 3100, y: 1400 }
];

/**
 * @description: 获取指定类型的地图布局
 * @param {string} layoutType 布局类型：'default' | 'advanced' | 'easy'
 * @return {Array} 地图布局数据
 */
export function getMapLayout(layoutType = 'default') {
    switch (layoutType) {
        case 'advanced':
            return ADVANCED_MAP_LAYOUT;
        case 'easy':
            return EASY_MAP_LAYOUT;
        case 'default':
        default:
            return DEFAULT_MAP_LAYOUT;
    }
}

