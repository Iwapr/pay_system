/**
 * server/src/api/statistics/proportion.js - 商品销售占比统计路由
 *
 * GET /api/statistics/proportion - 返回指定时间段内各商品的销售额占比，
 * 支持按分类或商品维度（type 参数）统计。
 *
 * 认证：需要有效的 JWT Token。
 */
import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { proportionSchema } from "../../schema/statistics.js";
import { StatisticsTasks } from "../../tasks/statistics.js";
import { throwError } from "../../middleware/handleError.js";

const route = express.Router();

route.get("/", validBody(proportionSchema, "时间戳参数不正确!", false), async (req, res, next) => {
    // 查询指定时间范围内商品销售比例

    const { start_time, end_time, type } = req.query;

    const { status, data, message } = await StatisticsTasks.getCommoditySalesProportionByTime(start_time, end_time, type);

    if (!status) {
        return throwError(next, message);
    }

    res.json(data);
});

export default route;