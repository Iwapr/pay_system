/**
 * @file webpack.dev.js
 * @description 客户端 Webpack 开发环境配置，合并公共配置后启用 eval-source-map、
 * webpack-dev-server 热更新，自动代理 /api 请求到本地服务器。
 * @module client/webpack/dev
 */
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: {
            directory: path.resolve("./", "dist")
        },
        compress: true,
        port: 9000,
        host: "0.0.0.0",
        historyApiFallback: true
    }
});