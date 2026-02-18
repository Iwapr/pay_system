/**
 * server/src/api/login.js - 登录接口
 *
 * POST /api/login
 * 请求体: { username: string, password: string }
 *
 * 逻辑流程：
 *  1. 校验用户名和密码格式（Joi Schema）
 *  2. 对比数据库中的密码哈希
 *  3. 获取用户权限列表和所属组
 *  4. 签发 JWT Token（有效期 12h）
 *  5. 返回 Token + 用户信息 + 店铺名称
 */
import express from "express";
import UserTask from "../tasks/users.js";
import Jwt from "../lib/jwt.js";
import { validBody } from "../middleware/validBody.js";
import { userPwdSchema } from "../schema/user.js";
import { throwError } from "../middleware/handleError.js";
import config from "../config/index.js";
import { StoreTasks } from "../tasks/store.js";

const { default_admin_group_name } = config;

const route = express.Router();

route.post("/",
    validBody(userPwdSchema, "请输入合法的用户名和密码!"),
    async (req, res, next) => {
        const { username, password } = req.body;

        // 验证用户名和密码
        const { status, message, type } = await UserTask.validateAccount(username, password);
        if (!status) {
            req.custom_error_data = { type };  // 附加错误类型信息
            return throwError(next, message, 401);
        }

        // 获取店铺名称（登录响应中一并返回）
        const { name: store_name } = await StoreTasks.getStoreName();

        // 获取用户权限列表、所属组信息
        const {
            authorityList,
            group,
            group_id
        } = await UserTask.getUserAuthority(username, true);

        // 签发 JWT Token，payload 包含用户名、权限列表、是否管理员
        const token = await Jwt.sign({
            username,
            authority: authorityList,
            isAdmin: default_admin_group_name === group
        });

        return res.json({
            message: "登录成功!",
            token,
            authority: authorityList,
            username,
            group,
            group_id,
            isAdmin: default_admin_group_name === group,
            store_name
        });

    });

export default route;