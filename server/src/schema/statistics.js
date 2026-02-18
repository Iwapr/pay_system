/**
 * server/src/schema/statistics.js - 统计分析请求参数验证 Schema
 *
 * 使用 Joi 定义统计相关接口的输入验证规则。
 *
 * 导出内容：
 *  - timeStampSchema:        时间戳必填字段
 *  - ordersSchema:           订单列表查询 {start_time, end_time}
 *  - queryOrdersSchema:      多条件订单查询 {start_time, end_time, query, type}
 *  - proportionSchema:       商品占比查询 {start_time, end_time, type}
 *  - salesTrendsSchema:      销售趋势查询 {start_time, end_time, type}
 */
import Joi from "@hapi/joi";

const queryTypeSchema = Joi.string().min(1).max(10).required();

const queryKeySchema = Joi.string().min(1).max(30).required();

const proportionTypeSchema = Joi.string().min(1).max(20).required();

export const ordersSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema
});

export const queryOrdersSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema,
    query: queryKeySchema,
    type: queryTypeSchema
});

export const proportionSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema,
    type: proportionTypeSchema
});

export const salesTrendsSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema.invalid(Joi.ref("start_time")).min(Joi.ref("start_time")),
    type: proportionTypeSchema
});