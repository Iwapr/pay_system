/**
 * client/src/redux/store/index.js - Redux Store 初始化
 *
 * 创建应用的唯一全局 Redux Store。
 * 支持 Redux DevTools 浏览器插件（如果已安装）。
 */
import { reduces } from "../reduces";
import { createStore } from "redux";

/**
 * 全局 Redux Store 实例
 * - 第二个参数启用 Redux DevTools 扩展（如果浏览器未安装则忽略）
 */
export const store = createStore(
    reduces,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);