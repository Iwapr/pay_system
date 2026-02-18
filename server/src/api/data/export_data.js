/**
 * server/src/api/data/export_data.js - 数据导出路由 GET /api/data/export
 *
 * 根据 type 参数导出不同类型的数据（commodity/vip/sales）。
 * 返回可用于生成 Excel 的 JSON 格式化数据。
 *
 * 认证：需要管理员权限。
 * 验证：exportDataSchema（type 必填，且为枚举值之一）。
 */
import express from "express";
import { exportDataSchema } from "../../schema/data.js";
import { validBody } from "../../middleware/validBody.js";
import ExportDataTasks from "../../tasks/export_data.js";

const route = express.Router();

route.get("/", validBody(exportDataSchema, "参数错误!", false), async (req, res, next) => {
    // 导出数据

    const { type } = req.query;

    const result = await ExportDataTasks.exportData(type);

    res.json(result);
});

export default route;