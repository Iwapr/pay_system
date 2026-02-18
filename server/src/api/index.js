/**
 * server/src/api/index.js - API 路由总入口
 *
 * 通过配置数组按顺序注册所有路由和中间件。
 *
 * 路由层级（按顺序）：
 *  1. /api/token   - 验证 token 合法性
 *  2. /api/login   - 登录（无需 token）
 *  3. auth         - 以下路由全部需要合法 token
 *  4. preventModify- Demo 模式下阻止写操作（只必要 isDemo 且环境为 DEMO 时注册）
 *  5. /api/front   - 前台收銀（收銀员可访问）
 *  6. /api/users   - 用户管理
 *  7. /api/today   - 当日销售数据
 *  8. admin        - 以下路由需要管理员权限
 *  9. /api/groups  - 用户组
 * 10. /api/market  - 营销活动
 * 11. /api/vip     - VIP 会员
 * 12. /api/warehouse - 仓库管理
 * 13. /api/data    - 数据导入导出
 * 14. /api/statistics - 统计分析
 * 15. /api/store   - 门店信息
 */
import express from "express";
import auth from "../middleware/auth.js";
import today from "./today.js";
import users from "./users.js";
import login from "./login.js";
import groups from "./groups.js";
import token from "./auth/token.js";

import warehouse from "./warehouse/index.js";
import vip from "./vip/index.js";
import front from "./front/index.js";
import market from "./market/index.js";
import admin from "../middleware/admin.js";
import data from "./data/index.js";
import statistics from "./statistics/index.js";

import store from "./store.js";

import preventModify from "../middleware/preventModify.js";

const route = express.Router();

// 判断当前是否为 Demo 模式（构建时由 webpack DefinePlugin 内联）
const isDemoMode = process.env.MODE === "DEMO";

/**
 * 路由配置列表
 * @property {string}  [path]   - 挂载路径，不传则直接使用 route.use(fn)
 * @property {Function} fn      - Express 路由处理函数或中间件
 * @property {boolean} [isDemo] - true 表示只在 Demo 模式下注册此路由
 */
const config = [
    {
        path: "/token",
        fn: token
        // 验证token合法性
    },
    {
        path: "/login",
        fn: login
        // 登录接口
    },
    {
        fn: auth
        // 路由守卫，此中间件以后的路由全部需要携带合法token
    },
    {
        fn: preventModify,
        isDemo: true
        // demo模式下阻止所有的修改操作
    },
    {
        path: "/front",
        fn: front
    },
    {
        path: "/users",
        fn: users
    },
    {
        path: "/today",
        fn: today
        // 当日销售的数据
    },
    {
        fn: admin
        // 路由守卫，此中间件以后的路由全部需要管理员权限
    },
    {
        path: "/groups",
        fn: groups
    },
    {
        path: "/market",
        fn: market
    },
    {
        path: "/vip",
        fn: vip
    },
    {
        path: "/warehouse",
        fn: warehouse
    },
    {
        path: "/data",
        fn: data
    },
    {
        path: "/statistics",
        fn: statistics
    },
    {
        path: "/store",
        fn: store
    }
];

// 逐个遍历配置并注册路由
for (let { path, fn, isDemo = false } of config) {
    // isDemo=true 应和当前必须是 Demo 模式，否则跳过此路由
    if (isDemo && !isDemoMode) continue;

    path ? route.use(path, fn) : route.use(fn);
}

export default route;