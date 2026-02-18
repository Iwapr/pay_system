/**
 * client/src/tools/throttle.js - 函数节流工具
 *
 * 限制函数执行频率，在 delay 时间内只执行一次。
 * 常用于按键执行、扫码输入等高频操作的防抖场景。
 *
 * @param {Function} fn    - 要节流的函数
 * @param {number}   delay - 节流间隔（ms），默认 300ms
 * @returns {Function} 节流包装后的函数
 */
export function throttle(fn, delay = 300) {
    let flag = true;  // 出发开关
    return function (...arg) {
        if (flag) {
            flag = false;           // 关闭开关
            fn.call(null, ...arg);  // 立即执行一次
            setTimeout(() => {
                flag = true;        // delay ms 后重新打开开关
            }, delay);
        }
    }
} 