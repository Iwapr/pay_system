/**
 * server/src/api/auth/token.js - Token 验证路由 GET /api/token/auth
 *
 * 功能：验证当前 JWT Token 是否有效，并返回店铺名称。
 * 通常在应用启动时由客户端调用以快速恢复登录态。
 *
 * 认证：需要有效的 JWT Token（通过 validToken 中间件）。
 */
import express from "express";
import { validToken } from "../../middleware/auth.js";
import { throwError } from "../../middleware/handleError.js";
import { StoreTasks } from "../../tasks/store.js";

const route = express.Router();

route.get("/auth", async (req, res, next) => {

    const token = req.headers["authorization"];
    if (!token) {
        return throwError(next, "没有登录，请登录!", 401);
    }

    try {
        const user_values = await validToken(token);

        const { name: store_name } = await StoreTasks.getStoreName();
        res.json({
            user_values,
            store_name
        });
    } catch (err) {
        return throwError(next, "无效凭证!请重新登录!", 401);
    }
});

export default route;