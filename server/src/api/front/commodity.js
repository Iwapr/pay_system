/**
 * server/src/api/front/commodity.js - 前台商品查询路由 GET /api/front/commodity/:key
 *
 * 收银台搜索商品接口，支持条形码精准查询和关键字模糊查询。
 * warehouse 参数为 true 时返回更多仓库字段（用于仓库查询场景）。
 *
 * 认证：需要有效的 JWT Token。
 */
import express from "express";
import { throwError } from "../../middleware/handleError.js";
import CommodityTask from "../../tasks/frontend/commodity.js";

const route = express.Router();

route.get("/:query", async (req, res, next) => {

    const { warehouse } = req.query;
    const isWareQueryFlag = warehouse && warehouse === "true";
    // 是否仓库管理界面查询的flag

    const { isAdmin } = req["jwt_value"];

    if (isWareQueryFlag && !isAdmin) {
        return throwError(next, "非管理员组用户无法执行此操作!");
    }

    const { query } = req.params;

    const list = await CommodityTask.getCommodityDetails(query.toUpperCase(), isWareQueryFlag);
    // 查询结果

    if (isWareQueryFlag) {
        // 如果是仓库管理界面查询，就直接返回列表，无需进行解析

        return res.json(list);
    }


    let data = [];
    if (list.length !== 0) {
        data = await CommodityTask.parseCommodityList(list);
    }

    res.json(data);
})

export default route;