/**
 * server/src/config/index.js - 配置入口
 *
 * 根据 NODE_ENV 合并对应的环境配置和公共配置：
 *  - development → devEnv（允许内网 IP 跨域）
 *  - production  → prodEnv（只允许 127.0.0.1）
 *  - 其他       → 默认 devEnv
 */
import prodEnv from "./prod.env.js";
import devEnv from "./dev.env.js";
import commonEnv from "./common.js";
import merge from "../lib/merge.js";

let config;

const env = process.env.NODE_ENV;

switch (env) {
    case "development":
        config = devEnv;
        break;
    case "production":
        config = prodEnv;
        break;
    default:
        config = devEnv;
}

// 将公共配置与环境配置合并，环境配置优先级更高
export default merge(commonEnv, config);