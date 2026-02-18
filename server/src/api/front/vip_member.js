/**
 * server/src/api/front/vip_member.js - 前台会员搜索路由 GET /api/front/vip/:query
 *
 * 收银台快速搜索 VIP 会员接口，支持会员码/姓名/手机号/拼音首字母查找。
 * 只返回未禁用的会员基本信息（code, name, phone 等）。
 *
 * 认证：需要有效的 JWT Token。
 */
import express from "express";
import VipMemberTask from "../../tasks/frontend/vip_member.js";


const route = express.Router();

route.get("/:query", async (req, res) => {
    // 获取会员的详细信息

    const { query } = req.params;
    const result = await VipMemberTask.getVipMemberDetails(query.toUpperCase());
    const details = await Promise.all(result.map(async ({ id, is_disable, ...filed }) => ({
        id,
        type: "积分卡",
        is_disable: is_disable === 1,
        ...filed,
        ...await VipMemberTask.mapValueToVipDetails(id)
    })));
    res.send(details);
});

export default route;