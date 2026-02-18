/**
 * client/src/tasks/commodity.js - 商品 API 调用封装
 *
 * 封装前台和仓库商品接口的通信。
 *
 * 方法列表：
 *  - query(ajax, key, warehouse):              按条形码/关键字搜索商品
 *  - queryByCategory(ajax, category):          按分类批量查询商品
 *  - createCommodity(ajax, value):             新建商品 POST
 *  - updateCommodity(ajax, barcode, value):    更新商品信息 PUT
 *  - deleteCommodity(ajax, barcode):           删除商品 DELETE
 */
export class CommodityTasks {
    static query(ajax, key, warehouse = false) {
        return ajax.get(`/api/front/commodity/${encodeURIComponent(key)}`, {
            warehouse
        });
    }

    static queryByCategory(ajax, category) {
        return ajax.get("/api/warehouse/commodity", {
            list: category.join(",")
        });
    }

    static createCommodity(ajax, value) {
        return ajax.post("/api/warehouse/commodity/create", value);
    }

    static updateCommodity(ajax, current_barcode, update_value) {
        return ajax.put("/api/warehouse/commodity/update", {
            current_barcode,
            update_value
        });
    }

    static deleteCommodity(ajax, barcode) {
        return ajax.delete(`/api/warehouse/commodity/delete/${encodeURIComponent(barcode)}`);
    }
}