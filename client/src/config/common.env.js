/**
 * client/src/config/common.env.js - 客户端通用配置
 *
 * 定义应用全局使用的常量配置，包括 localStorage key 名称、
 * 默认值、iconfont 地址等。
 * 该配置将被 dev.env.js 和 prod.env.js 通过 merge 吸收。
 *
 * ICON_ONLINE_URL 逻辑：
 *  - offline 模式（Electron 离线）→ 使用本地自定义协议 'icon:' 加载
 *  - 在线模式          → 使用标准路径加载 iconfont
 */
const ICON_ONLINE_URL = process.env.TYPE === "offline" ? "icon://static/js/iconfontcn.js" : "/static/js/iconfontcn.js";

export const common = {
    store_name: "小牧的小超市",                // 默认店铺名称（首次运行前未获取到服务器配置时的占位符）
    GLOBAL_BASE_URL_KEY: "POSSYSTEM_BASEURL",       // localStorage 中存储 API 地址的 key
    GLOBAL_TOKEN_KEY: "POSSYSTEM_TOKEN",            // localStorage 中存储 JWT Token 的 key
    GLOBAL_TABS_STATUS: "GLOBAL_TABS_STATUS",       // localStorage 中存储标签栏显示状态的 key
    GLOBAL_SIDER_COLLAPSED: "GLOBAL_SIDER_COLLAPSED",  // 侧边栏折叠状态的 localStorage key
    GLOBAL_CASH_HOTKEY_SHOW: "GLOBAL_CASH_HOTKEY_SHOW",  // 收银热键面板显示状态的 localStorage key
    ICON_ONLINE_URL,                                // iconfont 脚本地址
    GLOBAL_FRONT_BOX_STATUS: "GLOBAL_FRONT_BOX_STATUS",  // 钱箱展示状态的 localStorage key
    GLOBAL_FRONT_AUTO_PRINT_STATUS: "GLOBAL_FRONT_AUTO_PRINT_STATUS",  // 自动打印状态的 localStorage key
    DEFAULT_SUPPLIER_NAME: "默认供货商",      // 默认供应商名称
    DEFAULT_CATEGORIES_PARENT: "TREE_BASE"          // 分类树根节点的固定 key
    // 默认分类树根节点key
}