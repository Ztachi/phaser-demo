/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-10-12 00:00:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-10-22 11:35:37
 * @FilePath: /my-phaser-game/src/game/scenes/game/MapGenerator.js
 * @Description: 地图生成器 - 负责程序化生成游戏地图、平台和星星位置
 */

import Phaser from "phaser";
import { MAP_CONFIG, STAR_CONFIG } from "@/const/mapConfig";
import { getMapLayout } from "@/const/mapLayouts";

export class MapGenerator {
    /**
     * @description: 构造函数
     * @param {string} layoutType 地图布局类型：'default' | 'advanced' | 'easy'
     */
    constructor(layoutType = 'default') {
        this.platforms = [];
        this.stars = [];
        this.layoutType = layoutType;
        this.keyPlatforms = getMapLayout(layoutType);
    }

    /**
     * @description: 生成完整地图数据
     * @return {Object} 地图数据 {platforms, stars, worldBounds}
     */
    generate() {
        // 重置数据
        this.platforms = [];
        this.stars = [];

        // 生成平台
        this._generatePlatforms();

        // 生成星星
        this._generateStars();

        return {
            platforms: this.platforms,
            stars: this.stars,
            worldBounds: {
                width: MAP_CONFIG.WORLD_WIDTH,
                height: MAP_CONFIG.WORLD_HEIGHT
            }
        };
    }

    /**
     * @description: 生成平台（混合模式：关键平台 + 随机填充）
     * @private
     */
    _generatePlatforms() {
        // 生成地面平台（整个底部）
        const groundPlatformCount = Math.ceil(MAP_CONFIG.WORLD_WIDTH / MAP_CONFIG.PLATFORM_WIDTH);
        for (let i = 0; i < groundPlatformCount; i++) {
            this.platforms.push({
                x: i * MAP_CONFIG.PLATFORM_WIDTH + MAP_CONFIG.PLATFORM_WIDTH / 2,
                y: MAP_CONFIG.GROUND_Y,
                scale: 1,
                texture: "ground"
            });
        }

        // 添加关键平台（手动设定的路径）
        this.keyPlatforms.forEach(keyPlatform => {
            this.platforms.push({
                x: keyPlatform.x,
                y: keyPlatform.y,
                scale: 1,
                texture: "ground"
            });
        });

        // 在关键平台之间填充随机平台
        this._fillRandomPlatforms();
    }

    /**
     * @description: 在关键平台之间填充随机平台
     * @private
     */
    _fillRandomPlatforms() {
        let generatedCount = 0;
        let retryCount = 0;
        const maxRetries = MAP_CONFIG.FILL_PLATFORM_COUNT * 10; // 增加重试次数，因为可达性检查更严格
        
        while (generatedCount < MAP_CONFIG.FILL_PLATFORM_COUNT && retryCount < maxRetries) {
            // 在整个世界范围内随机生成位置
            const x = Phaser.Math.Between(200, MAP_CONFIG.WORLD_WIDTH - 200);
            
            // 调整Y坐标生成范围：使用多层策略，避免生成太高的平台
            // 80%的平台生成在较低位置（易达），20%生成在较高位置（挑战）
            let y;
            if (Math.random() < 0.8) {
                // 较低层：从地面往上最多3个跳跃高度
                y = Phaser.Math.Between(
                    MAP_CONFIG.GROUND_Y - MAP_CONFIG.MAX_VERTICAL_GAP * 3,
                    MAP_CONFIG.GROUND_Y - MAP_CONFIG.MIN_VERTICAL_GAP
                );
            } else {
                // 较高层：从地面往上3-4个跳跃高度
                y = Phaser.Math.Between(
                    MAP_CONFIG.GROUND_Y - MAP_CONFIG.MAX_VERTICAL_GAP * 4,
                    MAP_CONFIG.GROUND_Y - MAP_CONFIG.MAX_VERTICAL_GAP * 3
                );
            }
            
            // 严格检查间距和可达性
            if (this._isValidPlatformPosition(x, y)) {
                this.platforms.push({
                    x,
                    y,
                    scale: 1,
                    texture: "ground"
                });
                generatedCount++;
            }
            
            retryCount++;
        }
    }

    /**
     * @description: 验证平台位置是否合理（检查间距和可达性）
     * @param {number} x X坐标
     * @param {number} y Y坐标
     * @return {boolean} 位置是否有效
     * @private
     */
    _isValidPlatformPosition(x, y) {
        // 平台宽度的一半
        const platformHalfWidth = MAP_CONFIG.PLATFORM_WIDTH / 2;
        
        let hasReachablePlatform = false; // 是否至少有一个平台可以跳跃到这里
        
        // 遍历所有现有平台进行检查
        for (const platform of this.platforms) {
            const dx = Math.abs(platform.x - x);
            const dy = y - platform.y; // 注意：正值表示新平台在上方
            const dyAbs = Math.abs(dy);
            
            // === 规则1：防止平台重叠和过近 ===
            
            // 跳过地面平台的重叠检查（但地面平台可以作为可达起点）
            const isGroundPlatform = platform.y >= MAP_CONFIG.GROUND_Y - 50;
            
            if (!isGroundPlatform) {
                // X轴考虑平台宽度，避免重叠
                if (dx < platformHalfWidth * 2 + 100) { // 至少500的距离
                    // X轴距离不够，Y轴必须足够大（但不能太大）
                    if (dyAbs < MAP_CONFIG.MIN_VERTICAL_GAP) {
                        return false;
                    }
                }
                
                // 如果Y轴距离很小（在相近高度），X轴必须很大
                if (dyAbs < 80) {
                    if (dx < MAP_CONFIG.MIN_HORIZONTAL_SPACING) {
                        return false;
                    }
                }
            }
            
            // === 规则2：可达性检查 ===
            
            // 检查当前平台是否可以跳跃到新平台
            // dy > 0: 新平台在上方（向上跳）
            // dy < 0: 新平台在下方（向下跳）
            // dy = 0: 新平台同高度（平跳）
            
            // 水平距离检查：考虑平台宽度
            const maxReachDistance = platformHalfWidth * 2 + MAP_CONFIG.MAX_HORIZONTAL_GAP;
            
            if (dx <= maxReachDistance) {
                // 向上跳：垂直距离不能超过二段跳高度
                if (dy >= 0 && dy <= MAP_CONFIG.MAX_VERTICAL_GAP) {
                    hasReachablePlatform = true;
                }
                // 向下跳或平跳：更宽松，只要水平距离够近即可（允许向下200px）
                else if (dy < 0 && dy >= -200) {
                    hasReachablePlatform = true;
                }
            }
        }
        
        // 新平台必须至少有一个现有平台可以跳跃到达
        return hasReachablePlatform;
    }

    /**
     * @description: 生成星星位置
     * @private
     */
    _generateStars() {
        // 随机确定星星总数
        const totalStarCount = Phaser.Math.Between(
            STAR_CONFIG.MIN_TOTAL_STARS, 
            STAR_CONFIG.MAX_TOTAL_STARS
        );
        
        // 获取所有悬浮平台（排除地面）
        const floatingPlatforms = this.platforms.filter(p => 
            p.y < MAP_CONFIG.GROUND_Y - 100
        );

        // 根据配置的比例确定平台附近和随机位置的星星数量
        const platformStarCount = Math.floor(totalStarCount * STAR_CONFIG.PLATFORM_STAR_RATIO);
        const randomStarCount = totalStarCount - platformStarCount;

        // 在平台附近生成星星
        let generatedPlatform = 0;
        let retryCount = 0;
        const maxRetries = platformStarCount * 5;
        
        while (generatedPlatform < platformStarCount && retryCount < maxRetries && floatingPlatforms.length > 0) {
            const platform = Phaser.Utils.Array.GetRandom(floatingPlatforms);
            
            // 在平台上方指定范围的位置
            const x = platform.x + Phaser.Math.Between(-100, 100);
            const y = platform.y - Phaser.Math.Between(
                STAR_CONFIG.STAR_ABOVE_PLATFORM_MIN, 
                STAR_CONFIG.STAR_ABOVE_PLATFORM_MAX
            );
            
            // 严格检查X轴不重叠
            if (!this._isStarPositionInvalid(x, y)) {
                this.stars.push({ x, y });
                generatedPlatform++;
            }
            retryCount++;
        }

        // 随机生成星星
        retryCount = 0;
        let generatedRandom = 0;
        const maxRandomRetries = randomStarCount * 5;
        
        while (generatedRandom < randomStarCount && retryCount < maxRandomRetries) {
            const x = Phaser.Math.Between(100, MAP_CONFIG.WORLD_WIDTH - 100);
            const y = Phaser.Math.Between(
                MAP_CONFIG.GROUND_Y - 500,
                MAP_CONFIG.GROUND_Y - 150
            );
            
            // 严格检查X轴不重叠
            if (!this._isStarPositionInvalid(x, y)) {
                this.stars.push({ x, y });
                generatedRandom++;
            }
            retryCount++;
        }
    }

    /**
     * @description: 检查星星位置是否无效（X轴重叠或Y轴过近）
     * @param {number} x X坐标
     * @param {number} y Y坐标
     * @return {boolean} 位置是否无效
     * @private
     */
    _isStarPositionInvalid(x, y) {
        return this.stars.some(star => {
            const dx = Math.abs(star.x - x);
            const dy = Math.abs(star.y - y);
            
            // X轴距离必须足够大，避免重叠
            if (dx < STAR_CONFIG.STAR_MIN_DISTANCE_X) {
                return true;
            }
            
            // Y轴距离也需要保持一定间距
            if (dy < STAR_CONFIG.STAR_MIN_DISTANCE_Y && dx < STAR_CONFIG.STAR_MIN_DISTANCE_X * 2) {
                return true;
            }
            
            return false;
        });
    }

    /**
     * @description: 重新生成星星（用于新一轮游戏）
     * @return {Array} 新的星星位置数组
     */
    regenerateStars() {
        // 清空当前星星数组
        this.stars = [];
        
        // 重新生成星星
        this._generateStars();
        
        // 返回新的星星数组
        return this.stars;
    }

    /**
     * @description: 获取世界边界
     * @return {Object} 世界边界 {width, height}
     */
    getWorldBounds() {
        return {
            width: MAP_CONFIG.WORLD_WIDTH,
            height: MAP_CONFIG.WORLD_HEIGHT
        };
    }
}

