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
 * @property {object} alipay                   - 支付宝当面付配置
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
    default_pos_password: "password",

    /**
     * 支付宝当面付配置
     * 在支付宝开放平台（https://open.alipay.com）创建应用后获取以下信息：
     *
     *   appId           - 应用 ID（格式：2021xxxxx）
     *   privateKey      - 商户 RSA2 私钥（PKCS8 格式，不含 -----BEGIN/END----- 头尾）
     *   alipayPublicKey - 支付宝应用公钥（在开放平台「接口加签」页面获取，用于验签）
     *   sandbox         - true=沙箱测试环境  false=生产环境
     *
     * ⚠️  正式上线前必须将此处的占位值替换为真实密钥！
     */
    alipay: {
        appId: "9021000161677341",
        privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuNkuYRdKy0U2wRiLsi/4xggCLeDVtAh/fNPhiiWNREMF5rPrYkTMYXNRcymAYgvLzBdewFdvTxMR379Ue3Ay38YdQZUv5RZ1R31e4Tba+mAxmBh7mHDaog3lEuolgme3JxyMOuniOqhaPYzjAzbDvXN1aNnbThOXM6KT42hBJT8xEbQsDKbYiaWShU8D6a90ra+BRqKNiqKaUQNVORZ5CymFns+d4Er/dKzRk8b9dru5xIuvG5xpvwLlLwAt63XPro69keB9onxMC1Nx14HXEpQfQop47xPk4LTDYGlGg+3/YUap9E46bOdr+V3GwnOnLmsfhVD+Ise3J7W8fDyhnAgMBAAECggEAdlwxM/2MTy1g6Phd1fSu+RfoItnDApLE8LNeZiQNtA/8QxzBOM49trmrFnfwnfap9W7swZe4SMKQ8SOi2lqK0ZZpZrfLzEn9vphNUsyJ8if/lHloGNLmV8srYwSRPW6XXdXL/b+3FMZ+mWDCOEwHgDjJsvb5+G98aaFOJDyTgBp2JwZOeX1leB7w691OFmxxBHIUtoDu5NYnR4ukDpYa8mgg0jnsyo6gjymAnxvWiSMOWUjI/tmrssZ9gaZp2l+C2udvDKe5gdvXMu0RnLEQoe0czuAWGQDH+p9Ekz1RSYvzEYU5+nvSSfPf3n4acR92ICgLVXmLAnw8+uezBeUv8QKBgQDU+3mLqwvV1oCBFNM65QKgywDd72yjupNZe6wr0uBvp3ozHdB8jncqVyWA17vl5ldVR+tFiDg0L4Uxb8M5yLfyAHLBrwJk3ljaQMa5n4l5CsJV+P5YvzD1L+VQ1uqa5pE9/sgyy+2hPF18UqFfcY8sJ1rdJLH0Bxn07iIrN2q+lQKBgQDRZifdxjscwrDlDPGGEt3lOKvnBkSpKcX1ROdXZsy+a6Ti2pMgX7de2PO083HFtJli7iQZgw1EihDeP++8edQceRjuPL1vVAa3/StlzuhZQ3iovDwTBfBhedBQZ0kldSZr80UTMXoeI4Cn1gzh8aHT86Andx46ME/vQBtDdW8YCwKBgEDMPb+Li69EcpZTIqzhbfpDqQDczh3GLvxjjw9KOjReLOSOZpbutTyxhNx9RlJ80QdGOUNPXWIrLwfKbAgRlD1Re5iHyV+s8jV8zbk925Jy/osvlRqlGJ0QNGFy8a+tBHVrJbemqaaLehnP/f7OyvNxCckMWAPZgUEujkC9vIE9AoGABK/vtoQocJVfFlF62pBzjRz+pBY81TiNKNdZAljXvm90amuQHYpm9WWP1v4YDt/jCxbfkf6f/mfExuTRffuQJu8DAtozN1m/KMEvBoFiLBVZjxVfluFsJxJt+k7FkWQU7xer9SkHXcNXruoYsboR8Eekzx1YfN71+xoJQjJPwU8CgYAcWyOCN/mIj6u2Y0aLe6i9nWlADCUiOcmss+Rykt31QiXkDiYVNpU16FlW/WZPd/2u08RQ+ebJLi0tmGapXA+1K3s04aQGz55n7mi52lybXVXBF/7QyK8hpD3ve3WQVniTIa+ibqLwzi2LZmTpXMiR8mGpD3A+fAJ52Qw/UIDOig==
-----END PRIVATE KEY-----`,
        alipayPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg3KPJKgRJOqV0TDR8HmPsiEHf1zrPm4DXyugJ59U83ezeHB3By4GNofAD9hbzvZaQQYOkmyCvpoHauWMHJI6xsFQQKstmwtqrHm7OXyl5VgDYAjZO88Sywq572C1Tx1Lw0FOi4dwMUQhNG2fgDFiWfwbl0uwOzg/fTwjrlgCyHkqgF9LQY/4DjyVaqrz/sJ87bDlywH4SnsT1h1eupj7Fp86CZBdYFicqo8wUjycTqABqtX39Fh1WykDxRYgLGpUnbRftg4owZjdQpmW/RK56ujYQpQIE+ot7dT8bix6cQ3mXNtCIsB+rKXgDgWspz26GvQY7yhqdqfLIUKAWbruFwIDAQAB
-----END PUBLIC KEY-----`,
        sandbox: true    // 开发阶段使用沙箱，上线改为 false
    }
}

export default common;