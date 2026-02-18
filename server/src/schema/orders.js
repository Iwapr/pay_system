/**
 * server/src/schema/orders.js - 订单请求参数验证 Schema
 *
 * 使用 Joi 定义前台订单相关接口的输入验证规则。
 *
 * 导出内容：
 *  - price:               正数单价 (0-100000)
 *  - negative_price:      可为负的单价（退货） (max=100000)
 *  - order_id:            订单号（数字大于 10^14）
 *  - count:               商品数量 (0.01-10000)
 *  - commodity:           订单单条商品结构 {barcode, sale_price, origin_price, count, status?}
 *  - createOrderSchema:   创建订单 {vip_code?, pay_type?, ...}
 *  - undoOrderSchema:     撤销订单 {order_id}
 *  - addVipOrderSchema:   为订单添加 VIP {order_id, vip_code}
 */
import Joi from "@hapi/joi";
import { code } from "./vip_member.js";
import { barcode, sale_price } from "./commodity.js";

export const price = Joi.number().min(0).max(100000);
export const negative_price = Joi.number().max(100000);
export const order_id = Joi.number().min(100000000000000);
export const count = Joi.number().min(0.01).max(10000);

export const commodity = Joi.object({
    barcode: barcode.required(),
    sale_price: negative_price.required(),
    origin_price: price.required(),
    count: count.required(),
    status: Joi.string().min(1).max(5)
});

export const createOrderSchema = Joi.object({
    vip_code: code,
    pay_type: Joi.string().min(1).max(5),
    origin_price: price.required(),
    sale_price: negative_price.required(),
    client_pay: negative_price.required(),
    change: price,
    count: count.required(),
    commodity_list: Joi.array().min(1).max(200).items(commodity).required()
});

export const undoOrderSchema = Joi.object({
    order_id: order_id.required()
});

export const addOrderVipSchema = Joi.object({
    order_id: order_id.required(),
    vip_code: code.required()
});

/**
 * 支付宝条码支付入参校验
 *
 * auth_code    - 顾客付款码（扫码枪读入的字符串，18-24 位数字，以 25-30 开头）
 * total_amount - 实付金额（元，精确到分，范围 0.01-100000）
 * subject      - 订单标题（如"小牧收银台-消费"，显示在支付宝账单里）
 * out_trade_no - 商户唯一订单号（使用系统生成的 order_id）
 */
export const alipayPaySchema = Joi.object({
    auth_code: Joi.string().regex(/^\d{16,24}$/).required(),
    total_amount: Joi.number().min(0.01).max(100000).required(),
    subject: Joi.string().min(1).max(50).required(),
    out_trade_no: Joi.number().min(1000000000000).required()  // 13位以上数字，客户端用 Date.now() 生成
});