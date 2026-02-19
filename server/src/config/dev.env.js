/**
 * server/src/config/dev.env.js - 开发环境配置
 *
 * allowOriginList 内除 127.0.0.1 外还包含内网 IP，
 * 方便同一局域网内其他设备访问收銀台。
 */
const devEnv = {
    /** 开发环境允许 CORS 跨域的来源列表 */
    allowOriginList: [
        "http://localhost:9000",
        "http://127.0.0.1:9000",
        "http://192.168.2.50:9000",
        "http://192.168.2.38:9000",
        "http://192.168.2.39:9000"
    ]
}

export default devEnv;