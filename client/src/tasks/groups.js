/**
 * client/src/tasks/groups.js - 用户分组 API 调用封装
 *
 * GroupManage.getAllGroup(ajax): 获取所有用户分组列表 GET /api/groups
 */
export class GroupManage {
    static async getAllGroup(ajax) {
        return ajax.get("/api/groups");
    }
}