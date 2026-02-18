/**
 * server/src/config/prod.env.js - 生产环境配置
 *
 * 生产模式下只允许 127.0.0.1 跨域，
 * 因为 Electron 中前端与服务器均在同一更理机。
 */
const prodEnv = {
    /** 生产环境允许 CORS 跨域的来源列表（仅本机） */
    allowOriginList: ["http://127.0.0.1:9000"]
};
export default prodEnv;