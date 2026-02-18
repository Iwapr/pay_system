/**
 * server/src/middleware/handleError.js - 全局错误处理中间件
 *
 * Express 错误处理中间件的签名是四个参数：(err, req, res, next)。
 * 必须放在所有路由注册之后，否则无法捕获错误。
 */

/**
 * handleError - 全局错误处理中间件
 *
 * 响应格式：
 *   { message: string, value?: any }
 * HTTP 状态码：使用 err.status，若未设置则默认 400。
 *
 * @param {Error & {status?: number}} err - 错误对象
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function handleError(err, req, res, next) {
    const { message, status } = err;

    let obj = {
        message
    };
    // 如果路由处理中附加了额外错误数据，一并返回客户端
    if (req.custom_error_data) {
        obj.value = req.custom_error_data;
    }
    res.status(status ? status : 400).json(obj);
}

/**
 * throwError - 快速构造并传递错误的工具函数
 *
 * 常用于路由内部需要终止并返回错误响应的场景。
 *
 * @param {import('express').NextFunction} next
 * @param {string} message   - 错误消息，默认“未知错误!”
 * @param {number} status    - HTTP 状态码，默认 400
 */
function throwError(next,
    message = "未知错误!",
    status = 400) {
    const err = new Error(message);
    err.status = status;
    return next(err);
}

export {
    throwError
};

export default handleError;