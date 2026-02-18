/**
 * client/src/routes/index.js - 前端路由配置
 *
 * 定义应用的页面路由列表。
 * isPrivate: true  表示此路由需要登录，由 ProtectRoute 包装。
 * exact: false     表示支持模糊路由（Home 页含子路由）。
 */
import { Login } from "../views/Login";
import Home from "../views/Home";

export const routes = [
    {
        path: "/home",
        component: Home,
        isPrivate: true,   // 需要登录才能访问
        exact: false       // 模糊匹配，小/home 下的子路由
    },
    {
        path: "/login",
        component: Login   // 登录页无需认证
    }
];