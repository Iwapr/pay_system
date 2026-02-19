import SuppliersTask from "../suppliers.js";
import StockTask from "../warehouse/stock.js";
import CommodityTask from "../commodity.js";
import config from "../../config/index.js";

const { default_supplier } = config;

export default class ImportStockManage {
    static async importData(rules, data) {
        const { stock_supplier_exist } = rules;

        const supplierList = await SuppliersTask.getSupplierDetails();
        const supplierNameToId = new Map(supplierList.map(({ id, name }) => [name, id]));

        const commodityIdByBarcode = new Map();
        const groupedBySupplier = new Map();

        let skip_count = 0;

        async function getSupplierId(name) {
            const supplierName = (name || "").trim() || default_supplier;

            if (supplierNameToId.has(supplierName)) {
                return supplierNameToId.get(supplierName);
            }

            if (!stock_supplier_exist) {
                return supplierNameToId.get(default_supplier);
            }

            const { lastID } = await SuppliersTask.createSupplier(supplierName);
            supplierNameToId.set(supplierName, lastID);
            return lastID;
        }

        async function getCommodityId(barcode) {
            if (commodityIdByBarcode.has(barcode)) {
                return commodityIdByBarcode.get(barcode);
            }

            const result = await CommodityTask.getCommodityDetails(barcode, "barcode", true);
            const id = result ? result.id : null;
            commodityIdByBarcode.set(barcode, id);
            return id;
        }

        for (let item of data) {
            const barcode = String(item.barcode || "").trim();
            const count = Number(item.count);
            const in_price = Number(item.in_price);

            if (!barcode || !(count > 0) || in_price < 0) {
                skip_count++;
                continue;
            }

            const commodity_id = await getCommodityId(barcode);
            if (!commodity_id) {
                skip_count++;
                continue;
            }

            const supplier_id = await getSupplierId(item.supplier_name);
            if (!supplier_id) {
                skip_count++;
                continue;
            }

            if (!groupedBySupplier.has(supplier_id)) {
                groupedBySupplier.set(supplier_id, []);
            }

            groupedBySupplier.get(supplier_id).push({
                commodity_id,
                count,
                in_price
            });
        }

        const CHUNK_SIZE = 200;
        let create_count = 0;
        let update_count = 0;

        for (let [supplier_id, list] of groupedBySupplier.entries()) {
            for (let i = 0; i < list.length; i += CHUNK_SIZE) {
                const chunk = list.slice(i, i + CHUNK_SIZE);
                await StockTask.createStock(supplier_id, chunk, "初始入库导入");
                create_count += chunk.length;
            }
        }

        return {
            create_count,
            update_count,
            skip_count
        };
    }
}
