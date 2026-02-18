/**
 * client/src/tasks/categories.js - 商品分类 API 调用封装
 *
 * 封装与服务器分类接口的通信（/api/warehouse/categories/*）。
 *
 * 方法列表：
 *  - getCategoriesTree(ajax):                   获取分类树 GET
 *  - updateCategoryName(ajax, old, new):         重命名分类 PUT
 *  - deleteCategory(ajax, name):                 删除分类 DELETE
 *  - createCategory(ajax, name):                 创建顶级分类 POST
 *  - createChildCategory(ajax, name, parent):    创建子分类 POST
 *  - updateCategoryParent(ajax, name, parent):   修改父分类 PUT
 */
export class CategoriesTask {
    static getCategoriesTree(ajax) {
        return ajax.get("/api/warehouse/categories");
    }

    static updateCategoryName(ajax, old_name, new_name) {
        return ajax.put("/api/warehouse/categories/updatename", {
            old_name,
            new_name
        });
    }

    static deleteCategory(ajax, name) {
        return ajax.delete(`/api/warehouse/categories/delete/${encodeURIComponent(name)}`)
    }

    static createCategory(ajax, name) {
        return ajax.post("/api/warehouse/categories/create", {
            name
        });
    }

    static createChildCategory(ajax, name, parent_name) {
        return ajax.post("/api/warehouse/categories/create", {
            name,
            parent_name
        });
    }

    static updateCategoryParent(ajax, name, parent_name) {
        return ajax.put("/api/warehouse/categories/updateparent", {
            name,
            parent_name
        });
    }
}