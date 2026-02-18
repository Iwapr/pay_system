/**
 * server/src/schema/user.js - 用户请求参数验证 Schema
 *
 * 使用 Joi 定义用户相关接口的输入验证规则。
 * 用户名: 1-13 个字符，密码: 必须为字母数字 5-30 个字符。
 *
 * 导出内容：
 *  - userPwdSchema:        登录验证 {username, password}
 *  - newUserSchema:        创建用户 {new_username, password, group}
 *  - updateUserPwdSchema:  修改密码 {username, new_password}
 *  - updateUserStatusSchema:修改状态 {username, status(boolean)}
 *  - updateUserNameSchema:  修改用户名 {old_username, new_username}
 *  - updateUserGroupSchema: 修改用户组 {username, new_group}
 */
import Joi from "@hapi/joi";
// import { group } from "./group.js";

export const group = Joi.string().min(2).max(10).required();
const username = Joi.string().min(1).max(13).required();
const password = Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).required();


export const userPwdSchema = Joi.object({
    username,
    password
});

export const newUserSchema = Joi.object({
    new_username: username,
    password,
    group
});

export const updateUserPwdSchema = Joi.object({
    username,
    new_password: password
});

export const updateUserStatusSchema = Joi.object({
    username,
    status: Joi.boolean().required()
});

export const updateUserNameSchema = Joi.object({
    old_username: username,
    new_username: Joi.string().min(1).max(13).invalid(Joi.ref("old_username")).required()
});

export const updateUserGroupSchema = Joi.object({
    username,
    new_group: group
});