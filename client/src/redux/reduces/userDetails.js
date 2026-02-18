/**
 * client/src/redux/reduces/userDetails.js - 登录用户信息 Reducer
 *
 * 管理当前登录用户的帐号、权限、登录状态信息。
 *
 * State 结构：
 *  {
 *    username:  string   - 登录用户名
 *    authority: string[] - 权限列表（如 ['admin', 'cashier']）
 *    isLogin:   boolean  - 是否已登录
 *    isAdmin:   boolean  - 是否是管理员
 *  }
 *
 * 支持的 Action：
 *  - SET_USER_DETAILS:                  批量合并更新多个字段
 *  - USER_SET_IS_ADMIN:                 设置是否为管理员
 *  - LOGIN_SET_USER_IS_LOGIN:           设置登录状态
 *  - LOGIN_SET_CURRENT_USERNAME:        设置用户名
 *  - LOGIN_SET_CURRENT_USER_AUTHORITY:  设置权限列表
 *  - CLEAR_USER_STATE:                  重置（退出登录）
 */
import {
    USER_SET_IS_ADMIN,
    CLEAR_USER_STATE,
    LOGIN_SET_USER_IS_LOGIN,
    LOGIN_SET_CURRENT_USERNAME,
    LOGIN_SET_CURRENT_USER_AUTHORITY,
    SET_USER_DETAILS
} from "../action/actionType";

/** 初始状态 */
const initValue = {
    username: "",
    authority: [],
    isLogin: false,
    isAdmin: false
}

export function userDetails(state = initValue, action) {

    /**
     * 辅助函数 - 浅层合并状态
     * 確保 authority 数组总是返回新引用，避免直接共享旧引用
     * @param {object} update_state - 需要更新的字段
     */
    function mergeState(update_state) {
        return Object.assign({}, state, {
            authority: [...state.authority],
            ...update_state,
        })
    }

    switch (action.type) {
        case SET_USER_DETAILS:
            // 批量写入多个字段（登录成功后一次性初始化用户信息时使用）
            return (() => {
                const { value } = action;
                const keys = Object.keys(value);
                const update_state = {};
                for (let key of keys) {
                    update_state[key] = value[key];
                }

                return mergeState(update_state);
            })();
        case USER_SET_IS_ADMIN:
            return mergeState({
                isAdmin: action.isAdmin
            });
        case LOGIN_SET_USER_IS_LOGIN:
            return mergeState({
                isLogin: action.login
            });
        case LOGIN_SET_CURRENT_USERNAME:
            return mergeState({
                username: action.username
            });
        case LOGIN_SET_CURRENT_USER_AUTHORITY:
            return mergeState({
                authority: action.authority
            });
        case CLEAR_USER_STATE:
            // 用户退出登录，清空所有用户信息
            return initValue;
        default:
            return state;
    }
}