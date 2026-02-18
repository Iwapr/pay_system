/**
 * client/src/tools/time.js - 前端时间格式化工具
 *
 * 将时间戳（ms）转换为可读的日期时间字符串。
 * 输出格式："YYYY/MM/DD HH:mm:ss"
 */

/**
 * 将时间戳格式化为 "YYYY/MM/DD HH:mm:ss" 字符串
 *
 * @param {number|string} [_timestamp] - 时间戳（ms），不传则使用当前时间
 * @returns {string} 格式化后的时间字符串
 */
export function getFormatTime(_timestamp) {

    if (_timestamp) {
        const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);
        return convert(new Date(timestamp));
    }

    return convert(new Date());

    /**
     * 内部转换函数：将 Date 对象转换为格式化字符串
     * @param {Date} time
     * @returns {string}
     */
    function convert(time) {
        const year = time.getFullYear();
        const now_month = time.getMonth() + 1;
        const month = now_month < 10 ? "0" + now_month : now_month;  // 月份补零
        const now_date = time.getDate();
        const date = now_date < 10 ? "0" + now_date : now_date;      // 日期补零
        const now_hours = time.getHours();
        const hours = now_hours < 10 ? "0" + now_hours : now_hours;  // 小时补零
        const now_minute = time.getMinutes();
        const minute = now_minute < 10 ? "0" + now_minute : now_minute;  // 分钟补零
        const now_sec = time.getSeconds();
        const sec = now_sec < 10 ? "0" + now_sec : now_sec;              // 秒补零

        return `${year}/${month}/${date} ${hours}:${minute}:${sec}`;
    }
}