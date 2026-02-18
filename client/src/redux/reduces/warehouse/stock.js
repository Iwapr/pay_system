/**
 * client/src/redux/reduces/warehouse/stock.js - 进货单明细 Reducer
 *
 * 管理当前正在编辑的进货单中的商品明细列表。
 *
 * State 结构：
 *  {
 *    id:         number   - 明细条目自增 ID 计数器
 *    selectId:   number   - 选中的明细条目 ID（-1 表示未选中）
 *    selectType: string   - 选中类型
 *    list:       object[] - 明细条目列表，每一条包含商品信息 + id
 *  }
 */
import {
    WARE_STOCK_REMOVE,
    WARE_STOCK_INIT,
    WARE_STOCK_CLEAN,
    WARE_STOCK_ADD,
    WARE_STOCK_SELECT
} from "../../action/actionType";

/** 初始状态 */
const initState = {
    id: 0,
    selectId: -1,
    selectType: "origin",
    list: []
};

export function stock(state = initState, action) {

    /**
     * 初始化明细列表（从服务器加载已保存的草赿费单明细）
     * 为每条明细分配本地自增 ID
     */
    function handleInit() {
        let id = 0;
        const list = action.list.map(i => ({
            ...i,
            id: id++
        }));
        return {
            ...state,
            id,
            selectId: -1,
            selectType: "origin",
            list
        };
    }

    /**
     * 删除当前选中的明细条目，并自动切换选中到相邻条目
     * 如果列表只剩一项，则重置到初始状态
     */
    function handleDel() {
        const { list, selectId } = state;
        if (list.length < 2) return initState;  // 删除最后一个则重置
        const index = list.findIndex(i => i.id === selectId);
        if (index === list.length - 1) {
            // 删除的是最后一项，切换到前一项
            return {
                ...state,
                selectId: list[list.length - 2].id,
                selectType: "origin",
                list: list.filter(i => i.id !== selectId)
            };
        } else {
            // 删除的不是最后一项，切换到下一项
            return {
                ...state,
                selectId: list[index + 1].id,
                selectType: "origin",
                list: list.filter(i => i.id !== selectId)
            };
        }
    }

    switch (action.type) {
        case WARE_STOCK_ADD:
            // 新增一条明细并切换选中
            return {
                ...state,
                id: state.id + 1,
                selectId: state.id,
                selectType: "origin",
                list: [...state.list, {
                    ...action.data,
                    id: state.id
                }]
            };
        case WARE_STOCK_INIT:
            return handleInit();
        case WARE_STOCK_REMOVE:
            return handleDel();
        case WARE_STOCK_CLEAN:
            // 提交进货单后清空明细列表
            return initState;
        case WARE_STOCK_SELECT:
            // 切换当前选中项
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}