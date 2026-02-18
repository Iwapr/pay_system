/**
 * main.js - Electron 主进程入口文件
 *
 * 职责：
 *  1. 创建应用主窗口（BrowserWindow）
 *  2. 启动内置 Express 服务器（public/bundle.cjs）
 *  3. 注册自定义协议（images、icon），供前端通过协议地址访问图片资源
 *  4. 根据环境注入数据库路径（DB_PATH），避免 webpack编译期替换 NODE_ENV 导致路径错误
 */

const path = require("path");       // Node.js 路径模块
const url = require("url");         // Node.js URL 模块，用于构造 file:// 地址
const fs = require("fs").promises;  // 文件系统 Promise API
const { app, BrowserWindow, protocol, globalShortcut, Menu } = require("electron");

// 全局持有窗口引用，防止被 GC 回收导致窗口意外关闭
let mainWindow;

// 移除默认系统菜单栏（File/Edit/View 等），使界面更像原生应用
Menu.setApplicationMenu(null);

/**
 * createWindow - 创建应用主窗口
 *
 * 配置：
 *  - 初始大小 1000x600
 *  - 禁用 webSecurity （允许跳转读取本地文件等跨域资源）
 *  - 开发模式下自动开启右侧 DevTools
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            webSecurity: false  // 关闭同源策略，允许前端通过 file:// 协议加载图片等资源
        },
    });

    // 开发模式加载 webpack-dev-server；生产模式加载打包后的静态文件
    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:9000");
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "./client/dist/index.html"),
            protocol: "file",
            slashes: true
        }));
    }

    // 开发模式下自动开启右侧开发者工具（生产模式下不开启）
    process.env.NODE_ENV === "development" && mainWindow.webContents.openDevTools({ mode: "right" });

    // 窗口关闭时清除全局引用，允许 GC 回收窗口对象
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

/**
 * startServer - 到启动内置 Express 服务器
 *
 * 逻辑：
 *  1. 検查 .noserver 标志文件是否存在（存在则跳过服务器启动）
 *     - 开发模式：检查项目根目录 .noserver
 *     - 生产模式：检查 asar 包外层 ../../.noserver（app 包的两层上）
 *  2. 在 require('bundle.cjs') 前将数据库绝对路径注入到 process.env.DB_PATH
 *     - app.isPackaged=true  → Contents/Resources/db/data.db
 *     - app.isPackaged=false → <项目根>/server/db/data.db
 *     注意：webook DefinePlugin 会在编译期把 NODE_ENV 替换成字符串，
 *     因此必须通过运行时注入而不是在源码中判断 NODE_ENV
 */
function startServer() {

    // 生产模式下 __dirname 是 app.asar 所在目录，需向上两层才能定位 .noserver
    const pathname = process.env.NODE_ENV === "development" ?
        path.join(__dirname, ".noserver") : path.join(__dirname, "../../.noserver");

    fs.readFile(pathname)
        .then(v => console.log("检查到不启动服务器的flag，不启动服务器！"))
        .catch(error => {
            // 注入 DB 路径，供 bundle.cjs 运行时读取（避免 webpack 编译期替换 NODE_ENV）
            if (!process.env.DB_PATH) {
                const { app } = require("electron");
                process.env.DB_PATH = app.isPackaged
                    ? path.join(process.resourcesPath, "db", "data.db")   // 打包后：Contents/Resources/db/data.db
                    : path.join(__dirname, "server", "db", "data.db");    // 开发时：<项目根>/server/db/data.db
            }
            // 先杀掉占用 8888 端口的旧进程（比如遗留的 dev nodemon），再加载服务
            const { execSync } = require("child_process");
            try {
                execSync("lsof -ti :8888 | xargs kill -9", { stdio: "ignore" });
            } catch (_) { /* 端口空闲时 xargs 返回非零码，忽略即可 */ }
            require("./public/bundle.cjs");  // 加载并启动 Express 服务器
        });
}

// Electron 初始化完成后触发 ready 事件再创建窗口
app.on("ready", () => {

    // 启动内置服务器
    startServer();

    /**
     * 注册自定义协议 "images://"
     * 前端中对应 url 是: images://<相对路径>
     * 实际映射到 client/dist/<相对路径>
     */
    protocol.registerFileProtocol("images", (req, cb) => {
        const url = req.url.substr(9);  // 去掉 "images://" 头部（9个字符）

        cb({
            path: path.normalize(`${__dirname}/client/dist/${url}`)
        })
    });

    /**
     * 注册自定义协议 "icon://"
     * 前端中对应 url 是: icon://<相对路径>
     * 实际映射到 client/dist/<相对路径>
     */
    protocol.registerFileProtocol("icon", (req, cb) => {
        const url = req.url.substr(7);  // 去掉 "icon://" 头部（7个字符）

        cb({
            path: path.normalize(`${__dirname}/client/dist/${url}`)
        })
    });

    // 屏蔽 Ctrl+R / Cmd+R 的默认刷新行为，防止用户错误刷新导致页面白屏
    globalShortcut.register("CmdOrCtrl+R", () => { });

    // 初始化完成后创建主窗口
    createWindow();
});

// 所有窗口关闭时退出应用
// macOS 上不退出，允许用户又回到 Dock 重新开启
app.on("window-all-closed", function () {
    // macOS 上用户主动 Cmd+Q 才退出，其他平台直接退出
    if (process.platform !== "darwin") app.quit();
});

// app.on("activate", function () {
//     // On macOS it"s common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (mainWindow === null) createWindow();
// });

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
