/**
 * server/src/schema/stock.js - 进货单请求参数验证 Schema
 *
 * 使用 Joi 定义创建进货单接口的输入验证规则。
 *
 * 导出内容：
 *  - commodity_item:     进货单单条商品结构 {barcode, count(1-5000), in_price}
 *  - createStockSchema:  创建进货单 {supplier_name, description?, commodity_list}
 */
import Joi from "@hapi/joi";
import { name as supplier_name } from "./suppliers.js";
import { barcode, in_price } from "./commodity.js";

export const commodity_item = Joi.object({
    barcode: barcode.required(),
    count: Joi.number().min(1).max(5000).required(),
    in_price: in_price.required()
});

export const createStockSchema = Joi.object({
    supplier_name: supplier_name.required(),
    description: Joi.string().min(1).max(50),
    commodity_list: Joi.array().min(1).max(200).items(commodity_item).required()
});