/**
 * @file index.js
 * @description 商品条码标签打印设备类，提供商品标签的打印功能（当前为模拟实现，延时2秒后返回）。
 * @module device/commodity_tag_print
 */
export class CommodityTagPrint {

    static async print(data) {

        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Print: ", data);
                resolve();
            }, 2000);
        });
    }
}