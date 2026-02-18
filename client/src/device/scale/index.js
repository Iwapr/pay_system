/**
 * @file index.js
 * @description 电子秤设备列表导出模块，定义可用电子秤的连接配置（主机地址、端口、设备类）。
 * 当前使用 WebFakeScale 作为 Web 演示版本的模拟实现，正式环境可切换为 DahuaScale。
 * @module device/scale
 */
// import { DahuaScale } from "./dahua";
import { WebFakeScale } from "./webFakeScale";

// export const ScaleList = [
//     {
//         name: "大华电子秤",
//         port: 4001,
//         host: "192.168.0.150",
//         // ScaleClass: DahuaScale
//     },
//     {
//         name: "顶尖电子秤",
//         port: 5001,
//         host: "192.168.2.150"
//     }
// ];


// web版本假电子秤数据
export const ScaleList = [
    {
        name: "大华电子秤",
        port: 4001,
        host: "192.168.0.150",
        ScaleClass: WebFakeScale
    },
    {
        name: "顶尖电子秤",
        port: 5001,
        host: "192.168.2.150",
        ScaleClass: WebFakeScale
    }
];

export default ScaleList;