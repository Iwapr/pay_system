/**
 * client/src/config/prod.env.js - 生产环境配置
 *
 * 生产打包后 API baseURL 仍指向 127.0.0.1:8888，
 * 因为屏端系统使用 Electron 本地运行服务器。
 */
import merge from "../tools/merge";
import { common } from "./common.env";

export const prodConfig = merge(common, {
    baseURL: "http://127.0.0.1:8888"  // Electron 屏端本地服务器
});