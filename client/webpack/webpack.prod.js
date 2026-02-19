/**
 * @file webpack.prod.js
 * @description 客户端 Webpack 生产环境配置，合并公共配置并开启 production 模式进行代码压缩和优化。
 * @module client/webpack/prod
 */
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: 10
                },
                common: {
                    minChunks: 2,
                    name: "common",
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        }
    }
});