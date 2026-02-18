/**
 * server/src/middleware/validBody.js - 请求参数校验中间件工厂
 *
 * 基于 @hapi/joi 模式对请求中的参数进行校验。
 * 返回一个 Express 中间件函数，校验失败时自动丢出 400 错误。
 */
import { throwError } from "./handleError.js";

/**
 * validBody 工厂函数
 *
 * @param {import('@hapi/joi').Schema} schema  - Joi 模式对象
 * @param {string|null} errMessage             - 自定义错误消息，为 null 时使用 Joi 默认提示
 * @param {boolean} isBody                     - true 校验 req.body，false 校验 req.query
 * @returns {import('express').RequestHandler}  Express 中间件函数
 */
function validBody(schema, errMessage, isBody = true) {
    return function (req, res, next) {
        // 根据 isBody 决定校验请求体还是查询参数
        const content = req[isBody ? "body" : "query"];

        const validateResult = schema.validate(content);
        if (validateResult.error) {
            // 有自定义错误消息则使用自定义，否则使用 Joi 生成的详细提示
            const message = errMessage ? errMessage : validateResult.error.details[0].message;
            return throwError(next, message);
        }
        next();
    }
}

export {
    validBody
};