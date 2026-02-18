/**
 * server/src/schema/vip_member.js - 会员请求参数验证 Schema
 *
 * 使用 Joi 定义 VIP 会员相关接口的输入验证规则。
 * 会员码: 4-10 位数字，姓名: 1-10 个字符，性别: 男/女。
 *
 * 导出内容：
 *  - setVipPointSchema:        设置积分字段验证
 *  - setVipPointRuleSchema:    设置积分规则验证
 *  - createVipMemberSchema:    创建会员验证
 *  - updateVipMemberSchema:    更新会员验证
 *  - deleteVipMemberSchema:    删除会员验证
 *  - changeVipMemberSchema:    换卡验证
 */
import Joi from "@hapi/joi";
export const code = Joi.string().regex(/^\d{4,10}$/);
export const name = Joi.string().min(1).max(10);
export const vip_type = Joi.string().min(1).max(10);
export const sex = Joi.string().regex(/^[男女]$/);
export const phone = Joi.string().min(5).max(13);
export const is_disable = Joi.boolean();


export const setVipPointSchema = Joi.object({
    code: code.required(),
    point: Joi.number().min(0.01).max(10000).required(),
    type: Joi.bool().required()
});

export const setVipPointRuleSchema = Joi.object({
    value: Joi.number().min(1).max(100).required()
});

export const createVipMemberSchema = Joi.object({
    code: code.required(),
    name: name.required(),
    vip_type,
    sex,
    phone,
    is_disable
});

export const updateVipMemberSchema = Joi.object({
    code: code.required(),
    update_value: Joi.object({
        name,
        sex,
        phone,
        is_disable
    }).or(
        "name", "sex", "phone", "is_disable"
    ).required()
});

export const deleteVipMemberSchema = Joi.object({
    code: code.required()
});

export const changeVipMemberSchema = Joi.object({
    old_code: code.required(),
    new_code: code.invalid(Joi.ref("old_code")).required(),
    description: Joi.string()
});