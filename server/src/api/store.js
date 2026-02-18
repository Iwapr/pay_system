/**
 * server/src/api/store.js - 店铺信息接口
 *
 * GET /api/store/name  - 获取店铺名称
 * PUT /api/store/name  - 更新店铺名称（需管理员权限）
 */
import express from "express";
import { StoreTasks } from "../tasks/store.js";
import { storeNameSchema } from "../schema/store.js";
import { validBody } from "../middleware/validBody.js";

const route = express.Router();

route.get("/name", async (req, res, next) => {
    // 查询并返回店铺名称字符串
    const { name } = await StoreTasks.getStoreName();
    res.send(name);
});

route.put("/name", validBody(storeNameSchema, "店铺名格式不正确!"), async (req, res, next) => {
    // 更新店铺名称
    const { name } = req.body;
    await StoreTasks.setStoreName(name);

    res.send({
        message: "店铺名更新完成!"
    });
});

export default route;