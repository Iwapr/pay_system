/**
 * server/src/lib/jwt.js - JWT 生成与验证工具
 *
 * 签名密钥来自环境变量 JWT_KEY（由 webpack DefinePlugin 注入）。
 * Token 默认有效期 12 小时。
 */
import jwt from "jsonwebtoken";

/** JWT 签名密钥，构建时由 webpack DefinePlugin 将字符串内联到 bundle 中 */
const privateKey = process.env.JWT_KEY;

/**
 * Jwt 工具类，提供静态方法实现 Promise 风格的 JWT 操作
 */
class Jwt {
    /**
     * 生成 JWT Token
     * @param {Object} payload - 要写入 token 的数据（如 {username, authority, isAdmin}）
     * @returns {Promise<string>} 返回签名后的 JWT 字符串
     */
    static sign(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, privateKey, {
                expiresIn: "12h"  // 过期时间 12 小时
            }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * 验证并解码 JWT Token
     * @param {string} token - 要验证的 JWT 字符串
     * @returns {Promise<Object>} 返回解码后的 payload
     * @throws 如果 token 过期或签名不符则 reject
     */
    static verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, privateKey, (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decode);
                }
            });
        });
    }
}

export default Jwt;