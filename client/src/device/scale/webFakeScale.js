/**
 * @file webFakeScale.js
 * @description Web 演示版电子秤模拟类，由于 Web 环境无法直接连接电子秤硬件，
 * 本类模拟 PLU 数据发送过程，逐条延时触发回调以替代真实设备响应。
 * @module device/scale/webFakeScale
 */
export class WebFakeScale {

    // web演示版本无法连接电子秤，所以直接返回假响应

    async sendPlu({ data, onItemEnd, onEnd, onError }) {

        async function delay(time = 300) {
            // 延时
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, time);
            });
        }

        for (let i = 0; i < data.length; i++) {
            await delay(50);
            // 延时一段时间 

            onItemEnd(i + 1);
            // 调用单条数据更新完成的回调
        }

        // onError(new Error("未知错误!"));
        // 模拟错误

        onEnd();

    }
}