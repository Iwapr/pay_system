/**
 * server/src/api/statistics/index.js - 统计分析路由聚合
 *
 * 挂载 /api/statistics 下的所有子路由：
 *  - /orders/*     → 订单列表/详情查询
 *  - /proportion   → 商品销售占比统计
 *  - /trends       → 销售趋势统计
 */
import express from "express";
import orders from "./orders.js";
import proportion from "./proportion.js";
import trends from "./trends.js";

const route = express.Router();

route.use("/orders", orders);
route.use("/proportion", proportion);
route.use("/trends", trends);

export default route;