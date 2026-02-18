/**
 * client/src/tasks/frontOrder.js - 前台收银订单 API 调用封装
 *
 * 封装收银台下单和历史订单接口。
 *
 * 方法列表：
 *  - submitOrder(ajax, data):              提交订单     POST /api/front/order/submit
 *  - historyOrder(ajax):                   获取历史订单 GET  /api/front/order
 *  - undoOrder(ajax, order_id):            撤销订单     PUT  /api/front/order/undo
 *  - addVipOrder(ajax, order_id, vip_code):为订单绑定VIP PUT  /api/front/order/addvip
 */
export class Order {
    static submitOrder(ajax, data) {
        return ajax.post("/api/front/order/submit", data);
    }

    static historyOrder(ajax) {
        return ajax.get("/api/front/order");
    }

    static undoOrder(ajax, order_id) {
        return ajax.put("/api/front/order/undo", {
            order_id
        });
    }

    static addVipOrder(ajax, order_id, vip_code) {
        return ajax.put("/api/front/order/addvip", {
            order_id,
            vip_code
        });
    }
}