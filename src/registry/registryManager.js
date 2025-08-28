/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-28 10:05:00
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-28 10:05:00
 * @FilePath: /my-phaser-game/src/registry/registryManager.js
 * @Description: 注册表管理器 - 统一的状态管理系统，替代Pinia
 */

/**
 * @description: 注册表管理器类 - 单例模式
 */
class RegistryManager {
    constructor() {
        // 单例模式确保只有一个实例
        if (RegistryManager.instance) {
            return RegistryManager.instance;
        }
        
        // 存储所有注册表
        this.registries = new Map();
        // 事件监听器
        this.listeners = new Map();
        
        RegistryManager.instance = this;
    }

    /**
     * @description: 注册一个新的注册表
     * @param {String} name 注册表名称
     * @param {Object} registry 注册表对象
     * @return {Object} 注册表对象
     */
    register(name, registry) {
        if (this.registries.has(name)) {
            console.warn(`注册表 ${name} 已存在，将被覆盖`);
        }
        
        this.registries.set(name, registry);
        console.log(`注册表 ${name} 注册成功`);
        
        return registry;
    }

    /**
     * @description: 获取指定的注册表
     * @param {String} name 注册表名称
     * @return {Object|null} 注册表对象
     */
    get(name) {
        if (!this.registries.has(name)) {
            console.error(`注册表 ${name} 不存在`);
            return null;
        }
        
        return this.registries.get(name);
    }

    /**
     * @description: 移除指定的注册表
     * @param {String} name 注册表名称
     * @return {Boolean} 是否移除成功
     */
    unregister(name) {
        if (!this.registries.has(name)) {
            console.warn(`注册表 ${name} 不存在，无法移除`);
            return false;
        }
        
        this.registries.delete(name);
        console.log(`注册表 ${name} 已移除`);
        
        return true;
    }

    /**
     * @description: 监听注册表状态变化
     * @param {String} registryName 注册表名称
     * @param {String} key 监听的状态键
     * @param {Function} callback 回调函数
     * @return {Function} 取消监听的函数
     */
    watch(registryName, key, callback) {
        const listenerId = `${registryName}.${key}.${Date.now()}`;
        
        if (!this.listeners.has(registryName)) {
            this.listeners.set(registryName, new Map());
        }
        
        if (!this.listeners.get(registryName).has(key)) {
            this.listeners.get(registryName).set(key, new Map());
        }
        
        this.listeners.get(registryName).get(key).set(listenerId, callback);
        
        // 返回取消监听的函数
        return () => {
            if (this.listeners.has(registryName) && 
                this.listeners.get(registryName).has(key)) {
                this.listeners.get(registryName).get(key).delete(listenerId);
            }
        };
    }

    /**
     * @description: 触发状态变化事件
     * @param {String} registryName 注册表名称
     * @param {String} key 状态键
     * @param {*} newValue 新值
     * @param {*} oldValue 旧值
     */
    emit(registryName, key, newValue, oldValue) {
        if (!this.listeners.has(registryName) || 
            !this.listeners.get(registryName).has(key)) {
            return;
        }
        
        const callbacks = this.listeners.get(registryName).get(key);
        callbacks.forEach((callback) => {
            try {
                callback(newValue, oldValue);
            } catch (error) {
                console.error(`监听器回调执行错误:`, error);
            }
        });
    }

    /**
     * @description: 获取所有已注册的注册表名称
     * @return {Array} 注册表名称列表
     */
    getRegistryNames() {
        return Array.from(this.registries.keys());
    }

    /**
     * @description: 清空所有注册表
     */
    clear() {
        this.registries.clear();
        this.listeners.clear();
        console.log('所有注册表已清空');
    }

    /**
     * @description: 获取注册表管理器状态
     * @return {Object} 状态信息
     */
    getStatus() {
        return {
            registryCount: this.registries.size,
            registryNames: this.getRegistryNames(),
            listenersCount: Array.from(this.listeners.values())
                .reduce((total, registry) => {
                    return total + Array.from(registry.values())
                        .reduce((regTotal, keyListeners) => regTotal + keyListeners.size, 0);
                }, 0)
        };
    }
}

// 创建并导出单例实例
export const registryManager = new RegistryManager();

// 导出类用于类型检查或测试
export { RegistryManager };
