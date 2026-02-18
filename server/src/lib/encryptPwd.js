/**
 * server/src/lib/encryptPwd.js - 密码加密工具
 *
 * 基于 bcryptjs 实现密码的生成和校验。
 * bcryptjs 是纯 JS 实现，在 Electron 环境下不需要原生编译，比 bcrypt 更安全。
 * saltRounds 词赊次数越高越安全，但哈希计算越慢。
 */
import bcrypt from "bcryptjs";

/** bcrypt 密码哈希词赊次数，10 次为安全平衡点 */
const saltRounds = 10;

/**
 * 生成盐值（通常不需要外部调用，genHash 内部自动生成）
 * @returns {Promise<string>} 包含成本因子的盐值字符串
 */
export async function genSalt() {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                resolve(salt);
            }
        });
    })
}

/**
 * 将明文密码哈希化
 * @param {string} plaintextPwd - 明文密码
 * @returns {Promise<string>} bcrypt 哈希字符串
 */
export async function genHash(plaintextPwd) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPwd, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        })
    })
}

/**
 * 验证明文密码与哈希是否匹配
 * @param {string} plaintextpwd - 用户输入的明文密码
 * @param {string} encrypted    - 数据库中存储的 bcrypt 哈希
 * @returns {Promise<boolean>}  匹配返回 true，不匹配返回 false
 */
export async function validateData(plaintextpwd, encrypted) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextpwd, encrypted, (err, same) => {
            if (err) {
                reject(err);
            } else {
                resolve(same);
            }
        });
    });
}