/**
 * server/src/api/today.js - 当日销售数据接口
 *
 * GET /api/today
 * - 管理员：返回门店当日全部销售数据
 * - 收銀员：只返回当前收銀员自己的销售数据
 */
import express from "express";
import TodayTasks from "../tasks/today.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 从 JWT payload 获取用户身份信息
    const { isAdmin, username } = req["jwt_value"];

    // 根据是否管理员返回不同范围的当日数据
    const data = await TodayTasks.getTodayData(isAdmin, username);

    res.json(data);
});

export default route;