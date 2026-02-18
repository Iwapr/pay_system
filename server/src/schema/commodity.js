/**
 * server/src/schema/commodity.js - 商品请求参数验证 Schema
 *
 * 使用 Joi 定义商品相关接口的输入验证规则。
 *
 * 导出的基础字段验证（供其他 schema 引用）：
 *  - barcode:      条形码 (1-40 字符)
 *  - name:         商品名称 (1-50 字符)
 *  - unit:         单位 (1-10 字符)
 *  - size:         詳细规格 (1-30 字符)
 *  - in_price:     进货价 (0-1000000)
 *  - sale_price:   销售价 (0-1000000)
 *  - vip_points:   是否百积分 (boolean)
 *  - is_delete:    是否软删除 (boolean)
 *
 * 导出的 Schema：
 *  - createCommoditySchema:  创建商品验证
 *  - updateCommoditySchema:  更新商品验证
 *  - deleteCommoditySchema:  删除商品验证
 */
import Joi from "@hapi/joi";
import { categoryNameReq, categoryName } from "./categories.js";
import { name as supplier_name } from "./suppliers.js";

export const barcode = Joi.string().min(1).max(40);
export const name = Joi.string().min(1).max(50);
export const unit = Joi.string().min(1).max(10);
export const size = Joi.string().min(1).max(30);
export const in_price = Joi.number().min(0).max(1000000);
export const sale_price = Joi.number().min(0).max(1000000);
export const vip_points = Joi.boolean();
export const is_delete = Joi.boolean();

export const createCommoditySchema = Joi.object({
    barcode: barcode,
    name: name.required(),
    category_name: categoryNameReq,
    unit,
    size,
    in_price,
    sale_price,
    vip_points,
    is_delete,
    supplier_name: supplier_name,
});

export const updateCommoditySchema = Joi.object({
    current_barcode: barcode.required(),
    update_value: Joi.object({
        barcode: barcode,
        name: name,
        category_name: categoryName,
        unit,
        size,
        in_price,
        sale_price,
        vip_points,
        is_delete,
        supplier_name
    }).or(
        "barcode",
        "name",
        "category_name",
        "unit",
        "size",
        "in_price",
        "sale_price",
        "vip_point",
        "is_delete",
        "supplier_name"
    ).required()
});

export const deleteCommoditySchema = Joi.object({
    barcode: barcode.required()
});
