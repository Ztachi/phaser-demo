/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-25 14:40:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-26 11:46:41
 * @FilePath: /my-phaser-game/src/game/scenes/game/InputController.js
 * @Description: 输入控制器 - 负责处理键盘输入和玩家控制逻辑
 */

export class InputController {
    /**
     * @description: 构造函数
     * @param {Phaser.Scene} scene 游戏场景实例
     * @param {PlayerManager} playerManager 玩家管理器实例
     */
    constructor(scene, playerManager) {
        this.scene = scene;
        this.playerManager = playerManager;
        this.cursors = null;

        // 上一帧的按键状态，用于检测按键释放
        this.previousUpKeyState = false;
    }

    /**
     * @description: 初始化键盘控制
     * @return {Phaser.Types.Input.Keyboard.CursorKeys} 光标键对象
     */
    create() {
        // 创建光标键
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        return this.cursors;
    }

    /**
     * @description: 更新输入处理(每帧调用)
     */
    update() {
        if (!this.cursors || !this.playerManager) {
            return;
        }

        // 处理水平移动
        this._handleHorizontalMovement();

        // 处理跳跃
        this._handleJumpInput();
    }

    /**
     * @description: 处理水平移动输入
     * @private
     */
    _handleHorizontalMovement() {
        if (this.cursors.left.isDown) {
            // 向左移动
            this.playerManager.moveLeft();
        } else if (this.cursors.right.isDown) {
            // 向右移动
            this.playerManager.moveRight();
        } else {
            // 停止移动
            this.playerManager.stopMoving();
        }
        //假设从平台边缘掉落，则视为一段跳已经起跳
        // 检测是否从平台掉落：玩家在空中且垂直速度为正(向下)且不是触地状态
        if (
            this.playerManager.getPlayer().body.velocity.y > 0 &&
            !this.playerManager.getPlayer().body.touching.down &&
            !this.playerManager.isJump
        ) {
            console.log(
                "从平台掉落，视为一段跳",
                this.playerManager.getPlayer().body.velocity.y
            );
            this.playerManager.isJump = true;
            this.playerManager.canDoubleJump = true;
            this.playerManager.isDoubleJump = true;
        }
    }

    /**
     * @description: 处理跳跃输入
     * @private
     */
    _handleJumpInput() {
        const currentUpKeyState = this.cursors.up.isDown;
        const isUpKeyReleased = this.previousUpKeyState && !currentUpKeyState;

        // 更新玩家跳跃状态
        this.playerManager.updateJumpState(currentUpKeyState, isUpKeyReleased);

        // 记录当前帧的按键状态
        this.previousUpKeyState = currentUpKeyState;
    }

    /**
     * @description: 检查特定按键是否按下
     * @param {string} keyName 按键名称 ('left', 'right', 'up', 'down')
     * @return {boolean} 按键是否按下
     */
    isKeyDown(keyName) {
        return this.cursors?.[keyName]?.isDown || false;
    }

    /**
     * @description: 检查特定按键是否释放
     * @param {string} keyName 按键名称 ('left', 'right', 'up', 'down')
     * @return {boolean} 按键是否释放
     */
    isKeyUp(keyName) {
        return this.cursors?.[keyName]?.isUp || false;
    }

    /**
     * @description: 获取光标键对象
     * @return {Phaser.Types.Input.Keyboard.CursorKeys} 光标键对象
     */
    getCursors() {
        return this.cursors;
    }

    /**
     * @description: 销毁输入控制器
     */
    destroy() {
        this.cursors = null;
        this.playerManager = null;
        this.previousUpKeyState = false;
    }
}

