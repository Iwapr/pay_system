/**
 * client/src/redux/reduces/apiUrl.js - 服务器地址 Reducer
 *
 * 管理前端请求的服务器地址（url）和连接错误信息（errors）。
 *
 * State 结构：
 *  {
 *    url: string       - API 服务器基地址（如 "http://127.0.0.1:8888/api"）
 *    errors: undefined - 连接错误信息
 *  }
 */
import { LOGIN_SET_API_URL } from "../action/actionType";

export function apiUrl(state = {
    url: "",
    errors: undefined
}, action) {
    switch (action.type) {
        case LOGIN_SET_API_URL:
            return action.data;  // 设置新的 API 地址信息
        default:
            return state;
    }
}