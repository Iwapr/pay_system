/**
 * client/src/tasks/supplier.js - 供应商 API 调用封装
 *
 * 封装仓库供应商管理相关接口。
 *
 * 方法列表：
 *  - createSupplier(ajax, name, phone, desc): 创建供应商 POST /api/warehouse/suppliers/create
 *  - getSupplier(ajax):                       获取供应商列表 GET /api/warehouse/suppliers
 *  - updateSupplier(ajax, name, value):       更新供应商信息 PUT /api/warehouse/suppliers/update
 *  - deleteSupplier(ajax, name):              删除供应商 DELETE /api/warehouse/suppliers/delete/:name
 */
export class SupplierTask {
    static createSupplier(ajax, name, phone, description) {
        const data = {
            name
        };

        if (phone) {
            data.phone = phone
        }
        if (description) {
            data.description = description;
        }

        return ajax.post("/api/warehouse/suppliers/create", data);
    }

    static getSupplier(ajax) {
        return ajax.get("/api/warehouse/suppliers");
    }

    static updateSupplier(ajax, name, update_value) {
        return ajax.put("/api/warehouse/suppliers/update", {
            name,
            update_value
        });
    }

    static deleteSupplier(ajax, name) {
        return ajax.delete(`/api/warehouse/suppliers/delete/${encodeURIComponent(name)}`);
    }
}