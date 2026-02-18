/**
 * @file config.js
 * @description 小票打印机配置管理类，使用 localStorage 持久化存储选定打印机的名称。
 * @module device/pos_print/config
 */
const GLOBAL_KEY = "GLOBAL_POS_PRINT_NAME";

export class PosPrintConfig {
    static getPosPrintName() {
        return localStorage.getItem(GLOBAL_KEY);
    }

    static setPosPrintName(name) {
        localStorage.setItem(GLOBAL_KEY, name);
    }
}