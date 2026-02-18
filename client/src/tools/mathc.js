/**
 * client/src/tools/mathc.js - 前端高精度数操工具
 *
 * 基于 mathjs 的 BigNumber 进行精确四则运算，避免 JavaScript 原生浮点失精。
 * 示例：0.1 + 0.2 在浮点数计算中为 0.30000000000000004，使用此工具则得 0.3。
 *
 * 包含 formatRate 方法，可将小数转化为百分比显示字符串。
 */
import * as math from "mathjs";

export const mathc = {
    /**
     * 列表求和
     * @param {number[]} list
     * @returns {number}
     */
    addList: (list) => {
        return math.number(list.reduce((a, b) => math.add(math.bignumber(a), math.bignumber(b)), 0));
    },
    /**
     * 加法 a + b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    add: (a, b) => {
        return math.number(math.add(math.bignumber(a), math.bignumber(b)));
    },
    /**
     * 减法 a - b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    subtract: (a, b) => {
        return math.number(math.subtract(math.bignumber(a), math.bignumber(b)));
    },
    /**
     * 乘法 a * b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    multiply: (a, b) => {
        return math.number(math.multiply(math.bignumber(a), math.bignumber(b)));
    },
    /**
     * 除法 a / b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    divide: (a, b) => {
        return math.number(math.divide(math.bignumber(a), math.bignumber(b)));
    },
    /**
     * 四舍五入
     * @param {number} a   - 要舍入的数
     * @param {number} bit - 保留小数位数，默认 2
     * @returns {number}
     */
    round: (a, bit = 2) => {
        return math.round(a, bit);
    },
    /**
     * 绝对值
     * @param {number} n
     * @returns {number}
     */
    abs: (n) => math.abs(n),
    /**
     * 将小数转为百分比显示字符串
     * 示例：0.085 → "8.5%"、0.1 → "10%"
     *
     * @param {number} num - 小数形式的比例（如 0.085 表示 8.5%）
     * @param {number} bit - 小数保留位数，默认 2
     * @returns {string} 如 "8.50%"
     */
    formatRate: function (num, bit = 2) {
        const str = this.multiply(num, 100) + "";
        const dotIndex = str.indexOf(".");
        if (num >= 1 || dotIndex === -1) {
            return str + "%";
        } else {
            return str.slice(0, dotIndex + bit + 1) + "%"
        }
    }
}