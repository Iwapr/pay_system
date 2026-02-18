/**
 * client/src/redux/reduces/cash.js - 收銀模块 Reducer
 *
 * 管理前台收銀和历史订单相关的全部状态。
 * 包含三个子 Reducer：
 *
 *  currentOrder  - 当前正在进行中的订单（商品列表、选中商品、VIP 信息）
 *  historyOrder  - 已完成的订单列表（支持撤销、追加 VIP）
 *  hangupOrder   - 挂起（智能挂单）的订单列表
 *
 * 商品单条结构：
 *  {
 *    id:         number    - 订单内唯一 ID（自增）
 *    name:       string    - 商品名称
 *    barcode:    string    - 条形码
 *    sale_price: number    - 当前单价（可被修改）
 *    count:      number    - 数量
 *    money:      number    - 小计金额（count * sale_price）
 *    status:     "" | "赠送" | "退货" - 商品状态
 *  }
 */
import { combineReducers } from "redux";
import {
    CASH_HOTKEY_STATUS,
    CASH_ORDER_ADD_COMMODITY,
    CASH_ORDER_DELETE_COMMODITY,
    CASH_ORDER_SET_SELECT_COMMODITY,
    CASH_ORDER_SET_COMMODITY_COUNT,
    CASH_ORDER_SET_COMMODITY_PRICE,
    CASH_ORDER_SET_COMMODITY_STATUS_GIVE,
    CASH_ORDER_SET_COMMODITY_STATUS_RETURN,
    CASH_ORDER_SET_VIP,
    CASH_ORDER_CLEAR_VIP,
    CASH_ORDER_RESET_STATUS,
    CASH_HISTORY_ORDER_INIT,
    CASH_HISTORY_ORDER_ADD,
    CASH_HISTORY_ORDER_UNDO,
    CASH_ORDER_HANGUP,
    CASH_ORDER_HANGWUP_GET,
    CASH_HISTORY_ORDER_ADDVIP,
    CASH_HISTORY_ORDER_IMPORT
} from "../action/actionType";
import config from "../../config";
import { mathc } from "../../tools/mathc";
import { getFormatTime } from "../../tools/time";

const { GLOBAL_CASH_HOTKEY_SHOW } = config;

// 从 localStorage 读取热键显示偏好，默认显示
const cashHotKeyInitStatus = localStorage.getItem(GLOBAL_CASH_HOTKEY_SHOW) === "hide" ? false : true;

/**
 * showCashHotKey Reducer
 * 管理收銀页面左侧热键和快捷商品面板的显示/隐藏状态
 */
export function showCashHotKey(state = cashHotKeyInitStatus, action) {

    switch (action.type) {
        case CASH_HOTKEY_STATUS:
            return action.show;
        default:
            return state;
    }
}

/** 订单初始状态 */
const orderInit = {
    id: 0,              // 最后一个商品的 ID
    select: {
        type: "origin", // 选中类型："origin"普通选中 / "更改价格"等
        id: 0           // 选中的商品 ID
    },
    vip: {},            // VIP 信息，未绑定时为空对象
    commodityList: []   // 商品列表
}

/**
 * currentOrder Reducer - 当前正在进行中的订单
 *
 * 支持的 Action：
 *  - CASH_HISTORY_ORDER_IMPORT: 将历史订单商品导入当前订单
 *  - CASH_ORDER_ADD_COMMODITY:  新增商品（默认数量 1）
 *  - CASH_ORDER_DELETE_COMMODITY: 删除商品，并自动调整选中状态
 *  - CASH_ORDER_SET_SELECT_COMMODITY: 设置选中商品
 *  - CASH_ORDER_SET_COMMODITY_COUNT: 修改商品数量，并重算 money
 *  - CASH_ORDER_SET_COMMODITY_PRICE: 修改商品单价，并重算 money
 *  - CASH_ORDER_SET_COMMODITY_STATUS_GIVE:   设置赠送状态（金额=0）
 *  - CASH_ORDER_SET_COMMODITY_STATUS_RETURN: 设置退货状态（金额为负）
 *  - CASH_ORDER_SET_VIP:   绑定 VIP
 *  - CASH_ORDER_CLEAR_VIP: 解绑 VIP
 *  - CASH_ORDER_RESET_STATUS / CASH_ORDER_HANGUP: 重置订单
 *  - CASH_ORDER_HANGWUP_GET: 导入挂起的订单
 */
function currentOrder(state = orderInit, action) {

    switch (action.type) {
        case CASH_HISTORY_ORDER_IMPORT:
            return (() => {
                let id = state.id;
                const commodityList = [...state.commodityList];
                for (let item of action.data) {
                    commodityList.push(Object.assign({}, item, {
                        id: ++id
                    }));
                }
                return {
                    ...state,
                    id,
                    select: {
                        type: "origin",
                        id
                    },
                    commodityList
                }
            })();
        case CASH_ORDER_ADD_COMMODITY:
            return {
                ...state,
                commodityList: [
                    ...state.commodityList,
                    Object.assign({}, action.commodity, {
                        id: state.id + 1,
                        count: 1,
                        money: action.commodity.sale_price
                    })
                ],
                id: state.id + 1,
                select: {
                    type: "origin",
                    id: state.id + 1
                }
            };
        case CASH_ORDER_DELETE_COMMODITY:
            return (() => {
                if (action.id !== state.select.id) {
                    return {
                        ...state,
                        commodityList: state.commodityList.filter(({ id }) => id !== action.id)
                    };
                } else {
                    const index = state.commodityList.findIndex(({ id }) => id === action.id);
                    let select;
                    const len = state.commodityList.length;
                    if (len === 1) {
                        // 当商品只有一个时恢复select 为0
                        select = 0;
                    } else if (index === len - 1) {
                        // 当商品是商品列表里最后一个时，将select设为被删商品的前一个商品id
                        select = state.commodityList[len - 2].id;
                    } else {
                        // 将select设为被删商品的后一个商品id
                        select = state.commodityList[index + 1].id
                    }
                    return {
                        ...state,
                        commodityList: state.commodityList.filter(({ id }) => id !== action.id),
                        select: {
                            type: "origin",
                            id: select
                        }
                    };
                }
            })();
        case CASH_ORDER_SET_SELECT_COMMODITY:
            return {
                ...state,
                select: {
                    type: action.select.type,
                    id: action.select.id
                }
            };
        case CASH_ORDER_SET_COMMODITY_COUNT:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {

                        return Object.assign({}, i, {
                            count: action.count,
                            money: (() => {
                                switch (i.status) {
                                    case "赠送":
                                        return 0;
                                    case "退货":
                                        return mathc.multiply(0 - mathc.abs(i.sale_price), action.count);
                                    default:
                                        return mathc.multiply(i.sale_price, action.count);
                                }
                            })()
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_PRICE:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            sale_price: action.price,
                            money: (() => {
                                switch (i.status) {
                                    case "赠送":
                                        return 0;
                                    case "退货":
                                        return mathc.multiply(0 - mathc.abs(action.price), i.count);
                                    default:
                                        return mathc.multiply(action.price, i.count);
                                }
                            })()
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_STATUS_GIVE:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            status: "赠送",
                            sale_price: 0,
                            money: 0
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_STATUS_RETURN:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            status: "退货",
                            sale_price: 0 - i.sale_price,
                            money: mathc.multiply(i.count, 0 - i.sale_price)
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_VIP:
            return {
                ...state,
                vip: action.vip
            };
        case CASH_ORDER_CLEAR_VIP:
            return {
                ...state,
                vip: {}
            };
        case CASH_ORDER_RESET_STATUS:
        case CASH_ORDER_HANGUP:
            return orderInit;
        case CASH_ORDER_HANGWUP_GET:
            return {
                ...orderInit,
                id: action.data.order_id,
                select: {
                    type: "origin",
                    id: action.data.commodityList[0].id
                },
                vip: action.data.vip,
                commodityList: action.data.commodityList
            }
        default:
            return state;
    }
}



/**
 * historyOrder Reducer - 已完成订单列表
 *
 * State: Array<Order>
 *  - CASH_HISTORY_ORDER_INIT:   初始化（登录后从服务器加载当日历史订单）
 *  - CASH_HISTORY_ORDER_ADD:    新增订单（结账后添加）
 *  - CASH_HISTORY_ORDER_UNDO:   撤销订单（用服务器最新数据替换）
 *  - CASH_HISTORY_ORDER_ADDVIP: 为历史订单追加 VIP 信息
 */
function historyOrder(state = [], action) {
    switch (action.type) {
        case CASH_HISTORY_ORDER_INIT:
            return action.data;  // 从服务器获取当日订单历史初始化
        case CASH_HISTORY_ORDER_ADD:
            return [...state, action.order];  // 新订单追加到列表末尾
        case CASH_HISTORY_ORDER_UNDO:
        case CASH_HISTORY_ORDER_ADDVIP:
            // 找到对应订单并用服务器返回的数据替换
            return state.map(order => {
                if (order.order_id === action.data.order_id) {
                    return action.data;
                }
                return order;
            });
        default:
            return state;
    }
}

/**
 * hangupOrder Reducer - 挂起订单列表
 *
 * State: { id: number, list: Array<HangupOrder> }
 * 每条挂起订单包含：
 *  { id, order_id, vip, commodityList, time }
 *
 *  - CASH_ORDER_HANGUP:     将当前订单挂起，并取得一个新的挂起 ID
 *  - CASH_ORDER_HANGWUP_GET: 取出指定 ID 的挂起订单，将其从列表中移除
 */
const hangupInitState = {
    id: 0,    // 挂起订单自增 ID 计数器
    list: []  // 挂起订单列表
};

function hangupOrder(state = hangupInitState, action) {

    switch (action.type) {
        case CASH_ORDER_HANGUP:
            // 将当前订单加入挂起列表，并为其分配新 ID
            return {
                id: state.id + 1,
                list: [...state.list, {
                    id: state.id + 1,
                    order_id: action.data.id,
                    vip: action.data.vip,
                    commodityList: action.data.commodityList,
                    time: getFormatTime()  // 记录挂起时间
                }]
            };
        case CASH_ORDER_HANGWUP_GET:
            // 取出指定 ID 的挂起订单，将其从列表中移除
            return {
                ...state,
                list: state.list.filter(({ id }) => id !== action.id)
            };
        default:
            return state;
    }
}

/** 将三个子 Reducer 合并导出 */
export const cash = combineReducers({
    currentOrder,   // 当前订单
    historyOrder,   // 历史订单
    hangupOrder     // 挂起订单
});