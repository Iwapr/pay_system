/**
 * server/src/index.js - Express 服务器入口
 *
 * 大致逻辑：
 *  1. 初始化 Express，配置跨域（CORS）中间件
 *  2. 解析 JSON 请求体（最大 50MB，应对大批量商品导入）
 *  3. 挂载 /api 路由
 *  4. 全局错误处理
 *  5. 监听指定端口（默认 8888）
 */
import express from "express";
import config from "./config/index.js";
import api from "./api/index.js";
import handleError from "./middleware/handleError.js";

const { port, allowOriginList } = config;
const app = express();

/**
 * CORS 跨域中间件
 *
 * - 只允许 allowOriginList 中配置的来源访问
 * - 返回必要的 CORS 响应头
 * - OPTIONS 预检请求直接返回 200，其余请求继续流转
 */
app.use((req, res, next) => {
    const { origin } = req.headers;
    if (allowOriginList.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);                           // 允许的来源
        res.header("Access-Control-Allow-Headers", "Authorization,content-type");   // 允许的请求头
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");  // 允许的 HTTP 方法
        res.header("Access-Control-Max-Age", "43200");                              // 预检缓存 12 小时（12h）

        if (req.method === "OPTIONS") {
            // 预检请求直接返回 200，不继续到业务路由
            res.sendStatus(200);
        } else {
            next();
        }
    } else {
        // 非白名单来源的请求不添加 CORS 头，但不拦截（同源请求正常处理）
        next();
    }
});

// 解析 JSON 请求体，限制最大 50MB（支持大批量导入场景）
app.use(express.json({
    limit: "50MB"
}));

// 根路由：所有 /api 开头的请求都由 api 模块处理
app.use("/api", api);

// 未匹配任何路由就返回 400 提示错误请求
app.use("*", (req, res) => {
    res.status(400).send({
        message: "错误请求!"
    })
});

// 全局错误处理中间件（必须放在最后）
app.use(handleError);

// 启动监听
app.listen(port, () => {
    console.log(`Server Listen on port ${port}...`);
});