/**
 * @file index.js
 * @description 钱箱设备操作类，提供打开钱箱的静态方法（当前为 console 模拟实现）。
 * @module device/money_box
 */
export { MoneyBoxConfig } from "./config";

export class MoneyBox {
    static async open() {
        console.log("钱箱已打开!");
    }
}