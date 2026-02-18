/**
 * @file webpack.prod.js
 * @description 客户端 Webpack 生产环境配置，合并公共配置并开启 production 模式进行代码压缩和优化。
 * @module client/webpack/prod
 */
const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "production",
});