/**
 * client/src/index.js - React 应用程序入口
 *
 * 将 React 应用挂载到 HTML 页面中 id="root" 的元素上。
 * 配置了：
 *  - Ant Design 简体中文语言包
 *  - Redux Provider（全局状态管理）
 */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN"; // 使用中文语言包，表单提示、日期输入面板等展示中文
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render((
    <ConfigProvider locale={zhCN}>
        {/* 提供全局 Redux 状态 */}
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider >
), document.getElementById("root"));