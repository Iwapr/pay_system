/**
 * client/src/redux/reduces/store.js - 店铺名称 Reducer
 *
 * 管理店铺名称全局状态。
 * 店铺名称在登录成功后从服务器返回并设置到 Store。
 */
import { SET_STORE_NAME } from "../action/actionType";

/**
 * store_name Reducer
 * @param {string} state  - 店铺名称，默认小牧超市
 * @param {Object} action
 * @returns {string}
 */
export function store_name(state = "小牧超市", action) {

    switch (action.type) {
        case SET_STORE_NAME:
            return action.name;  // 更新店铺名称
        default:
            return state;
    }
}