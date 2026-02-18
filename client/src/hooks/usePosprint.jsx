/**
 * client/src/hooks/usePosprint.jsx - POS 打印机列表 Hook
 *
 * 返回当前可用的 POS 打印机列表，用于设备配置页面选择打印机。
 *
 * 当前为 Mock 实现，后续应使用 Electron 的 Node.js API 获取系统安装的打印机列表。
 *
 * @returns {Array<{name: string}>} 打印机列表
 */
import { useState, useEffect } from "react";

export function usePosprint() {

    const [posPrintList, setPosPrintList] = useState([]);

    async function getPosPrintList() {
        // TODO: 待以后补齐相关代码，使用 Electron 提供的 Node API 获取本地打印机列表
        // 当前返回模拟数据
        const fakePrintList = [
            {
                name: "POS58"
            },
            {
                name: "TPA42"
            }
        ];

        setPosPrintList(fakePrintList);
    }

    // 组件挂载时自动获取打印机列表
    useEffect(() => {
        getPosPrintList();
    }, []);

    return posPrintList;
}