/**
 * client/src/config/dev.env.js - 开发环境配置
 *
 * 开发时 API baseURL 指向本地调试服务器。
 */
import merge from "../tools/merge";
import { common } from "./common.env";

// 自动使用当前页面的 hostname，局域网其他设备访问时无需手动配置 API 地址
const hostname = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";

export const devConfig = merge(common, {
    baseURL: `http://${hostname}:8888`
});