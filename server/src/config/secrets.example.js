/**
 * server/src/config/secrets.example.js - 密钥配置模板
 *
 * 部署到新环境时：
 *   1. 复制此文件为 secrets.js
 *   2. 将各字段替换为真实密钥
 *
 * secrets.js 已加入 .gitignore，不会被提交到仓库。
 * 此 example 文件会提交到仓库，供团队成员了解需要配置哪些字段。
 */

const secrets = {
    /**
     * 支付宝当面付配置
     * 获取方式：https://open.alipay.com → 进入应用 → 开发配置 → 接口加签
     */
    alipay: {
        appId: "YOUR_ALIPAY_APP_ID",
        privateKey: `-----BEGIN PRIVATE KEY-----
YOUR_RSA2_PRIVATE_KEY_PKCS8_FORMAT
-----END PRIVATE KEY-----`,
        alipayPublicKey: `-----BEGIN PUBLIC KEY-----
YOUR_ALIPAY_PUBLIC_KEY
-----END PUBLIC KEY-----`,
        sandbox: true    // 开发阶段使用沙箱，上线改为 false
    },

    /**
     * 微信支付配置（V3 API）
     * 获取方式：https://pay.weixin.qq.com → 账户中心 → API安全
     */
    // wechatPay: {
    //     appid: "YOUR_WECHAT_APP_ID",
    //     mchid: "YOUR_MERCHANT_ID",
    //     privateKey: `-----BEGIN PRIVATE KEY-----\nYOUR_WECHAT_API_PRIVATE_KEY\n-----END PRIVATE KEY-----`,
    //     serialNo: "YOUR_CERTIFICATE_SERIAL_NO",
    //     apiV3Key: "YOUR_32_CHAR_API_V3_KEY"
    // }
};

export default secrets;
