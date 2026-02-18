/**
 * server/src/middleware/preventModify.js - Demo 模式写操作拦截中间件
 *
 * 只有在 api/index.js 中判断 isDemo=true 且当前是 demo 模式时才会注册此中间件。
 * 效果：除 GET 外所有修改操作（POST/PUT/DELETE）均被拦截，返回 400。
 */

/** Demo 模式下允许的 HTTP 方法（只允许查询） */
const allowMethod = ["GET"];

/**
 * preventModify - 阻止写操作的中间件
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function preventModify(req, res, next) {
    if (allowMethod.includes(req.method)) {
        return next();  // 允许的方法，放行
    }

    // 非允许方法，返回 400
    res.status(400).json({
        message: "demo模式下无法进行此操作!"
    });
}

export default preventModify;