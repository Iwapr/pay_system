/**
 * client/src/tasks/today.js - 首页今日数据 API 调用封装
 *
 * TodayTasks.getTodayData(ajax): 获取今日销售汇总数据 GET /api/today
 */
export class TodayTasks {
    static getTodayData(ajax) {
        // 获取首页今日数据

        return ajax.get("/api/today");
    }
}