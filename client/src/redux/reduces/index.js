/**
 * client/src/redux/reduces/index.js - 根 Reducer
 *
 * 使用 combineReducers 将所有子 Reducer 组合为一个根 Reducer。
 *
 * 全局 State 结构：
 *  {
 *    apiUrl:       { url, errors }                    - 服务器地址配置
 *    userDetails:  { username, authority, isLogin, isAdmin } - 用户信息
 *    tabs:         { currentPath, openTabs }           - 已开页签列表
 *    showTabs:     boolean                             - 是否显示多标签页
 *    showCashHotKey: boolean                           - 是否显示收銀热键
 *    cash:         { currentOrder, historyOrder, hangupOrders } - 收銀状态
 *    warehouse:    { categories, commodity, stock }    - 仓库管理状态
 *    store_name:   string                              - 店铺名称
 *  }
 */
import { combineReducers } from "redux";
import { apiUrl } from "./apiUrl";
import { tabs, showTabs } from "./tabs";
import { userDetails } from "./userDetails";
import { showCashHotKey, cash } from "./cash";
import { warehouse } from "./warehouse";
import { store_name } from "./store";

export const reduces = combineReducers({
    apiUrl,        // 服务器地址配置
    userDetails,   // 当前登录用户信息
    tabs,          // 已开标签页列表
    showTabs,      // 是否展示多标签页
    showCashHotKey, // 是否展示收銀热键
    cash,          // 收銀模块状态（当前订单/历史订单/挂起订单）
    warehouse,     // 仓库管理（分类/商品/进货单）
    store_name     // 店铺名称
});