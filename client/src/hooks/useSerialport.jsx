/**
 * client/src/hooks/useSerialport.jsx - 串口列表 Hook
 *
 * 返回可用串口列表，用于设备配置页面选择串口。
 *
 * 当前为 Mock 实现，后续应使用 Electron 的 Node.js API（如 serialport 包）获取真实串口列表。
 *
 * @returns {Array<{port: string}>} 串口列表
 */
import { useState, useEffect } from "react";

export function useSerialport() {

    const [serialPort, setSerialPortList] = useState([]);

    async function getComportList() {
        // TODO: 待补充，使用 Electron 提供的 Node.js API 获取真实串口列表
        // 当前返回的是模拟数据
        const fakeComportList = [
            {
                port: "COM1",
            },
            {
                port: "COM2"
            },
            {
                port: "COM3"
            }
        ];

        setSerialPortList(fakeComportList);
    }

    // 组件挂载时自动获取串口列表
    useEffect(() => {
        getComportList();
    }, []);

    return serialPort;

}