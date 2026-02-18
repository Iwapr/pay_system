/**
 * server/src/api/warehouse/index.js - 仓库管理路由聚合
 *
 * 挂载 /api/warehouse 下的所有子路由：
 *  - /categories/* → 商品分类管理
 *  - /commodity/*  → 商品管理
 *  - /suppliers/*  → 供应商管理
 *  - /stock/*      → 进货单管理
 */
import express from "express";
import categories from "./categories.js";
import commodity from "./commodity.js";
import suppliers from "./suppliers.js";
import stock from "./stock.js";

const route = express.Router();

route.use("/suppliers", suppliers);
route.use("/categories", categories);
route.use("/commodity", commodity);
route.use("/stock", stock);

export default route;