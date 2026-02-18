/**
 * client/src/routes/ProtectRoute.jsx - 路由鲁棒组件
 *
 * 用于保护需要登录才能访问的页面。
 *
 * 逻辑：
 *  - 首次进入应用（flag=true）：判断 localStorage 中是否有缓存的 Token
 *  - 应用已运行中（flag=false）：判断 Redux 中 isLogin 状态
 *  - 验证通过 → 渲染目标路由组件
 *  - 验证失败 → Redirect 到 /login°并保留来源路由
 */
import React from "react";
// import { message } from "antd";
import { Route, Redirect } from "react-router-dom";
import { TokenManage } from "../tasks/tokenManage";
import { useAuth } from "../views/AuthProvider";

let flag = true;
// 是否是首次打开应用（首次打开时 Redux 中 isLogin 还未被恢复，需要通过 Token 判断）

/**
 * @param {React.ComponentType} component - 要渲染的路由组件
 * @param {string} path - 路由路径
 */
function ProtectRoute({ component: Component, path, ...rest }) {
    const token = TokenManage.Token;
    const { isLogin } = useAuth();
    let bool = true;

    if (flag) {
        // 首次进入：检查 Token 是否存在
        flag = false; // 到达这里后后续判断通过 isLogin
        if (!token) {
            bool = false;
        }
    } else {
        // 应用已运行中：检查 Redux 登录状态
        if (!isLogin) {
            bool = false;
        }
    }

    return bool ? (<Route {...rest} component={Component} />) : (
        <Redirect from={path} to={{
            pathname: "/login",
            state: {
                from: path  // 登录后可自动跳转回来源路由
            }
        }} />);
}


export { ProtectRoute };
export default ProtectRoute;