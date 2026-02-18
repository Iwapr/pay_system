/**
 * server/src/schema/promotion.js - 促销活动请求参数验证 Schema
 *
 * 使用 Joi 定义营销促销相关接口的输入验证规刘。
 *
 * 导出内容：
 *  - name:                   活动名称 (1-20 字符)
 *  - start_date/end_date:     活动时间努时间戳
 *  - createPromotionSchema:  创建促销活动验证 {name, start_date, end_date, description?}
 *  - updatePromotionSchema:  修改促销活动验证
 *  - addCommoditySchema:     向活动添加商品验证
 *  - editCommoditySchema:    修改活动商品验证
 *  - delCommoditySchema:     从活动移除商品验证
 */
import Joi from "@hapi/joi";
import { barcode } from "./commodity.js";

export const name = Joi.string().min(1).max(20);
export const start_date = Joi.date().timestamp();
export const end_date = Joi.date().timestamp();
export const description = Joi.string().min(1).max(30);

export const createPromotionSchema = Joi.object({
    name: name.required(),
    start_date: start_date.required(),
    end_date: end_date.min(Joi.ref("start_date")).required(),
    description
});

export const updatePromotionSchema = Joi.object({
    name: name.required(),
    update_value: Joi.object({
        new_name: name,
        start_date: start_date,
        end_date: end_date,
        description
    }).or(
        "new_name",
        "start_date",
        "end_date",
        "description"
    ).required()
});

export const discount_value = Joi.number().min(0.0).max(100000).required();

export const commoditySchema = Joi.object({
    barcode: barcode.required(),
    promotion_type: name.required(),
    discount_value
});

export const addCommoditySchema = Joi.object({
    promotion_name: name.required(),
    commodity: commoditySchema.required()
    // commodity_list: Joi.array().min(1).max(200).items(commoditySchema).required()
});

export const editCommoditySchema = Joi.object({
    promotion_name: name.required(),
    barcode: barcode.required(),
    update_value: {
        promotion_type: name.required(),
        discount_value
    }
});