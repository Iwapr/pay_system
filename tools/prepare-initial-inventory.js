const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../client/node_modules/xlsx'));

const INPUT_FILE = path.resolve(__dirname, '../初始库存.csv');
const OUTPUT_DIR = path.resolve(__dirname, '../导入文件');

const COL = {
  category: 2,
  barcode: 3,
  name: 5,
  count: 6,
  inPrice: 8,
  salePrice: 11,
  unit: 13,
  size: 14,
  supplier: 20,
  isDelete: 28,
  vipPoints: 27,
  code2: 4,
};

function readText(filePath) {
  const buf = fs.readFileSync(filePath);
  try {
    return new TextDecoder('gb18030').decode(buf);
  } catch (err) {
    return buf.toString('utf8');
  }
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(value, fallback = false) {
  if (value === '1' || value === 1 || value === true || value === 'true') return true;
  if (value === '0' || value === 0 || value === false || value === 'false') return false;
  return fallback;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  result.push(current.trim());
  return result;
}

function normalizeCategoryName(value) {
  const raw = (value || '').trim();
  if (!raw) return '默认';
  return raw;
}

function isSummaryRow(cols) {
  const barcode = (cols[COL.barcode] || '').trim();
  const code2 = (cols[COL.code2] || '').trim();
  const inPrice = toNumber(cols[COL.inPrice], 0);
  const salePrice = toNumber(cols[COL.salePrice], 0);
  const count = toNumber(cols[COL.count], 0);

  return (
    barcode &&
    code2 &&
    barcode === code2 &&
    inPrice === 0 &&
    salePrice === 0 &&
    count <= 0
  );
}

function loadRows() {
  const text = readText(INPUT_FILE);
  return text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(parseCsvLine)
    .map(row => row.map(v => String(v || '').trim()))
    .filter(cols => cols.some(Boolean))
    .filter(cols => cols.length >= 21);
}

function buildData(rows) {
  const commodityMap = new Map();
  const stockRows = [];

  for (const cols of rows) {
    if (isSummaryRow(cols)) continue;

    const barcode = (cols[COL.barcode] || '').trim();
    const name = (cols[COL.name] || '').trim();
    const category = normalizeCategoryName(cols[COL.category]);

    if (!barcode || !name || !category) continue;

    const supplier = (cols[COL.supplier] || '').trim() || '默认';
    const inPrice = Math.max(0, toNumber(cols[COL.inPrice], 0));
    const salePrice = Math.max(0, toNumber(cols[COL.salePrice], 0));
    const unit = (cols[COL.unit] || '').trim() || '个';
    const size = (cols[COL.size] || '').trim();
    const vipPoints = toBool(cols[COL.vipPoints], true);
    const isDelete = toBool(cols[COL.isDelete], false);
    const count = toNumber(cols[COL.count], 0);

    const commodityRow = {
      商品条码: barcode,
      商品名称: name,
      商品分类: category,
      商品进价: inPrice,
      商品售价: salePrice,
      是否积分: vipPoints,
      禁用: isDelete,
    };

    if (unit) commodityRow.单位 = unit;
    if (size) commodityRow.规格 = size;
    if (supplier) commodityRow.供应商 = supplier;

    commodityMap.set(barcode, commodityRow);

    if (count > 0) {
      stockRows.push({
        供应商: supplier,
        商品条码: barcode,
        商品名称: name,
        进价: inPrice,
        数量: count,
      });
    }
  }

  const commodityRows = Array.from(commodityMap.values());

  const groupedStock = stockRows.reduce((acc, row) => {
    const supplier = row.供应商;
    if (!acc[supplier]) acc[supplier] = {};

    const byBarcode = acc[supplier];
    const barcode = row.商品条码;
    if (!byBarcode[barcode]) {
      byBarcode[barcode] = {
        barcode,
        name: row.商品名称,
        in_price: row.进价,
        count: row.数量,
      };
    } else {
      byBarcode[barcode].count += row.数量;
      if (row.进价 > 0) byBarcode[barcode].in_price = row.进价;
    }

    return acc;
  }, {});

  const stockJson = Object.entries(groupedStock).map(([supplier_name, map]) => ({
    supplier_name,
    commodity_list: Object.values(map).map(({ barcode, in_price, count }) => ({
      barcode,
      in_price,
      count,
    })),
  }));

  return { commodityRows, stockRows, stockJson };
}

function writeOutputs({ commodityRows, stockRows, stockJson }) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const wb1 = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(commodityRows, {
    header: ['商品条码', '商品名称', '商品分类', '商品进价', '商品售价', '单位', '规格', '是否积分', '禁用', '供应商'],
  });
  XLSX.utils.book_append_sheet(wb1, ws1, '商品导入');
  const commodityXlsx = path.join(OUTPUT_DIR, '导入_商品资料.xlsx');
  XLSX.writeFile(wb1, commodityXlsx);

  const wb2 = XLSX.utils.book_new();
  const ws2 = XLSX.utils.json_to_sheet(stockRows, {
    header: ['供应商', '商品条码', '商品名称', '进价', '数量'],
  });
  XLSX.utils.book_append_sheet(wb2, ws2, '期初入库明细');
  const stockXlsx = path.join(OUTPUT_DIR, '导入_期初入库明细.xlsx');
  XLSX.writeFile(wb2, stockXlsx);

  const stockJsonFile = path.join(OUTPUT_DIR, '导入_期初入库_按供应商.json');
  fs.writeFileSync(stockJsonFile, JSON.stringify(stockJson, null, 2), 'utf8');

  return { commodityXlsx, stockXlsx, stockJsonFile };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`未找到输入文件: ${INPUT_FILE}`);
  }

  const rows = loadRows();
  const data = buildData(rows);
  const files = writeOutputs(data);

  console.log('处理完成:');
  console.log(`- 原始行数: ${rows.length}`);
  console.log(`- 商品导入行数(去重后): ${data.commodityRows.length}`);
  console.log(`- 期初入库明细行数: ${data.stockRows.length}`);
  console.log(`- 生成文件: ${files.commodityXlsx}`);
  console.log(`- 生成文件: ${files.stockXlsx}`);
  console.log(`- 生成文件: ${files.stockJsonFile}`);
}

main();
