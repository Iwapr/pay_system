/**
 * client/src/tasks/promotion.js - 促销活动 API 调用封装
 *
 * 封装营销促销活动相关接口（/api/market/promotion/*）。
 *
 * 方法列表：
 *  - getAllPromotion(ajax):                    获取所有促销活动
 *  - delPromotion(ajax, name):               删除促销活动
 *  - createPromotion(ajax, data):            创建促销活动
 *  - editPromotion(ajax, data):              修改促销活动
 *  - getPromoCommodity(ajax, name):          获取活动商品列表
 *  - delCommodityByPromo(ajax, name, barcode): 从活动移除商品
 *  - getPromotionType(ajax):                 获取活动类型列表
 *  - addCommodityToPromo(ajax, data):        向活动添加商品
 *  - editCommodityFromPromo(ajax, data):     修改活动商品配置
 */
export class PromotionManage {
    static getAllPromotion(ajax) {
        // 获取所有促销活动

        return ajax.get("/api/market/promotion");
    }

    static delPromotion(ajax, name) {
        // 删除一个促销活动

        return ajax.delete(`/api/market/promotion/delete/${encodeURIComponent(name)}`);
    }

    static createPromotion(ajax, data) {
        // 创建一个促销活动

        return ajax.post("/api/market/promotion/create", data);
    }

    static editPromotion(ajax, data) {
        // 修改一个促销活动

        return ajax.put("/api/market/promotion/update", data);
    }

    static getPromoCommodity(ajax, name) {
        // 获取参加某个促销活动的所有商品

        return ajax.get(`/api/market/promotion/commodity/${encodeURIComponent(name)}`);
    }

    static delCommodityByPromo(ajax, name, barcode) {
        // 从促销活动中删除商品

        return ajax.delete("/api/market/promotion/commodity", {
            name,
            barcode
        });
    }

    static getPromotionType(ajax) {
        // 获取所有促销活动类型

        return ajax.get("/api/market/promotion/type");
    }

    static addCommodityToPromo(ajax, data) {
        // 向促销活动中添加商品

        return ajax.post("/api/market/promotion/commodity", data);
    }

    static editCommodityFromPromo(ajax, data) {
        // 修改促销活动中的商品

        return ajax.put("api/market/promotion/commodity", data);
    }
}