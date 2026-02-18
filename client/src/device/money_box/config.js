/**
 * @file config.js
 * @description 钱箱设备配置管理类，使用 localStorage 持久化存储钱箱连接状态与配置信息。
 * @module device/money_box/config
 */
const keys = "GLOBAL_MONEY_BOX_STATUS";

export class MoneyBoxConfig {
    static setConfig(config) {
        localStorage.setItem(keys, JSON.stringify(config));
    }

    static getConfig() {
        const value = localStorage.getItem(keys);
        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    }
}