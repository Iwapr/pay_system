/**
 * server/src/api/market/index.js - 营销模块路由聚合
 *
 * 挂载 /api/market 下的所有子路由：
 *  - /promotion/* → 促销活动管理
 */
import express from "express";
import promotion from "./promotion/index.js";

const route = express.Router();

route.use("/promotion", promotion);

export default route;