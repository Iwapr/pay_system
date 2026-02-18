/**
 * @file config.js
 * @description 客显（顾客显示屏）设备配置管理类，使用 localStorage 持久化存储设备连接配置信息。
 * @module device/client_display/config
 */
const keys = "GLOBAL_CLIENT_DISPLAY_CONFIG";

export class ClientDisplayConfig {
    static getConfig() {
        const value = localStorage.getItem(keys);
        try {
            return JSON.parse(value);
        } catch (error) {
            return undefined;
        }
    }

    static setConfig(config) {
        localStorage.setItem(keys, JSON.stringify(config));
    }
}