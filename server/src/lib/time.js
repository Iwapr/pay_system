/**
 * server/src/lib/time.js - 时间处理工具
 *
 * 基于 moment.js 封装常用的时间戳与格式化函数，
 * 主要用于统计模块的时间范围计算和标签生成。
 */
import moment from "moment";

/**
 * 获取指定时间戳的下一天 00:00 的时间戳
 * @param {number|string} time_stamp - 任意时间戳（ms）
 * @returns {string} 下一天 00:00 的毫秒时间戳字符串
 */
export function getNextDayStartTimeStrap(time_stamp) {
    return moment(Number(time_stamp)).add(1, "day").startOf("day").format("x");
}

/**
 * 获取指定日期一周前（6天前）00:00 的时间戳
 * @param {number|string} end_time_stamp - 结束日期时间戳（ms）
 * @returns {string} 6 天前 00:00 的毫秒时间戳字符串
 */
export function getWeekendStartTimeStrap(end_time_stamp) {
    return moment(end_time_stamp).subtract(6, "day").startOf("day").format("x");
}

/**
 * 获取指定日期或今天 00:00 的时间戳
 * @param {string} [str] - 可选的日期字符串（如 "2024/01/01"），不传则返回今天的午夜时间戳
 * @returns {number} 指定日期 00:00 的毫秒时间戳
 */
export function getNightTimeStrap(str) {
    const time = str ? new Date(str) : new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return new Date(`${year}/${month}/${day}`).getTime();
}

/**
 * 将时间戳格式化为可读字符串
 *
 * @param {number|string} _timestamp - 毫秒时间戳，0 或 undefined 表示当前时间
 * @param {"year"|"month"|"day"|"hour"|undefined} type - 精度类型
 *   - "year"  → "2024"
 *   - "month" → "2024/01"
 *   - "day"   → "2024/01/15"
 *   - "hour"  → "09"（只返回小时）
 *   - 不传   → "2024/01/15 09:05:30"
 * @returns {string|number}
 */
export function getFormatTime(_timestamp, type) {
    const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);

    const time = timestamp ? new Date(timestamp) : new Date();
    const year = time.getFullYear();

    if (type === "year") return year;

    const now_month = time.getMonth() + 1;
    const month = now_month < 10 ? "0" + now_month : now_month;

    if (type === "month") return `${year}/${month}`;

    const now_day = time.getDate();
    const day = now_day < 10 ? "0" + now_day : now_day;

    if (type === "day") return `${year}/${month}/${day}`;

    const now_hours = time.getHours();
    const hours = now_hours < 10 ? "0" + now_hours : now_hours;

    if (type === "hour") return hours;

    const now_minute = time.getMinutes();
    const minute = now_minute < 10 ? "0" + now_minute : now_minute;
    const now_sec = time.getSeconds();
    const sec = now_sec < 10 ? "0" + now_sec : now_sec;

    return `${year}/${month}/${day} ${hours}:${minute}:${sec}`;
}

/**
 * 生成统计图表所需的时间范围和时间轴标签
 *
 * @param {number|string} start_time - 起始时间戳（ms）
 * @param {number|string} end_time   - 结束时间戳（ms）
 * @param {number}        maxTime    - 最大时间范围（ms），超出时从 end_time 往前截取
 * @param {"hour"|"day"|"month"} type - 统计粒度
 * @returns {[number, number, string[]]}
 *   [实际起始时间戳, 实际结束时间戳, 时间轴标签数组]
 *
 * 不同粒度的标签格式：
 *   - hour  → ["00", "01", ..., "23"]（固定24条）
 *   - day   → ["2024/01/15", "2024/01/16", ...]
 *   - month → ["2024/01", "2024/02", ...]
 */
export function createTimerangeKey(start_time, end_time, maxTime, type) {

    let start_time_instance = moment(Number(start_time));
    let end_time_instance = moment(Number(end_time));

    /** 将数字格式化为两位字符串，如 5 → "05" */
    function format(i) {
        return i > 9 ? i + "" : "0" + i;
    }

    /**
     * 将 [年, 月, 日] 数组格式化为 "年/月/日" 字符串
     * 注意：月份索引为 0-based，需要 +1
     */
    function formatTime(list) {
        return list.map((i, index) => index === 0 ? i : (index === 1 ? format(i + 1) : format(i))).join("/");
    }

    const config = [
        {
            // 小时粒度：固定返回当天 0-23 小时的标签
            type: "hour",
            fn: () => {
                end_time_instance.endOf("day");
                start_time_instance = moment(Number(end_time_instance.format("x"))).startOf("day");

                let list = [];
                for (let i = 0; i < 24; i++) {
                    list.push(format(i));
                }

                return [
                    Number(start_time_instance.format("x")),
                    Number(end_time_instance.format("x")),
                    list
                ];
            }
        },
        {
            // 天粒度：从起始到结束按天枚举，超出 maxTime 时截断
            type: "day",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");
                const end_day = end_time_instance.get("date");

                let list = [];

                const end_time_list = [end_year, end_month, end_day];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month"),
                        start_time_instance.get("date")
                    ];
                }

                let nowStartTime = getStartTime();

                // 从起始日期逐天移动到结束日期
                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "day");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        },
        {
            // 月粒度：从起始到结束按月枚举，超出 maxTime 时截断
            type: "month",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");

                let list = [];

                const end_time_list = [end_year, end_month];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month")
                    ];
                }

                let nowStartTime = getStartTime();

                // 从起始月份逐月移动到结束月份
                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "month");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        }
    ];

    const { fn } = config.find(i => i.type === type);

    return fn();
}


export function getWeekendStartTimeStrap(end_time_stamp) {
    // 获取指定日期一周前的时间戳

    return moment(end_time_stamp).subtract(6, "day").startOf("day").format("x");
}

export function getNightTimeStrap(str) {
    // 获取指定日期午夜00:00的时间戳，默认返回今天午夜00:00的时间戳

    const time = str ? new Date(str) : new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return new Date(`${year}/${month}/${day}`).getTime();
}


export function getFormatTime(_timestamp, type) {

    // type
    // year, month, day, hour

    const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);

    const time = timestamp ? new Date(timestamp) : new Date();
    const year = time.getFullYear();

    if (type === "year") return year;


    const now_month = time.getMonth() + 1;
    const month = now_month < 10 ? "0" + now_month : now_month;

    if (type === "month") return `${year}/${month}`;

    const now_day = time.getDate();
    const day = now_day < 10 ? "0" + now_day : now_day;

    if (type === "day") return `${year}/${month}/${day}`;


    const now_hours = time.getHours();
    const hours = now_hours < 10 ? "0" + now_hours : now_hours;

    if (type === "hour") return hours;

    const now_minute = time.getMinutes();
    const minute = now_minute < 10 ? "0" + now_minute : now_minute;
    const now_sec = time.getSeconds();
    const sec = now_sec < 10 ? "0" + now_sec : now_sec;

    return `${year}/${month}/${day} ${hours}:${minute}:${sec}`;
}

export function createTimerangeKey(start_time, end_time, maxTime, type) {

    let start_time_instance = moment(Number(start_time));
    let end_time_instance = moment(Number(end_time));

    function format(i) {
        return i > 9 ? i + "" : "0" + i;
    }

    function formatTime(list) {
        return list.map((i, index) => index === 0 ? i : (index === 1 ? format(i + 1) : format(i))).join("/");
    }

    const config = [
        {
            type: "hour",
            fn: () => {
                end_time_instance.endOf("day");
                start_time_instance = moment(Number(end_time_instance.format("x"))).startOf("day");

                let list = [];

                for (let i = 0; i < 24; i++) {
                    list.push(format(i));
                }

                return [
                    Number(start_time_instance.format("x")),
                    Number(end_time_instance.format("x")),
                    list
                ];
            }
        },
        {
            type: "day",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");
                const end_day = end_time_instance.get("date");

                let list = [];

                const end_time_list = [end_year, end_month, end_day];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month"),
                        start_time_instance.get("date")
                    ];
                }

                let nowStartTime = getStartTime();

                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "day");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        },
        {
            type: "month",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");

                let list = [];

                const end_time_list = [end_year, end_month];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month")
                    ];
                }

                let nowStartTime = getStartTime();

                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "month");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        }
    ];

    const { fn } = config.find(i => i.type === type);

    return fn();
}
