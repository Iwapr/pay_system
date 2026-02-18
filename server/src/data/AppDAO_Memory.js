/**
 * server/src/data/AppDAO_Memory.js - 内存数据库访问层
 *
 * 使用 SQLite :memory: 模式，所有数据仅在运行期间有效，进程退出后丢失。
 * 主要用于测试、演示或需要临时存储的场景。
 * API 与 AppDAO.js 保持一致（run/get/all/each），可互换使用。
 */
import sqlite3 from "sqlite3";

class AppDAO {
    constructor() {
        // 连接内存数据库，SQLite 特殊路径 ":memory:"
        this.db = new sqlite3.Database(":memory:", (err) => {
            if (err) {
                console.log("Could not connect to database", err);
            } else {
                console.log("Connected to database");
            }
        });
    }

    /** 关闭数据库连接时的默认错误处理回调 */
    _handleCloseErr(err) {
        if (err) {
            console.log("Database close failed!", err);
        } else {
            console.log("Database close over!");
        }
    }

    /**
     * 关闭数据库连接
     * @param {Function} fn - 可选的自定义回调
     */
    close(fn = this._handleCloseErr.bind(this)) {
        this.db.close(fn);
    }

    /**
     * 执行写操作（INSERT / UPDATE / DELETE）
     * @param {string} sql   - SQL 语句
     * @param {Array}  param - 绑定参数
     * @returns {Promise<{id: number}>} 返回新插入行的 lastID
     */
    run(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID
                    });
                }
            })
        });
    }

    /**
     * 查询单条记录
     * @param {string} sql   - SQL 语句
     * @param {Array}  param - 绑定参数
     * @returns {Promise<Object|undefined>}
     */
    get(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, param, (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * 查询多条记录
     * @param {string} sql   - SQL 语句
     * @param {Array}  param - 绑定参数
     * @returns {Promise<Array>}
     */
    all(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, param, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * 逐行遍历记录
     * @param {string} sql   - SQL 语句
     * @param {Array}  param - 绑定参数
     * @returns {Promise<number>} 返回遍历的行数
     */
    each(sql, param = []) {
        return new Promise((resolve, reject) => {
            let result = [];
            this.db.get(sql, param,
                (err, row) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        result.push(row);
                    }
                },
                (err, len) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(len);
                    }
                });
        });
    }
}

export default AppDAO;
