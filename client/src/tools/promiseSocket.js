/**
 * client/src/tools/promiseSocket.js - Promise 风格的 TCP Socket 工具
 *
 * 封装 Node.js net.Socket，将回调风格的 Socket 小息收发包装为 Promise。
 * 主要用于与正嫩设备（如小票打印机、錢筱、电子秤）进行 TCP 通信。
 */
import net from "net";
const socket = new net.Socket();

/**
 * PromiseSocket - Promise 风格的 TCP Socket 封装类
 */
export class PromiseSocket {
    constructor() {
        this.socket = new net.Socket();
    }

    /**
     * 建立 TCP 连接
     * @param {number} port - 目标端口
     * @param {string} host - 目标 IP
     * @returns {Promise<void>}
     */
    async connect(port, host) {
        return new Promise((resolve) => {
            socket.connect(port, host, () => {
                console.log(`Connect To ${host}:${port}`);
                resolve();
            });
        });
    }

    /**
     * 发送数据并等待响应
     *
     * 同时监听 data/error/close 三个事件，任一触发就移除其他监听器并完成 Promise。
     *
     * @param {Buffer|string} data - 要发送的数据
     * @returns {Promise<Buffer>} 设备返回的数据
     */
    write(data) {
        return new Promise((resolve, reject) => {

            /** 错误事件处理：移除所有监听并 reject */
            const handleError = (err) => {
                removeAllListen();
                reject(err);
            }

            /** 收到数据时：移除所有监听并 resolve */
            const handleData = (data) => {
                removeAllListen();
                resolve(data);
            }

            /** Socket 关闭时：移除所有监听并 reject */
            const handleClose = () => {
                removeAllListen();
                reject();
            }

            /** 移除所有临时监听器，避免重复触发 */
            const removeAllListen = () => {
                this.socket.removeListener("data", handleData);
                this.socket.removeListener("error", handleError);
                this.socket.removeListener("close", handleClose);
            }

            this.socket.on("data", handleData);
            this.socket.on("error", handleError);
            this.socket.on("close", handleClose);

            this.socket.write(data);
        });
    }
}