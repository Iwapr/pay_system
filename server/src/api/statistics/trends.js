/**
 * server/src/api/statistics/trends.js - 销售趋势统计路由
 *
 * GET /api/statistics/trends - 返回指定时间段内的销售趋势数据，
 * 支持按小时/天/月（type 参数 hour/day/month）汇总。
 *
 * 认证：需要有效的 JWT Token。
 */
import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { throwError } from "../../middleware/handleError.js";
import { salesTrendsSchema } from "../../schema/statistics.js";
import { StatisticsTasks } from "../../tasks/statistics.js";

const route = express.Router();

route.get("/", validBody(salesTrendsSchema, "参数不正确!", false), async (req, res, next) => {
    // 查询商品销售趋势

    const { query } = req;

    const { status, data, message } = await StatisticsTasks.getSalesTrends(query);

    if (!status) {
        return throwError(next, message);
    }

    res.send(data);
});

export default route;