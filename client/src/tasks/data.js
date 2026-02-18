/**
 * client/src/tasks/data.js - 数据导入/导出 API 调用封装
 *
 * DataManage.importCommodity(ajax, data): 导入商品数据 POST /api/data/import/commodity
 * DataManage.exportData(ajax, type):      导出数据     GET  /api/data/export
 */
export class DataManage {
    static importCommodity(ajax, data) {
        // 导入商品

        return ajax.post("/api/data/import/commodity", data);
    }

    static exportData(ajax, type) {
        // 导出数据

        return ajax.get("/api/data/export", {
            type
        });
    }
}