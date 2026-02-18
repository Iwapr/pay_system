/**
 * @file index.js
 * @description 小票打印机设备操作类，提供收银小票打印的静态方法（当前为 console 模拟实现）。
 * @module device/pos_print
 */
export { PosPrintConfig } from "./config";

export class PosPrint {

    static async print(data) {
        console.log("[设备]小票打印机: ", data);
    }
}