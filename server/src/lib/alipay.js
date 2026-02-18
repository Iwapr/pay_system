/**
 * server/src/lib/alipay.js - 支付宝当面付封装
 *
 * 使用支付宝官方 alipay-sdk，封装「条码支付」和「查询订单」两个核心操作：
 *
 *  - AlipayService.pay(authCode, totalAmount, subject, outTradeNo)
 *      → 调用 alipay.trade.pay，发起条码支付
 *      → 若返回 WAIT_BUYER_PAY 则自动轮询最多 10 次（每次间隔 3s）
 *      → 最终返回 { success: true, tradeNo } 或 { success: false, message }
 *
 *  - AlipayService.query(outTradeNo)
 *      → 调用 alipay.trade.query，查询订单当前状态
 *      → 返回支付宝原始 bizContent
 *
 * ============================================================
 * 配置说明（在 server/src/config/common.js 的 alipay 字段中填写）：
 *
 *   appId        - 支付宝开放平台应用 ID
 *   privateKey   - 商户 RSA 私钥（PKCS8 格式，不含头尾行）
 *   alipayPublicKey - 支付宝提供的应用公钥（验签用）
 *
 * 获取方式：https://open.alipay.com → 进入应用 → 开发配置 → 接口加签
 * ============================================================
 */

import { AlipaySdk } from "alipay-sdk";
import config from "../config/index.js";

const { alipay: alipayConfig } = config;

// 初始化 SDK 实例（应用启动时只创建一次）
let alipaySdk = null;

/**
 * 懒初始化 AlipaySdk 实例
 * 如果未配置 appId 则抛出友好错误，方便开发时快速定位
 */
function getClient() {
    if (alipaySdk) return alipaySdk;

    if (!alipayConfig || !alipayConfig.appId || alipayConfig.appId === "YOUR_APP_ID") {
        throw new Error("支付宝尚未配置，请在 server/src/config/common.js 的 alipay 字段中填入真实密钥");
    }

    alipaySdk = new AlipaySdk({
        appId: alipayConfig.appId,
        privateKey: alipayConfig.privateKey,
        alipayPublicKey: alipayConfig.alipayPublicKey,
        keyType: "PKCS8",   // 私钥格式：PKCS8（对应 -----BEGIN PRIVATE KEY-----）
        signType: "RSA2",   // 签名算法：RSA2 = SHA256withRSA（支付宝推荐）
        gateway: alipayConfig.sandbox
            ? "https://openapi-sandbox.dl.alipaydev.com/gateway.do"  // 沙箱环境
            : "https://openapi.alipay.com/gateway.do",               // 生产环境
        timeout: 10000,
        camelcase: true
    });

    return alipaySdk;
}

/**
 * 等待指定毫秒（用于轮询间隔）
 * @param {number} ms
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 查询支付宝订单状态
 * @param {string} outTradeNo - 商户订单号
 * @returns {Promise<object>} 支付宝返回的 bizContent
 */
async function query(outTradeNo) {
    const client = getClient();
    const result = await client.exec("alipay.trade.query", {
        bizContent: {
            out_trade_no: String(outTradeNo)
        }
    });
    return result;
}

/**
 * 发起条码支付，并自动轮询等待结果
 *
 * @param {string} authCode      - 顾客付款码（扫码枪扫到的授权码字符串）
 * @param {number} totalAmount   - 实付金额（元，保留两位小数）
 * @param {string} subject       - 订单标题（如门店名称 + 消费）
 * @param {string|number} outTradeNo - 商户唯一订单号（使用系统 order_id）
 *
 * @returns {Promise<{success: boolean, tradeNo?: string, message?: string}>}
 */
async function pay(authCode, totalAmount, subject, outTradeNo) {
    const client = getClient();

    // 金额格式化：保留两位小数的字符串（支付宝要求）
    const amount = Number(totalAmount).toFixed(2);

    let result;
    try {
        result = await client.exec("alipay.trade.pay", {
            bizContent: {
                out_trade_no: String(outTradeNo),
                scene: "bar_code",          // 条码支付场景（收银员扫顾客付款码）
                auth_code: authCode,         // 顾客付款码（扫码枪读入）
                subject: subject,            // 订单标题
                total_amount: amount         // 订单金额（元）
            }
        });
    } catch (err) {
        return { success: false, message: err.message || "支付宝请求失败" };
    }

    // --- 支付成功，直接返回 ---
    if (result.code === "10000" && result.tradeStatus === "TRADE_SUCCESS") {
        return { success: true, tradeNo: result.tradeNo };
    }

    // --- 用户需要输密码，进入轮询等待 ---
    if (result.code === "10003" || result.tradeStatus === "WAIT_BUYER_PAY") {
        const MAX_RETRY = 10;       // 最多轮询 10 次
        const INTERVAL_MS = 3000;   // 每次间隔 3 秒

        for (let i = 0; i < MAX_RETRY; i++) {
            await sleep(INTERVAL_MS);
            let queryResult;
            try {
                queryResult = await query(outTradeNo);
            } catch {
                continue; // 查询失败本次跳过，继续尝试
            }

            if (queryResult.tradeStatus === "TRADE_SUCCESS") {
                return { success: true, tradeNo: queryResult.tradeNo };
            }
            if (queryResult.tradeStatus === "TRADE_CLOSED") {
                return { success: false, message: "付款码已过期或交易关闭，请重新扫码" };
            }
            // 仍在 WAIT_BUYER_PAY → 继续等待
        }

        // 超过最大轮询次数，主动撤销订单
        try {
            await client.exec("alipay.trade.cancel", {
                bizContent: { out_trade_no: String(outTradeNo) }
            });
        } catch { /* 撤销失败不影响前端返回错误 */ }

        return { success: false, message: "支付超时（顾客超过30秒未确认），订单已取消" };
    }

    // --- 其他失败情况 ---
    const subMsg = result.subMsg || result.msg || "支付失败";
    return { success: false, message: subMsg };
}

export const AlipayService = { pay, query };
