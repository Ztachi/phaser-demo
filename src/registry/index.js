/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 10:15:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:15:00
 * @FilePath: /my-phaser-game/src/registry/index.js
 * @Description: 注册表系统统一导出文件
 */

// 导出注册表管理器
export { registryManager, RegistryManager } from './registryManager';

// 导出游戏状态注册表
export { gameRegistry, GameRegistry } from './gameRegistry';

// 便捷方法：获取游戏注册表
export const getGameRegistry = () => gameRegistry;

// 便捷方法：获取注册表管理器
export const getRegistryManager = () => registryManager;
