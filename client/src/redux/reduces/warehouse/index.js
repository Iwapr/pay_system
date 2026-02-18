/**
 * client/src/redux/reduces/warehouse/index.js - 仓库管理 Reducer 入口
 *
 * 将仓库相关的三个状态合并为 warehouse 子模块：
 *  - categories: 商品分类树状态
 *  - commodity:  当前选中商品状态
 *  - stock:      进货单状态
 */
import { combineReducers } from "redux";
import { categories } from "./categories";
import { commodity } from "./commodity";
import { stock } from "./stock";

export const warehouse = combineReducers({
    categories,   // 分类树（选中、展开、层级结构）
    commodity,    // 当前选中的商品
    stock         // 进货单商品列表
});