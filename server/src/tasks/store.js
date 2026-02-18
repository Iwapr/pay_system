/**
 * server/src/tasks/store.js - 店铺配置数据操作层（DAO 封装）
 *
 * 封装对 store_config 表的数据库操作。
 *
 * 方法列表：
 *  - getStoreName(): 查询店铺名称配置
 *  - setStoreName(name): 更新店铺名称
 */
import AppDAO from "../data/AppDAO.js";

export class StoreTasks {

    static async getStoreName() {
        // 获取店铺名称
        return await AppDAO.get(`
        SELECT * FROM store_config
        ;`);
    }

    static async setStoreName(name) {
        // 设置店铺名称

        const { id } = await this.getStoreName();

        return await AppDAO.run(`
        UPDATE store_config SET 
        name=? 
        WHERE id=?
        ;`, [name, id]);
    }
}