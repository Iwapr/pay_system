/**
 * server/src/config/common.js - 服务器公共配置
 *
 * DB_PATH 由 main.js 在启动时计算并注入到 process.env.DB_PATH，
 * 而不是在源码中判断 NODE_ENV。
 * 原因：webpack build 时会用 DefinePlugin 把 process.env.NODE_ENV
 * 在编译期静态替换为字符串，导致运行时判断失效。
 */
import path from "path";

// DB_PATH 由 main.js 在启动时注入（运行时变量，不被 webpack DefinePlugin 替换）
// app.isPackaged=true  → Contents/Resources/db/data.db
// app.isPackaged=false → <projectRoot>/server/db/data.db
const db_path = process.env.DB_PATH || path.resolve("./", "server/db/data.db");

/**
 * 公共配置项
 * @property {number} port                     - 服务器监听端口
 * @property {string} db_path                  - SQLite 数据库文件完整路径
 * @property {string} default_admin_group_name - 默认管理员组名称
 * @property {string} default_pos_group_name   - 默认收银员组名称
 * @property {string} default_supplier         - 默认供货商名称
 * @property {string} default_all_category     - 所有分类树根节点的标识符
 * @property {string} default_admin_username   - 默认管理员登录账号
 * @property {string} default_admin_password   - 默认管理员登录密码
 * @property {string} default_pos_username     - 默认收银员登录账号
 * @property {string} default_pos_password     - 默认收银员登录密码
 */
const common = {
    port: 8888,
    db_path,
    default_admin_group_name: "管理员组",
    default_pos_group_name: "收银员组",
    default_supplier: "默认供货商",
    default_all_category: "TREE_BASE",    // 分类树根节点的唯一标识符
    default_admin_username: "admin",
    default_admin_password: "password",
    default_pos_username: "pos",
    default_pos_password: "password"
}

export default common;