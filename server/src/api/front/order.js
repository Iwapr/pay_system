/**
 * server/src/api/front/order.js - 前台收银订单路由
 *
 * 路由：
 *  POST /api/front/order/submit  - 提交收银订单（含验价、积分、促销逻辑）
 *  GET  /api/front/order         - 获取今日历史订单列表
 *  PUT  /api/front/order/undo    - 撤销已完成订单
 *  PUT  /api/front/order/addvip  - 为已完成订单补录 VIP 信息
 *
 * 认证：需要有效的 JWT Token。
 */
import express from "express";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import { createOrderSchema, undoOrderSchema, addOrderVipSchema, alipayPaySchema } from "../../schema/orders.js";
import OrdersTask from "../../tasks/frontend/orders.js";
import VipTask from "../../tasks/vip.js";
import { AlipayService } from "../../lib/alipay.js";

const route = express.Router();

route.post("/submit", validBody(
    createOrderSchema,
    "订单信息不正确!"
), async (req, res, next) => {
    // 创建新的订单

    const { pay_type, client_pay, change, origin_price, sale_price, commodity_list, vip_code, count } = req.body;

    const priceIsEqual = await OrdersTask.validOrderPrice(sale_price, commodity_list);
    // 验证前台提交的商品总金额和商品数量*单价总数是否相符

    if (!priceIsEqual) {
        return throwError(next, "订单实际金额和商品实际金额不对应!");
    }

    const changeIsValid = await OrdersTask.validChange(client_pay, change, sale_price);
    // 验证前台提交的找零金额是否正确

    if (!changeIsValid) {
        return throwError(next, "找零金额错误!");
    }

    const { username } = req["jwt_value"];
    const { status, data } = await OrdersTask.handleOrder({
        pay_type, client_pay, change, origin_price, sale_price, commodity_list, username, vip_code, count
    });

    if (!status) {
        return throwError(next, data);
    }

    res.json(data);
});

route.put("/undo", validBody(
    undoOrderSchema,
    "订单号格式不正确!"
), async (req, res, next) => {
    // 撤销订单，将订单作废处理

    const { order_id } = req.body;
    const result = await OrdersTask.getTodayOrders(null, order_id);
    if (!result) {
        return throwError(next, "订单号不存在!");
    }
    // 当订单号不存在时返回400

    const { is_undo } = result;
    if (is_undo === 1) {
        return throwError(next, "此订单已被撤销，请勿重复提交!");
    }
    // 当订单已被撤销时返回400

    await OrdersTask.undoOrder(order_id, result.vip_code, result.points, result.sale_price);

    const order_details = await OrdersTask.getOrderAllDetails(order_id);

    res.json(order_details);
});

route.put("/addvip", validBody(
    addOrderVipSchema,
    "请提交正确的订单号或会员号!"
), async (req, res, next) => {
    // 追加VIP积分

    const { order_id, vip_code } = req.body;
    const result = await OrdersTask.getTodayOrders(null, order_id);
    if (!result) {
        return throwError(next, "订单号不存在!");
    }
    // 当订单号不存在时返回400

    const { is_undo, vip_code: _vip_code, points, sale_price } = result;
    if (is_undo === 1) {
        return throwError(next, "此订单已被撤销，无法追加积分!");
    }
    // 当订单已被撤销时返回400

    if (_vip_code) {
        return throwError(next, "此订单已经使用了会员卡!");
    }
    // 当此订单已使用了会员卡时返回400

    const queryVipResult = await VipTask.getVipDetails(vip_code);
    if (!queryVipResult) {
        return throwError(next, `会员卡${vip_code}不存在!`);
    }
    // 当会员卡不存在时返回400

    await OrdersTask.addVipToOrder(order_id, vip_code, points, sale_price);

    const order_details = await OrdersTask.getOrderAllDetails(order_id);

    res.json(order_details);
});

route.get("/", async (req, res, next) => {
    // 查询今日订单

    const { username } = req["jwt_value"];
    const data = await OrdersTask.getTodayOrders(username);
    if (data.length === 0) {
        return res.json(data);
    }

    const result = await Promise.all(
        data.map(
            ({ order_id }) => OrdersTask.getOrderAllDetails(order_id))
    );

    res.json(result);
});

route.get("/:id", async (req, res, next) => {
    // 查询订单详细信息

    const { id } = req.params;
    const result = await OrdersTask.getOrderAllDetails(id);

    if (!result) {
        return throwError(next, `订单号${id}不存在!`);
    }

    res.json(result);
});

/**
 * POST /api/front/order/alipay-pay
 *
 * 支付宝条码支付：收银员扫去顾客手机上的付款码，后端调支付宝 API 扣款。
 *
 * 请求体：
 *   auth_code    - 付款码（扫码枪扫入）
 *   total_amount - 实付金额（元）
 *   subject      - 订单标题（显示在支付宝账单中）
 *   out_trade_no - 商户订单号（使用系统 order_id）
 *
 * 响应：
 *   成功：{ success: true, tradeNo: "支付宝流水号" }
 *   失败：{ success: false, message: "错误原因" }
 */
route.post("/alipay-pay", validBody(
    alipayPaySchema,
    "支付参数不正确!"
), async (req, res, next) => {
    const { auth_code, total_amount, subject, out_trade_no } = req.body;

    try {
        const result = await AlipayService.pay(auth_code, total_amount, subject, out_trade_no);
        res.json(result);
    } catch (err) {
        // 支付宝尚未配置或网络异常
        return throwError(next, err.message || "支付宝服务异常");
    }
});

export default route;