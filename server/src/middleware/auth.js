/**
 * server/src/middleware/auth.js - JWT 身份验证中间件
 *
 * 安装在需要登录的路由之前，验证请求头中搭载的 Authorization Token。
 * 验证局过后，JWT payload 会被写入 req.jwt_value，住用于后续路由读取用户信息。
 */
import Jwt from "../lib/jwt.js";

/**
 * 验证 Token 是否合法
 * @param {string} token - JWT 字符串
 * @returns {Promise<Object>} 解码后的 payload（包含 username, authority 等）
 */
export function validToken(token) {
    return Jwt.verify(token);
}

/**
 * auth 中间件
 *
 * - 如果请求头中没有 Authorization 字段，返回 401
 * - 如果验证失败（token 过期或被篹改），返回 401
 * - 验证通过则将 payload 赋张到 req.jwt_value 并继续
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function auth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({
            message: "无验证信息，请登录!"
        });
    }
    try {
        const result = await validToken(token);
        req["jwt_value"] = result;  // 将解码后的 JWT payload 挂载到请求对象
        next();
    } catch (error) {
        const err = new Error("验证失败，请重新登录!");
        err.status = 401;
        next(err);
    }
}

export default auth;