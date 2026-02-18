/**
 * client/src/tasks/store.js - 店铺信息 API 调用封装
 *
 * StoreTasks.getStoreName(ajax):       获取店铺名称 GET  /api/store/name
 * StoreTasks.setStoreName(ajax, name): 设置店铺名称 PUT  /api/store/name
 */
export class StoreTasks {
    static getStoreName(ajax) {
        // 获取店铺名称

        return ajax.get("/api/store/name");
    }

    static setStoreName(ajax, name) {
        // 设置店铺名称

        return ajax.put("/api/store/name", {
            name
        });
    }
}