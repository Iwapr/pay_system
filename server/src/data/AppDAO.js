/**
 * server/src/data/AppDAO.js - SQLite 持久化数据库访问层
 *
 * 封装 sqlite3 的回调风格 API，将其包装为 Promise 风格，
 * 应用中使用 await AppDAO.run/get/all() 即可。
 *
 * 数据库文件路径座标由 config.db_path 决定，
 * 而 config.db_path 来自主进程注入的 process.env.DB_PATH。
 */
import sqlite3 from "sqlite3";
import config from "../config/index.js";

const { db_path } = config;

/**
 * Dao - SQLite 数据库操作类
 *
 * 封装了 sqlite3 的 run/get/all/each 方法，均返回 Promise。
 */
class Dao {
    /**
     * @param {string} path - 数据库文件路径，默认使用配置中的 db_path
     */
    constructor(path = db_path) {
        this.db = new sqlite3.Database(path, (err) => {
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
     * @param {Function} fn - 可选的自定义回调，默认使用 _handleCloseErr
     */
    close(fn = this._handleCloseErr.bind(this)) {
        this.db.close(fn);
    }

    /**
     * 执行写操作（INSERT / UPDATE / DELETE）
     *
     * 注意：
     *  - INSERT 成功时返回 { lastID }
     *  - UPDATE/DELETE 成功时返回 { changes }
     *
     * 警告：
     *  UPDATE/DELETE 时 lastID 有值但是上一次 INSERT 的残留值，不要使用。
     *
     * @param {string} sql    - SQL 语句
     * @param {Array}  param  - 绑定参数数组
     * @returns {Promise<{lastID?: number, changes?: number}>}
     */
    run(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const { lastID, changes, sql } = this;
                    if (sql.trim().slice(0,6) === "INSERT") {
                        // INSERT 操作返回新插入行的自增 ID
                        resolve({
                            lastID
                        });
                    } else {
                        // UPDATE/DELETE 返回受影响的行数
                        resolve({
                            changes
                        });
                    }

                    /**
                     * BUG 警告！
                     * 一定要认真看文档
                     * 当成功执行INSERT操作时，lastID是有效的，而当执行UPDATE、DELETE时changes是有效的，也就是说UPDATE/DELETE时虽然也会返回lastID，但实际上这个lastID是上一个INSERT操作所遗留的lastID
                     */
                }
            })
        });
    }

    /**
     * 查询单条记录
     * @param {string} sql   - SQL 语句
     * @param {Array}  param - 绑定参数
     * @returns {Promise<Object|undefined>} 返回消失一条记录对象，未找到则为 undefined
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
     * @returns {Promise<Array>} 返回记录数组
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
     * 逐行遍历记录（内部使用 db.get 实现，实际小项目中较少用到）
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

// 全局单例，整个服务共用同一个数据库连接
const AppDAO = new Dao();

export default AppDAO;