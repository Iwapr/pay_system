# 小牧 POS 系统 — 项目结构全解析

## 目录
1. [项目概览](#1-项目概览)
2. [技术栈](#2-技术栈)
3. [顶层目录结构](#3-顶层目录结构)
4. [主进程：main.js](#4-主进程mainjs)
5. [服务端：server/](#5-服务端server)
6. [客户端：client/](#6-客户端client)
7. [数据流向图](#7-数据流向图)
8. [功能模块速查表](#8-功能模块速查表)
9. [开发 & 生产启动方式](#9-开发--生产启动方式)

---

## 1. 项目概览

这是一套基于 **Electron** 的桌面 POS（收银）系统，包含：
- **前台收银**：商品扫码/搜索、购物车、结算、会员积分、历史订单
- **后台管理**：仓储/商品/供应商/库存、促销活动、会员管理、数据统计、用户权限
- **外设支持**：小票打印机（POS）、条码标签打印、电子秤、客显屏、钱箱

整个系统的架构是：

```
Electron 主进程（main.js）
  ├── 内置 Express HTTP 服务器（server/）  ← 提供 REST API
  └── BrowserWindow 渲染进程（client/）   ← React SPA 前端
```

---

## 2. 技术栈

| 层 | 技术 |
|---|---|
| 桌面容器 | Electron 29 |
| 前端框架 | React 16 + Redux |
| 前端打包 | Webpack 4 + Babel |
| 后端框架 | Express 4（ESM 模块） |
| 数据库 | SQLite3（better-sqlite3 风格的回调 API） |
| 参数校验 | @hapi/joi 16 |
| 鉴权 | JWT（jsonwebtoken + bcryptjs） |
| 外设通信 | Node.js SerialPort（串口） |
| 样式 | SCSS（Sass） |

---

## 3. 顶层目录结构

```
pay_system/
├── main.js            # Electron 主进程入口（唯一的 CJS 文件）
├── package.json       # 根依赖（electron、electron-builder）
├── .noserver          # 开发模式标志：存在时 Electron 不启动内置服务器
├── public/
│   └── bundle.cjs     # server/ 的 webpack 生产构建产物，Electron 生产模式加载它
├── client/            # React 前端（独立 npm 工程）
└── server/            # Express 后端（独立 npm 工程）
```

> **关键理解**：`public/bundle.cjs` 是 `server/` 打包后的产物。
> - **生产模式**：`main.js` 直接 `require('./public/bundle.cjs')` 启动服务器
> - **开发模式**：项目根存在 `.noserver` 文件，跳过此步骤，服务器单独用 `nodemon` 运行

---

## 4. 主进程：main.js

> 路径：`/pay_system/main.js`

Electron 启动的第一个文件，运行在 Node.js 环境（非浏览器）。

### 主要职责

| 函数 | 作用 |
|---|---|
| `createWindow()` | 创建 1000×600 的 BrowserWindow 主窗口 |
| `startServer()` | 检测 `.noserver` 标志，决定是否加载 `bundle.cjs` 启动内置服务器 |

### 关键逻辑

```
app.ready
  ├── startServer()
  │     ├── 有 .noserver → 跳过（开发模式，服务器已单独启动）
  │     └── 无 .noserver → require('./public/bundle.cjs')（生产模式）
  ├── 注册 images:// 协议 → 映射到 client/dist/*.{png,jpg}
  ├── 注册 icon:// 协议   → 映射到 client/dist/*.svg
  └── createWindow()
        ├── NODE_ENV=development → loadURL('http://localhost:9000')
        └── NODE_ENV=production  → loadURL('file://client/dist/index.html')
```

### 数据库路径注入
`DB_PATH` 在 `require(bundle.cjs)` 之前写入 `process.env`，而不是在源码里判断 `NODE_ENV`。
原因：webpack 的 `DefinePlugin` 会在编译期把 `NODE_ENV` 替换成字符串常量，导致生产包里的路径判断失效。

---

## 5. 服务端：server/

```
server/
├── package.json
├── webpack.prod.cjs       # 打包配置：把 src/ 编译为 ../public/bundle.cjs
├── tools/
│   ├── initDB.js          # 一次性脚本：建表 + 写入默认数据
│   └── fakeData.js        # 一次性脚本：生成测试用假数据
├── db/
│   └── data.db            # SQLite 数据库文件（运行时产生）
└── src/
    ├── index.js           # Express 入口：CORS、路由挂载、错误兜底
    ├── config/            # 配置
    ├── api/               # 路由处理器（控制层）
    ├── schema/            # 入参校验规则（Joi）
    ├── middleware/        # 通用中间件
    ├── data/              # 数据库访问层（DAO）
    ├── lib/               # 工具函数库
    └── tasks/             # 定时任务
```

### 5.1 config/ — 配置

| 文件 | 内容 |
|---|---|
| `common.js` | 端口(8888)、db_path、各种默认值（管理员账号密码、默认供应商等） |
| `dev.env.js` | 开发环境 CORS 白名单（127.0.0.1:9000、局域网 IP） |
| `prod.env.js` | 生产环境 CORS 白名单 |
| `index.js` | 根据 `NODE_ENV` 合并 common + dev/prod，统一导出 |

### 5.2 api/ — 路由层

所有接口挂载在 `/api` 前缀下，按业务领域拆分子路由：

```
api/
├── index.js          # 汇总所有子路由
├── login.js          # POST /api/login — 账号密码登录，返回 JWT
├── store.js          # GET/PUT /api/store — 门店信息
├── groups.js         # /api/groups — 权限组 CRUD
├── users.js          # /api/users — 系统用户 CRUD
├── today.js          # GET /api/today — 今日营业数据（总销售额、订单数等）
├── auth/             # /api/auth — JWT 刷新 token
├── front/            # /api/front — 前台收银相关
│   ├── index.js      #   商品搜索（扫码/关键字）
│   ├── order.js      #   提交订单、撤单、历史订单查询
│   ├── commodity.js  #   收银台商品信息
│   └── vip_member.js #   收银台扫会员码、改积分
├── warehouse/        # /api/warehouse — 仓储管理
│   ├── index.js      #   路由汇总
│   ├── categories.js #   商品分类 CRUD（树形结构）
│   ├── commodity.js  #   商品 CRUD（含图片 base64）
│   ├── stock.js      #   进货记录
│   └── suppliers.js  #   供应商 CRUD
├── market/           # /api/market — 促销活动
│   ├── index.js
│   └── promotion/    #   促销规则 & 促销商品管理
├── vip/              # /api/vip — 会员系统
│   ├── index.js
│   └── members.js    #   会员 CRUD、积分查询
├── statistics/       # /api/statistics — 数据统计
│   ├── index.js
│   ├── orders.js     #   订单列表（按时间段筛选）
│   ├── proportion.js #   商品销售占比（饼图数据）
│   └── trends.js     #   销售趋势（折线图数据）
└── data/             # /api/data — 数据管理
    ├── index.js
    ├── import_data.js #  批量导入商品（JSON/Excel 解析后写库）
    └── export_data.js #  导出全量数据为 JSON
```

### 5.3 schema/ — 入参校验

用 Joi 定义每个接口的请求体结构，中间件自动校验，不通过直接返回 400。

| 文件 | 校验对象 |
|---|---|
| `categories.js` | 分类名称（1-6字符） |
| `commodity.js` | 商品信息（名称、价格、分类、供应商等） |
| `suppliers.js` | 供应商名称（2-10字符，带中文错误提示） |
| `stock.js` | 进货数量、商品 ID |
| `orders.js` | 订单结构（商品列表、支付方式等） |
| `promotion.js` | 促销规则（折扣率、满减阈值等） |
| `statistics.js` | 统计查询（时间戳范围、查询类型） |
| `vip_member.js` | 会员信息（4-10位数字码、姓名、手机） |
| `user.js` | 系统用户（用户名、密码） |
| `store.js` | 门店名称 |
| `data.js` | 数据导入格式 |

### 5.4 middleware/ — 中间件

| 文件 | 功能 |
|---|---|
| `auth.js` | JWT 鉴权：验证 `Authorization: Bearer <token>`，失败返回 401 |
| `admin.js` | 管理员权限校验：非管理员组返回 403 |
| `validBody.js` | 接收 Joi schema 参数，对 `req.body` 执行校验 |
| `handleError.js` | 全局兜底错误处理：统一返回 500 + 错误信息 |
| `preventModify.js` | 防修改中间件：演示模式下禁止写操作 |

### 5.5 data/ — 数据访问层（DAO）

| 文件 | 功能 |
|---|---|
| `AppDAO.js` | 真实 SQLite 操作：封装 `run`、`get`、`all`、`each` 方法，统一 Promise 化 |
| `AppDAO_Memory.js` | 内存版 DAO（用于测试/演示，无需数据库文件） |

所有 API 文件通过 `import db from '../data/AppDAO.js'` 获取 DAO 实例，用 `db.run(sql, params)` 等方法操作数据库。

### 5.6 lib/ — 工具函数

| 文件 | 功能 |
|---|---|
| `jwt.js` | 生成 / 验证 JWT token |
| `encryptPwd.js` | bcrypt 密码加密 & 校验 |
| `time.js` | 时间戳工具：获取当天/本周/本月起止时间戳、格式化时间字符串 |
| `mathc.js` | 精确浮点运算（加减乘除，避免 JS 浮点精度问题） |
| `merge.js` | 深度合并对象 |
| `pinyin.js` | 汉字转拼音（用于商品搜索时生成拼音索引） |

### 5.7 tasks/ — 定时任务

服务启动时注册的后台任务（如：每天凌晨清理过期促销活动等）。

---

## 6. 客户端：client/

```
client/
├── package.json
├── src/
│   ├── index.js           # React 入口：挂载 <App /> 到 #root
│   ├── App.jsx            # 顶层路由：/ → Login，/ → Home（鉴权保护）
│   ├── config/            # 前端环境配置
│   ├── components/        # 通用 UI 组件
│   ├── hooks/             # 自定义 React Hooks
│   ├── redux/             # 全局状态管理
│   ├── routes/            # 路由配置
│   ├── tasks/             # API 请求封装
│   ├── tools/             # 纯函数工具库
│   ├── styles/            # 全局 SCSS 样式
│   ├── device/            # 串口外设驱动
│   ├── views/             # 页面组件
│   └── public/            # 静态资源（HTML 模板、iconfont）
└── webpack/               # webpack 构建配置
```

### 6.1 config/ — 前端环境配置

| 文件 | 内容 |
|---|---|
| `common.env.js` | 公共配置（API 基础 URL 等） |
| `dev.env.js` | 开发环境配置（`baseURL: http://127.0.0.1:8888`） |
| `prod.env.js` | 生产环境配置 |
| `index.js` | 根据 `NODE_ENV` 导出合并后的配置 |

### 6.2 tasks/ — API 请求层

每个文件对应一组业务接口，封装 `axios` 请求，供 Redux action 或组件调用：

| 文件 | 对应后端路由 |
|---|---|
| `tokenManage.js` | `/api/login`、`/api/auth`（登录 & 刷新 token） |
| `store.js` | `/api/store`（门店信息） |
| `today.js` | `/api/today`（今日概览） |
| `commodity.js` | `/api/front/commodity`（收银台商品） |
| `frontOrder.js` | `/api/front/order`（收银台下单） |
| `categories.js` | `/api/warehouse/categories` |
| `supplier.js` | `/api/warehouse/suppliers` |
| `stock.js` | `/api/warehouse/stock` |
| `groups.js` | `/api/groups` |
| `Users.js` | `/api/users` |
| `vip.js` | `/api/vip/members` |
| `promotion.js` | `/api/market/promotion` |
| `statistics.js` | `/api/statistics/*` |
| `data.js` | `/api/data/*`（导入/导出） |
| `setConnectConfig.js` | 保存外设连接参数到 localStorage |

### 6.3 redux/ — 全局状态

**action/actionType.js** — 所有 Redux action 的类型常量（约 170 个），按模块分组：
- `STORE_*`：门店信息
- `TABS_*`：多标签页状态
- `CASH_*`：收银台状态（购物车、选中商品、历史订单等）
- `WARE_CATEGORY_*`：商品分类树
- `WARE_COMMODITY_*`：商品列表
- `WARE_STOCK_*`：库存/进货

**action/index.js** — Action Creator 函数，返回标准 `{ type, payload }` 对象

**reduces/** — Reducer 函数（纯函数，处理 state 变更）：

| 文件 | 管理的 state |
|---|---|
| `apiUrl.js` | 后端接口 base URL |
| `cash.js` | 收银台：购物车商品、总价、历史订单、当前选中单等 |
| `store.js` | 门店信息（名称、logo 等） |
| `tabs.js` | 顶部多标签页（打开的页面列表、当前激活标签） |
| `userDetails.js` | 当前登录用户信息（用户名、权限组） |
| `warehouse/categories.js` | 分类树结构 |
| `warehouse/commodity.js` | 商品列表 |
| `warehouse/stock.js` | 库存记录 |
| `index.js` | `combineReducers` 合并所有子 reducer |

**store/** — `createStore` + `redux-thunk` 中间件

### 6.4 hooks/ — 自定义 Hooks

| 文件 | 作用 |
|---|---|
| `useCategories.jsx` | 获取并维护分类树（含懒加载、展开/折叠状态） |
| `usePosprint.jsx` | 打印小票：调用串口驱动输出 ESC/POS 指令 |
| `useSerialport.jsx` | 封装 SerialPort 连接/断开/监听数据逻辑 |

### 6.5 components/ — 通用 UI 组件

| 文件 | 作用 |
|---|---|
| `LoadingBox.jsx` | 全屏/局部加载遮罩 |
| `CustomSelectTree.jsx` | 树形下拉选择框（用于选择商品分类） |
| `VirtualSelectList.jsx` | 虚拟滚动下拉列表（大数据量时性能优化） |
| `SupplierSelect.jsx` | 供应商搜索下拉 |
| `IconOnline.jsx` | 阿里巴巴 iconfont 在线图标组件 |

### 6.6 device/ — 外设驱动

> 所有外设通过 **Node.js SerialPort** 进行串口通信（Electron 渲染进程有 Node API 访问权）

| 目录 | 设备 | 通信协议 |
|---|---|---|
| `pos_print/` | 热敏小票打印机 | ESC/POS 指令集 |
| `commodity_tag_print/` | 条码标签打印机 | ZPL 或类似标签语言 |
| `scale/` | 电子秤 | 串口数据读取（连续上抛重量值） |
| `client_display/` | 客显屏（顾客显示器） | 串口写入商品/金额等信息 |
| `money_box/` | 钱箱 | 通过打印机接口触发开箱指令 |

### 6.7 views/ — 页面组件

```
views/
├── Login/             # 登录页
│   └── index.jsx      #   账号密码表单 → 调用 tokenManage.login
├── AjaxProvider/      # 全局 axios 拦截器（注入 JWT header、token 过期自动刷新）
├── AuthProvider/      # 权限上下文（判断当前用户是否有某功能权限）
├── Common/            # 共用页面组件（NotFound、权限不足提示等）
└── Home/              # 登录后的主布局
    ├── index.jsx      #   主框架：侧边栏 + 多标签页 + 内容区
    ├── menus.js       #   菜单配置（路径、图标、组件映射关系）
    ├── MultipleTabs.jsx  # 顶部多标签页栏
    ├── TabsProvider.jsx  # 标签页上下文
    ├── Header/        #   顶部栏（门店名、用户信息、退出登录）
    ├── LeftSideMenu/  #   左侧折叠菜单（根据权限过滤菜单项）
    └── Main/          #   各功能模块页面
        ├── home/      #   系统主页（今日销售额、订单数等概览）
        ├── market/
        │   └── Cash/  #   ★ 前台收银（最核心模块，见下方详解）
        ├── warehouse/ #   仓储管理
        │   ├── Supplier/     供应商列表 + 增删改
        │   ├── Commodity/    商品列表 + 增删改 + 图片上传
        │   ├── Stock/        进货记录 + 新增进货
        │   └── BarcodePrint/ 商品条码标签批量打印
        ├── vip/       #   会员管理
        │   ├── index.jsx     会员列表 + 搜索 + 换卡
        │   └── Setting/      积分规则设置
        ├── promotion/ #   促销管理
        │   ├── Manage/       活动列表 + 新增/编辑（折扣/满减）
        │   └── Commodity/    活动商品关联管理
        ├── statistics/#   数据统计
        │   ├── orders/       订单明细表格（时间段筛选 + 导出）
        │   ├── proportion/   分类销售占比饼图（ECharts）
        │   └── trends/       销售趋势折线图（ECharts）
        ├── users/     #   用户管理（账号 + 所属权限组）
        ├── data/      #   数据管理
        │   ├── Import/       Excel/JSON 商品批量导入
        │   └── Export/       全量数据导出为 JSON
        ├── device/    #   设备管理（配置外设串口参数）
        └── system/    #   系统设置（门店信息、Logo 上传等）
```

#### 前台收银模块（最核心）

```
market/Cash/
├── index.jsx          # 收银台根组件：左右分栏布局
├── CashLeft/          # 左侧：商品搜索 + 购物车
│   ├── index.jsx      #   购物车商品列表、数量加减、删除
│   ├── CashVipDetails.jsx # 会员信息卡片（积分、等级）
│   └── ...
├── CashRight.jsx      # 右侧：商品展示区（分类过滤 + 点击加入购物车）
└── Dialog/            # 弹窗组件
    ├── PayDialog/     #   结算弹窗（现金/扫码支付、找零计算）
    ├── HistoryDialog/ #   历史订单查询 & 撤单
    └── VipDialog/     #   扫会员码弹窗
```

### 6.8 webpack/ — 构建配置

| 文件 | 用途 |
|---|---|
| `webpack.common.js` | 公共配置：babel-loader、scss-loader、图片处理 |
| `webpack.dev.js` | 开发配置：合并 common，启动 webpack-dev-server（port 9000，HMR） |
| `webpack.prod.js` | 生产构建配置：代码压缩、hash 文件名 |
| `webpack.electron.js` | Electron 生产构建：禁用 code split，适配 file:// 协议加载 |

---

## 7. 数据流向图

```
用户操作（点击/输入）
      │
      ▼
  React 组件
      │ dispatch(action)
      ▼
  Redux Store ──── reducer 更新 state ────► 组件 re-render
      │
      │（部分操作需要与服务器交互）
      │ axios 请求
      ▼
  tasks/ 请求函数（封装了接口路径）
      │
      ▼
  AjaxProvider（axios 拦截器注入 JWT token）
      │
      ▼
  Express API（server/src/api/）
      │
      │ validBody 中间件校验入参
      │ auth 中间件验证 JWT
      ▼
  数据库操作（AppDAO.js → SQLite data.db）
      │
      ▼
  JSON 响应返回前端
```

---

## 8. 功能模块速查表

> 新增/修改某功能时，需要同时改这几个文件：

| 功能 | 前端组件 | 前端 task | Redux reducer | 后端 API | 后端 schema |
|---|---|---|---|---|---|
| 商品管理 | `views/Home/Main/warehouse/Commodity/` | `tasks/commodity.js` | `reduces/warehouse/commodity.js` | `api/warehouse/commodity.js` | `schema/commodity.js` |
| 分类管理 | `views/Home/Main/warehouse/` | `tasks/categories.js` | `reduces/warehouse/categories.js` | `api/warehouse/categories.js` | `schema/categories.js` |
| 前台收银 | `views/Home/Main/market/Cash/` | `tasks/frontOrder.js` | `reduces/cash.js` | `api/front/order.js` | `schema/orders.js` |
| 会员管理 | `views/Home/Main/vip/` | `tasks/vip.js` | ——（直接请求） | `api/vip/members.js` | `schema/vip_member.js` |
| 促销活动 | `views/Home/Main/promotion/` | `tasks/promotion.js` | ——（直接请求） | `api/market/promotion/` | `schema/promotion.js` |
| 数据统计 | `views/Home/Main/statistics/` | `tasks/statistics.js` | ——（直接请求） | `api/statistics/` | `schema/statistics.js` |
| 用户权限 | `views/Home/Main/users/` | `tasks/Users.js` | `reduces/userDetails.js` | `api/users.js` + `api/groups.js` | `schema/user.js` |
| 门店信息 | `views/Home/Main/system/` | `tasks/store.js` | `reduces/store.js` | `api/store.js` | `schema/store.js` |

---

## 9. 开发 & 生产启动方式

### 开发模式（3 个终端）

```bash
# 终端 1：前端热更新（先启动，等 "compiled successfully" 出现再开后两个）
cd client && npm run dev:client

# 终端 2：后端（nodemon 自动重启）
cd server && DB_PATH=/Users/xwzhu/Documents/pay_system/server/db/data.db npm run dev:server

# 终端 3：Electron 窗口
cd /Users/xwzhu/Documents/pay_system && npm start
```

前提：项目根存在 `.noserver` 文件（防止 Electron 重复启动服务器）

### 生产模式（本地测试）

```bash
cd client && npm run build:electron
cd server && npm run build
rm /Users/xwzhu/Documents/pay_system/.noserver
cd /Users/xwzhu/Documents/pay_system && npm run start:prod
```

### 打包分发

```bash
cd /Users/xwzhu/Documents/pay_system && npm run build
# 输出在 build/ 目录，macOS 生成 .dmg / .app
```

### 初次安装（从零开始）

```bash
# 1. 根目录依赖
npm install

# 2. 前端依赖
cd client && npm install

# 3. 后端依赖 + 初始化数据库
cd server && npm install && npm run initdb

# 4. 重新编译 sqlite3（针对当前 Electron 版本）
cd .. && npm run postinstall
```
