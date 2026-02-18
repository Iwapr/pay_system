/**
 * server/src/schema/store.js - 店铺配置请求参数验证 Schema
 *
 * storeNameSchema: 设置店铺名称的请求验证（name 必填，1-10 个字符）
 */
import Joi from "@hapi/joi";
    name: Joi.string().min(1).max(10).required()
});