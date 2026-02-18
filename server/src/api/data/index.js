/**
 * server/src/api/data/index.js - 数据管理路由聚合
 *
 * 挂载 /api/data 下的所有子路由：
 *  - POST /import/commodity → import_data.js
 *  - GET  /export           → export_data.js
 */
import express from "express";
import import_data from "./import_data.js";
import export_data from "./export_data.js";

const route = express.Router();

route.use("/import", import_data);
route.use("/export", export_data);


export default route;