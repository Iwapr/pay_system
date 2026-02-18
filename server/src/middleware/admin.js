/**
 * server/src/middleware/admin.js - 管理员权限中间件
 *
 * 安装在需要管理员权限的路由之前，验证当前登录用户是否属于管理员组。
 * 依赖 auth 中间件（路由阶层要先才到 admin)。
 */
import config from "../config/index.js";
import UserTask from "../tasks/users.js";

const { default_admin_group_name } = config;

/**
 * 验证指定用户是否是管理员
 * @param {string} username - 要验证的用户名
 * @returns {Promise<boolean>}
 */
async function validateAdmin(username) {
    const { group } = await UserTask.getUserGroup(username);
    return group === default_admin_group_name;
}

/**
 * admin 中间件
 *
 * - 从 req.jwt_value.username 获取当前用户名
 * - 查询用户所属组，不是管理员组则返回 403
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function admin(req, res, next) {
    const { username } = req.jwt_value;
    const result = await validateAdmin(username);
    if (result) {
        next();
    } else {
        const err = new Error("此账户没有权限执行这项操作!");
        err.status = 403;
        next(err);
    }
}

export {
    validateAdmin
}

export default admin;