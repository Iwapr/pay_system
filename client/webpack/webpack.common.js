/**
 * @file webpack.common.js
 * @description 客户端 Webpack 公共基础配置，包含入口文件、Babel转译、CSS/SCSS 处理、
 * HTML 模板生成、静态资源复制等公用配置项，供开发和生产环境共同继承。
 * @module client/webpack/common
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: path.resolve("./", "src/index.js"),
    output: {
        path: path.resolve("./", "dist/"),
        filename: "static/js/[name].bundle.js",
        chunkFilename: "static/js/[name].chunk.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            esModule: false,
                            name: "static/images/[path][name].[ext]"
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[path][name]__[local]--[hash:base64:5]"
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            api: "modern"
                        }
                    },
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    },
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
            "process.env.TYPE": JSON.stringify(process.env.TYPE || "")
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve("./", "src/public/index.html"),
            filename: "./index.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/public/iconfontcn.js",
                    to: "static/js/iconfontcn.js"
                }
            ]
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    }
};