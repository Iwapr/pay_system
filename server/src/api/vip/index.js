/**
 * server/src/api/vip/index.js - VIP 会员管理路由聚合
 *
 * 挂载 /api/vip 下的所有子路由：
 *  - /members/* → 会员增删改查、积分管理、换卡
 */
import express from "express";
import members from "./members.js";

const route = express.Router();

route.use("/members", members);

export default route;