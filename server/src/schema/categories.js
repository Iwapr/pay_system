/**
 * server/src/schema/categories.js - 商品分类请求参数验证 Schema
 *
 * 使用 Joi 定义分类相关接口的输入验证规则。
 *
 * 导出内容：
 *  - categoryName:             分类名称（字符串，1-10 个字符）
 *  - categoryNameReq:          必填的分类名称
 *  - createCategorySchema:     创建分类（name 必填，parent_name 可选且不得与 name 相同）
 *  - updateCategoryNameSchema:  重命名分类（old_name/new_name 必填）
 *  - updateCategoryParentSchema: 修改父分类（name/parent_name 必填）
 *  - deleteCategorySchema:      删除分类（name 必填）
 */
import Joi from "@hapi/joi";

export const categoryName = Joi.string().min(1).max(10);

export const categoryNameReq = categoryName.required();

export const createCategorySchema = Joi.object({
    name: categoryNameReq,
    parent_name: categoryName.invalid(Joi.ref("name"))
});

export const updateCategoryNameSchema = Joi.object({
    old_name: categoryNameReq,
    new_name: categoryName.invalid(Joi.ref("old_name")).required()
});

export const updateCategoryParentSchema = Joi.object({
    name: categoryNameReq,
    parent_name: categoryName.invalid(Joi.ref("name")).required()
});

export const deleteCategorySchema = Joi.object({
    name: categoryNameReq
});