/**
 * server/src/schema/data.js - 数据导入/导出请求验证 Schema
 *
 * 导出内容：
 *  - importCommpditySchema: 批量导入商品 {rules, data[]} 验证
 *    rules 包含: barcode_exist/category_exist/supplier_exist 冲突处理策略
 *  - exportDataSchema:      数据导出类型验证 type 必须为 commodity/vip/sales 之一
 */
import Joi from "@hapi/joi";
import {
    createCommoditySchema
} from "./commodity.js";

const commodityRules = Joi.object({
    barcode_exist: Joi.bool().required(),
    category_exist: Joi.bool().required(),
    supplier_exist: Joi.bool().required()
}).required();

const commodityList = Joi.array().min(1).max(10000).items(createCommoditySchema).required();

export const importCommpditySchema = Joi.object({
    rules: commodityRules,
    data: commodityList
});

const typeList = ["commodity", "vip", "sales"];

export const exportDataSchema = Joi.object({
    type: Joi.string().valid(...typeList).required()
});