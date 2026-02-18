/**
 * server/src/lib/mathc.js - 高精度数操工具
 *
 * 基于 mathjs 的 BigNumber 进行四则运算，避免浮点数精度失失题。
 * 设计初衷：0.1 + 0.2 = 0.30000000000000004，用 BigNumber 则得到正确的 0.3。
 *
 * 注意：mathjs 在 webpack 打包后的导入方式与直接运行不同：
 *   - 开发模式（未打包）：默认导入 `math`
 *   - 生产模式（webpack 打包后）：需要命名空间导入 `* as _math`
 */
import * as _math from "mathjs";
import math from "mathjs";

// webpack 打包后 mathjs 的表现不一致，根据环境选择正确的导入方式
const __math = process.env.NODE_ENV === "development" ? math : _math;

/**
 * mathc - 高精度数学计算工具对象
 * 所有运算均使用 BigNumber 避免浮点失精
 */
export const mathc = {
    /**
     * 列表求和
     * @param {number[]} list - 数字数组
     * @returns {number}
     */
    addList: (list) => {
        return __math.number(list.reduce((a, b) => __math.add(__math.bignumber(a), __math.bignumber(b)), 0));
    },
    /**
     * 加法 a + b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    add: (a, b) => {
        return __math.number(__math.add(__math.bignumber(a), __math.bignumber(b)));
    },
    /**
     * 减法 a - b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    subtract: (a, b) => {
        return __math.number(__math.subtract(__math.bignumber(a), __math.bignumber(b)));
    },
    /**
     * 乘法 a * b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    multiply: (a, b) => {
        return __math.number(__math.multiply(__math.bignumber(a), __math.bignumber(b)));
    },
    /**
     * 除法 a / b
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    divide: (a, b) => {
        return __math.number(__math.divide(__math.bignumber(a), __math.bignumber(b)));
    },
    /**
     * 四舍五入
     * @param {number} a   - 要舍入的数
     * @param {number} bit - 保留小数位数，默认 2
     * @returns {number}
     */
    round: (a, bit = 2) => {
        return __math.round(a, bit);
    }
}