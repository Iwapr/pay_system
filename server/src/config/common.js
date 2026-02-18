import path from "path";

// DB_PATH 由 main.js 在启动时注入（运行时变量，不被 webpack DefinePlugin 替换）
// app.isPackaged=true  → Contents/Resources/db/data.db
// app.isPackaged=false → <projectRoot>/server/db/data.db
const db_path = process.env.DB_PATH || path.resolve("./", "server/db/data.db");

const common = {
    port: 8888,
    db_path,
    default_admin_group_name: "管理员组",
    default_pos_group_name: "收银员组",
    default_supplier: "默认供货商",
    default_all_category: "TREE_BASE",
    default_admin_username: "admin",
    default_admin_password: "password",
    default_pos_username: "pos",
    default_pos_password: "password"
}

export default common;