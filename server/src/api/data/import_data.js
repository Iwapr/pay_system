/**
 * server/src/api/data/import_data.js - 数据导入路由 POST /api/data/import/commodity
 *
 * 批量导入商品数据，支持配置冲突处理策略（barcode_exist/category_exist/supplier_exist）。
 *
 * 认证：需要管理员权限。
 * 验证：importCommpditySchema（rules + data[] 必填）。
 */
import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { importCommpditySchema } from "../../schema/data.js";
import ImportCommodityManage from "../../tasks/import_data/commodity.js";

const route = express.Router();

route.post("/commodity", validBody(importCommpditySchema), async (req, res, next) => {

    const { rules, data } = req.body;

    const result = await ImportCommodityManage.importData(rules, data);

    res.json(result);
});

export default route;