/**
 * client/src/tasks/stock.js - 进货单 API 调用封装
 *
 * 封装仓库进货单相关接口。
 *
 * 方法列表：
 *  - getAllStock(ajax):              获取所有进货单列表 GET /api/warehouse/stock
 *  - getStockDetails(ajax, id):     获取进货单详细  GET /api/warehouse/stock/:id
 *  - createStockOrder(ajax, data):  创建进货单      POST /api/warehouse/stock/create
 */
export class StockTasks {
    static getAllStock(ajax) {
        return ajax.get("/api/warehouse/stock");
    }

    static getStockDetails(ajax, id) {
        return ajax.get(`/api/warehouse/stock/${encodeURIComponent(id)}`);
    }

    static createStockOrder(ajax, data) {
        return ajax.post("/api/warehouse/stock/create", data);
    }
}