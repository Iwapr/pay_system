/**
 * client/src/tasks/frontOrder.js - 前台收银订单 API 调用封装
 *
 * 封装收银台下单和历史订单接口。
 *
 * 方法列表：
 *  - submitOrder(ajax, data):                   提交订单     POST /api/front/order/submit
 *  - historyOrder(ajax):                        获取历史订单 GET  /api/front/order
 *  - undoOrder(ajax, order_id):                 撤销订单     PUT  /api/front/order/undo
 *  - addVipOrder(ajax, order_id, vip_code):     为订单绑定VIP PUT  /api/front/order/addvip
 *  - alipayPay(ajax, data):                     支付宝条码支付 POST /api/front/order/alipay-pay
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

    /**
     * 支付宝条码支付（收银员扫顾客手机付款码）
     * @param {object} ajax     - axios 实例（来自 AjaxProvider）
     * @param {object} data
     * @param {string} data.auth_code      - 扫码枪扫入的授权码（16-24位数字）
     * @param {number} data.total_amount   - 实付金额（元）
     * @param {string} data.subject        - 订单标题（显示在支付宝账单）
     * @param {number} data.out_trade_no   - 商户订单号（使用系统 order_id）
     * @returns {Promise<{data: {success: boolean, tradeNo?: string, message?: string}}>}
     */
    static alipayPay(ajax, data) {
        return ajax.post("/api/front/order/alipay-pay", data);
    }
}