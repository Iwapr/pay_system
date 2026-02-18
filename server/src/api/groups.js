/**
 * server/src/api/groups.js - 用户组接口
 *
 * GET /api/groups - 获取所有用户组及其权限详情（需管理员权限）
 */
import express from "express";
import GroupTask from "../tasks/groups.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 查询所有用户组及包含的权限列表
    const queryGroupsResult = await GroupTask.getAllGroup();
    res.json(queryGroupsResult);
});

export default route;