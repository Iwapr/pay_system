/**
 * server/src/api/front/index.js - 前台收银路由聚合
 *
 * 挂载 /api/front 下的所有子路由：
 *  - /commodity   → 商品查询
 *  - /vip/:query  → 会员查询
 *  - /order/*     → 订单提交/历史/撤单/添加VIP
 */
import express from "express";
import commodity from "./commodity.js";
import vip_member from "./vip_member.js";
import order from "./order.js";

const route = express.Router();

route.use("/commodity", commodity);
route.use("/vip", vip_member);
route.use("/order", order);

export default route;