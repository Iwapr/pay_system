/**
 * client/src/config/dev.env.js - 开发环境配置
 *
 * 开发时 API baseURL 指向本地调试服务器。
 */
import merge from "../tools/merge";
import { common } from "./common.env";

export const devConfig = merge(common, {
    baseURL: "http://127.0.0.1:8888"  // 本地开发服务器地址
});