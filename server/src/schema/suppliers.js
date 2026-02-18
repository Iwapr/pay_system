/**
 * server/src/schema/suppliers.js - 供应商请求参数验证 Schema
 *
 * 使用 Joi 定义供应商相关接口的输入验证规则。
 * name 字段自定义了中文错误提示。
 *
 * 导出内容：
 *  - name:                   供应商名称字段 (2-10 字符，带中文错误提示)
 *  - createSupplierSchema:   创建供应商 {name, phone?, description?}
 *  - updateSupplierSchema:   更新供应商 {name, update_value: {new_name?, new_phone?, new_description?}}
 */
import Joi from "@hapi/joi";

export const name = Joi.string().min(2).max(10).error(errors => {
    errors.forEach(err => {
        switch (err.code) {
            case "string.empty":
                err.message = "供应商名称不能为空!";
                break;
            case "string.min":
                err.message = `供应商名称需要大于或等于${err.local.limit}个字!`;
                break;
            case "string.max":
                err.message = `供应商名称长度需要小于或等于${err.local.limit}个字!`;
                break;
            default:
                break;
        }
    });
    return errors;
});
export const phone = Joi.string().min(5).max(13);
export const description = Joi.string().min(1).max(100);

export const createSupplierSchema = Joi.object({
    name: name.required(),
    phone,
    description
});

export const updateSupplierSchema = Joi.object({
    name: name.required(),
    update_value: Joi.object({
        new_name: name,
        new_phone: phone,
        new_description: description
    }).or(
        "new_name",
        "new_phone",
        "new_description"
    ).required()
});