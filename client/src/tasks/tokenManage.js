/**
 * client/src/tasks/tokenManage.js - JWT Token 管理工具
 *
 * 提供对 sessionStorage 中 JWT Token 的读写操作，
 * 以及向服务器验证 Token 有效性的方法。
 *
 * 静态方法：
 *  - Token setter:  将 Token 写入 sessionStorage（空值则删除）
 *  - Token getter:  从 sessionStorage 读取 Token
 *  - validToken(http): 向 /api/token/auth 发送请求验证 Token 是否有效
 *  - save(t):  同 Token setter
 *  - clean():  删除 Token
 */
import { config } from "../config";

const { GLOBAL_TOKEN_KEY } = config;

export class TokenManage {
    static set Token(t) {
        if (t && t !== "") {
            sessionStorage.setItem(GLOBAL_TOKEN_KEY, t);
        } else {
            sessionStorage.removeItem(GLOBAL_TOKEN_KEY);
        }
    }

    static get Token() {
        const token = sessionStorage.getItem(GLOBAL_TOKEN_KEY);
        return (token && token !== "") ? token : undefined;
    }

    static validToken(http) {

        return http.get("/api/token/auth");
    }

    static save(t) {
        this.Token = t;
    }

    static clean() {
        this.Token = undefined;
    }
}