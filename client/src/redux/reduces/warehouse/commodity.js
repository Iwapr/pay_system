/**
 * client/src/redux/reduces/warehouse/commodity.js - 商品选中状态 Reducer
 *
 * 单独管理商品列表中当前选中的商品 ID 和选中类型。
 * 商品列表数据本身不存放在 Redux。
 *
 * State 结构：
 *  {
 *    selectId:   number  - 选中的商品 ID（-1 表示未选中）
 *    selectType: string  - 选中类型（"origin" 普通选中 / 其他类型）
 *  }
 */
import {
    WARE_COMMODITY_SELECT,
    WARE_COMMODITY_CREATE,
    WARE_COMMODITY_DELETE
} from "../../action/actionType";

/** 初始状态：未选中任何商品 */
const initState = {
    selectId: -1,
    selectType: "origin"
};

export function commodity(state = initState, action) {
    switch (action.type) {
        case WARE_COMMODITY_SELECT:
            // 切换选中商品
            return {
                ...state,
                selectId: action.data.selectId,
                selectType: action.data.selectType
            };
        case WARE_COMMODITY_CREATE:
            // 新建商品后，自动选中新建商品
            return {
                ...initState,
                selectId: action.id
            };
        case WARE_COMMODITY_DELETE:
            // 删除商品后，切换选中到相邻商品
            return {
                ...initState,
                selectId: action.id
            };
        default:
            return state;
    }
}