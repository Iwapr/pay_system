/**
 * @file webpack.prod.cjs
 * @description 服务端 Webpack 生产环境构建配置。
 * 将 Express 服务端代码打包为单个 bundle.cjs 文件，
 * 通过环境变量注入 JWT_KEY 和 MODE，并使用 webpack-node-externals 排除 node_modules 依赖。
 * @module server/webpack.prod
 */
const path = require("path");
const _externals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = env => {
    const { JWT_KEY, MODE } = env;

    return {
        entry: path.resolve("./", "src/index.js"),
        mode: "production",
        output: {
            path: MODE === "DEMO" ? path.resolve("./dist") : path.resolve("./", "../", "public/"),
            filename: "bundle.cjs"
        },
        target: "node",
        externals: _externals(),
        plugins: [
            new webpack.DefinePlugin({
                "process.env.JWT_KEY": JSON.stringify(JWT_KEY),
                "process.env.MODE": JSON.stringify(MODE || "NOTMODE")
            })
        ]
    };
}