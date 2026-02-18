/**
 * client/src/config/index.js - 客户端配置入口
 *
 * 根据 Webpack 注入的 `process.env.NODE_ENV` 环境变量
 * 自动加载对应环境遥的配置对象。
 */
import { devConfig } from "./dev.env";
import { prodConfig } from "./prod.env";

let config;

switch (process.env.NODE_ENV) {
    case "production":
        config = prodConfig;
        break;
    case "development":
        config = devConfig;
        break;
    default:
        config = prodConfig;  // 未知环境默认使用生产配置
}

export default config;
export { config };