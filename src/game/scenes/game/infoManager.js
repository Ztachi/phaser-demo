/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-26 10:37:25
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:50:00
 * @FilePath: /my-phaser-game/src/game/scenes/game/infoManager.js
 * @Description: 信息管理器 - 负责游戏内UI显示，使用Phaser官方Data Manager
 */

import { 
    initializeGameData, 
    addScore, 
    getFormattedScore, 
    resetGameData,
    GAME_DATA_DEFAULTS 
} from "@/register";

export class InfoManager {
    // 场景引用
    scene;
    // 分数文本对象
    scoreText;
    // 剩余星星数量文本对象
    remainingStarsText;
    // 箭头指示器
    starArrow;
    // 箭头容器（用于定位）
    arrowContainer;
    // 总星星数量
    totalStars = 0;

    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     */
    constructor(scene) {
        this.scene = scene;
        // 初始化游戏数据到registry（全局数据管理器）
        initializeGameData(this.scene.registry);
    }

    /**
     * @description: 创建UI元素
     * @param {number} totalStars 总星星数量
     */
    create(totalStars = 0) {
        this.totalStars = totalStars;
        
        // 创建分数文本
        this.scoreText = this.scene.add.text(
            16,
            16,
            getFormattedScore(this.scene.registry),
            {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "Arial",
            }
        );
        // 固定UI在相机视口，不随世界滚动
        this.scoreText.setScrollFactor(0);
        // 确保UI在最上层显示
        this.scoreText.setDepth(100);

        // 创建剩余星星数量文本
        this.remainingStarsText = this.scene.add.text(
            16,
            56,
            `剩余星星: ${this.totalStars}`,
            {
                fontSize: "24px",
                fill: "#ffff00",
                fontFamily: "Arial",
            }
        );
        // 固定UI在相机视口，不随世界滚动
        this.remainingStarsText.setScrollFactor(0);
        // 确保UI在最上层显示
        this.remainingStarsText.setDepth(100);

        // 创建指向最近星星的箭头指示器（右上角）
        this._createStarArrow();

        // 设置游戏状态为正在游戏
        this.scene.registry.set('gameState', GAME_DATA_DEFAULTS.GAME_STATE_PLAYING);

        // 初始更新显示
        this.updateDisplay();
    }
    
    /**
     * @description: 创建星星方向指示箭头（等腰三角形）
     * @private
     */
    _createStarArrow() {
        // 创建一个容器放置在右上角
        this.arrowContainer = this.scene.add.container(740, 50);
        this.arrowContainer.setScrollFactor(0);
        this.arrowContainer.setDepth(100);
        
        // 创建箭头图形（使用等腰三角形，尖端明显）
        const graphics = this.scene.add.graphics();
        
        // 纹理尺寸
        const textureSize = 80;
        const center = textureSize / 2; // 中心点坐标40
        
        // 等腰三角形尺寸（长尖端，窄底边）
        const baseWidth = 18;      // 底边半宽（更窄）
        const tipLength = 40;      // 从中心到尖端的长度（更长）
        const backLength = 18;     // 从中心到底边的长度
        
        // 填充等腰三角形
        graphics.fillStyle(0xffff00, 1);
        graphics.beginPath();
        graphics.moveTo(center + tipLength, center);           // 右侧尖端
        graphics.lineTo(center - backLength, center - baseWidth); // 左上角
        graphics.lineTo(center - backLength, center + baseWidth); // 左下角
        graphics.closePath();
        graphics.fillPath();
        
        // 添加黑色描边
        graphics.lineStyle(3, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(center + tipLength, center);
        graphics.lineTo(center - backLength, center - baseWidth);
        graphics.lineTo(center - backLength, center + baseWidth);
        graphics.closePath();
        graphics.strokePath();
        
        // 生成纹理
        graphics.generateTexture('star-arrow', textureSize, textureSize);
        graphics.destroy();
        
        // 创建图像并设置旋转中心为纹理中心
        this.starArrow = this.scene.add.image(0, 0, 'star-arrow');
        this.starArrow.setOrigin(0.5, 0.5); // 设置原点为中心，这样旋转就围绕中心进行
        this.arrowContainer.add(this.starArrow);
        
        // 初始化当前旋转角度，用于平滑过渡
        this.currentArrowRotation = 0;
    }
    
    /**
     * @description: 更新箭头指向最近的星星
     * @param {Object} playerPosition 玩家位置 {x, y}
     * @param {Array} activeStars 活跃的星星数组
     */
    updateStarArrow(playerPosition, activeStars) {
        if (!this.starArrow || !activeStars || activeStars.length === 0) {
            // 没有星星时隐藏箭头
            if (this.arrowContainer) {
                this.arrowContainer.setVisible(false);
            }
            return;
        }
        
        // 显示箭头
        this.arrowContainer.setVisible(true);
        
        // 找到最近的星星
        let nearestStar = null;
        let minDistance = Infinity;
        
        activeStars.forEach(star => {
            const dx = star.x - playerPosition.x;
            const dy = star.y - playerPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestStar = star;
            }
        });
        
        if (nearestStar) {
            // 计算相对位置
            let dx = nearestStar.x - playerPosition.x;
            let dy = nearestStar.y - playerPosition.y;
            
            // 如果Y轴距离很小（在同一平台附近），强制Y为0，只显示水平方向
            if (Math.abs(dy) < 80) {
                dy = 0;
            }
            
            // 计算箭头应该指向的目标角度（弧度）
            const targetAngle = Math.atan2(dy, dx);
            
            // 使用平滑插值过渡到目标角度
            // 计算最短路径的角度差（处理 -π 到 π 的循环）
            let angleDiff = targetAngle - this.currentArrowRotation;
            
            // 归一化角度差到 [-π, π] 区间，确保选择最短路径旋转
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // 使用快速插值（0.3 = 30%的插值速度，旋转速度较快但不突兀）
            this.currentArrowRotation += angleDiff * 0.3;
            
            // 归一化当前角度到 [-π, π] 区间
            while (this.currentArrowRotation > Math.PI) this.currentArrowRotation -= Math.PI * 2;
            while (this.currentArrowRotation < -Math.PI) this.currentArrowRotation += Math.PI * 2;
            
            // 设置箭头旋转角度
            this.starArrow.setRotation(this.currentArrowRotation);
        }
    }

    /**
     * @description: 增加分数
     * @param {Number} points 增加的分数
     */
    addScore(points = GAME_DATA_DEFAULTS.POINTS_PER_STAR) {
        // 使用统一的增加分数函数
        addScore(this.scene.registry, points);
        // 直接更新UI显示
        this.updateDisplay();
    }

    /**
     * @description: 更新UI显示
     * @param {number} remainingStars 剩余星星数量（可选）
     */
    updateDisplay(remainingStars) {
        // 更新分数显示
        this.scoreText?.setText(getFormattedScore(this.scene.registry));

        // 更新剩余星星数量显示
        if (remainingStars !== undefined) {
            this.remainingStarsText?.setText(`剩余星星: ${remainingStars}`);
        }
    }
    
    /**
     * @description: 更新剩余星星数量
     * @param {number} count 剩余星星数量
     */
    updateRemainingStars(count) {
        this.remainingStarsText?.setText(`剩余星星: ${count}`);
    }

    /**
     * @description: 重置分数
     */
    resetScore() {
        // 使用统一的重置函数
        resetGameData(this.scene.registry);
        // 直接更新UI显示
        this.updateDisplay();
    }

    /**
     * @description: 获取当前分数
     * @return {Number} 当前分数
     */
    getCurrentScore() {
        return this.scene.registry.get('score');
    }

    /**
     * @description: 获取当前等级
     * @return {Number} 当前等级
     */
    getCurrentLevel() {
        return this.scene.registry.get('level');
    }

    /**
     * @description: 销毁信息管理器
     */
    destroy() {
        // 销毁UI元素
        this.scoreText?.destroy();
        this.remainingStarsText?.destroy();
        this.arrowContainer?.destroy();
        this.scoreText = null;
        this.remainingStarsText = null;
        this.starArrow = null;
        this.arrowContainer = null;
        this.scene = null;
    }
}
