/**
 * client/src/redux/reduces/tabs.js - 标签页模块 Reducer
 *
 * showTabs  - 控制标签栏的显示/隐藏，状态持久化到 localStorage
 * tabs      - 纺管多标签页的开示和切换
 *
 * State 结构：
 *  {
 *    currentPath: string         - 当前激活标签页的路径
 *    openTabs: [{ path, title }] - 已打开的标签页列表（首页为默认不可关闭）
 *  }
 */
import {
    TABS_ADD_TAB,
    TABS_CLOSE_TAB,
    TABS_SET_CURRENT_TAB,
    CLEAR_USER_STATE,
    TOGGLE_TABS_STATUS
} from "../action/actionType";
import config from "../../config";

const { GLOBAL_TABS_STATUS } = config;

// 从 localStorage 读取标签栏显示偏好，默认显示
const defaultTabsStatus = localStorage.getItem(GLOBAL_TABS_STATUS) === "hide" ? false : true;

/**
 * showTabs Reducer
 * 控制页面顶部标签栏的展开/折叠状态
 */
export function showTabs(state = defaultTabsStatus, action) {
    switch (action.type) {
        case TOGGLE_TABS_STATUS:
            return action.status;
        default:
            return state;
    }
}

// 开发调试用的预设标签页列表（生产环境下已被注释）
const fakeopenTabs = [
    {
        path: '/home',
        title: '系统主页'
    },
    {
        title: '活动管理',
        path: '/home/promotion/manage'
    },
    {
        title: '活动商品管理',
        path: '/home/promotion/commodity'
    },
    {
        title: '供应商管理',
        path: '/home/warehouse/supplier'
    },
    {
        title: '进货管理',
        path: '/home/warehouse/stock'
    },
    {
        title: '分类管理',
        path: '/home/warehouse/categories'
    },
    {
        title: '商品管理',
        path: '/home/warehouse/commodity'
    }
];

/** 初始状态：默认打开首页 */
const initValue = {
    currentPath: "/home",
    // openTabs: fakeopenTabs  // 调试时可启用预置多标签
    openTabs: [
        {
            path: "/home",
            title: "系统主页"
        }
    ]
};

/**
 * tabs Reducer
 * 理厂标签页的新增、切换和关闭操作
 */
export function tabs(state = initValue, action) {
    const { currentPath, openTabs } = state;
    switch (action.type) {
        case CLEAR_USER_STATE:
            // 用户退出登录时针标签页状态重置为初始状态
            return initValue;
        case TABS_SET_CURRENT_TAB:
            // 仅切换激活标签，不修改标签列表
            return {
                currentPath: action.path,
                openTabs
            };
        case TABS_ADD_TAB:
            // 添加新标签并切换到它
            return {
                currentPath: action.value.path,
                openTabs: [...openTabs, action.value]
            };
        case TABS_CLOSE_TAB:
            return (() => {
                const { path } = action;
                if (path === currentPath) {
                    // 关闭的是当前激活标签，需要自动切换到相邻标签
                    const index = openTabs.findIndex(t => t.path === path);
                    if (index + 1 === openTabs.length) {
                        // 关闭的是最后一个标签，切换到前一个
                        return {
                            currentPath: openTabs[openTabs.length - 2].path,
                            openTabs: openTabs.slice(0, index)
                        };
                    } else {
                        // 关闭的标签后面还有标签，切换到下一个
                        return {
                            currentPath: openTabs[index + 1].path,
                            openTabs: openTabs.filter(t => t.path !== path)
                        }
                    }
                } else {
                    // 关闭的是非激活标签，直接移除，不改变当前扰活标签
                    return {
                        currentPath,
                        openTabs: openTabs.filter(t => t.path !== path)
                    }
                }
            })();
        default:
            return state;
    }
}