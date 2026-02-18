/**
 * client/src/App.jsx - 应用根组件
 *
 * 主要职责：
 *  - 封装全局 Context Provider：登录认证（AuthProvider）、API 辅助（AjaxProvider）
 *  - 配置使用 BrowserRouter 进行前端路由
 *  - 展示全局 Loading 遮罩层
 *  - 根据 routes 配置展开路由：
 *      isPrivate=true  → ProtectRoute（需登录，未登录跳转到 /login）
 *      isPrivate=false → 普通 Route
 *  - 默认 Redirect 到 /home
 */
import React from "react";
import "antd/dist/antd.css";
import "./styles/master.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { routes } from "./routes";
import { ProtectRoute } from "./routes/ProtectRoute";
import { AuthProvider } from "./views/AuthProvider";
import { AjaxProvider } from "./views/AjaxProvider";
import { Loading } from "./views/Common/Loading";

function App() {
    return (
        <BrowserRouter>
            {/* 登录认证上下文 */}
            <AuthProvider>
                {/* API 请求上下文（处理 token 失效等 */}
                <AjaxProvider>
                    {/* 全局 Loading 层 */}
                    <Loading />
                    <Switch>
                        {
                            routes.map(({ path, component, isPrivate, exact = true }, i) => (
                                isPrivate ? <ProtectRoute
                                    key={i}
                                    path={path}
                                    component={component}
                                    exact={exact}
                                /> :
                                    <Route
                                        key={i}
                                        path={path}
                                        component={component}
                                        exact
                                    />
                            ))}
                        {/* 未匹配路由自动跳转到首页 */}
                        <Redirect to="/home" />
                    </Switch>
                </AjaxProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;