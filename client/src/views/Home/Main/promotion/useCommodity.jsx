/**
 * @file useCommodity.jsx
 * @description 促销活动商品数据管理自定义 Hook，提供参与促销商品信息的加载与搜索功能
 * @module views/Home/Main/promotion/useCommodity
 */
import { useState, useEffect } from "react";
import { PromotionManage } from "../../../../tasks/promotion";

export function useCommodity(name, ajax, onMount) {
    // 获取参加促销活动的所有商品信息

    const [commodityList, setCommodityList] = useState([]);
    // 商品列表

    async function flushCommodityList(name, afterHookFn) {

        if (!name) {
            afterHookFn && afterHookFn();
            return;
        }

        try {
            const { data } = await PromotionManage.getPromoCommodity(ajax, name);

            setCommodityList(data);

            afterHookFn && afterHookFn(data);
        } catch (error) {
            console.log(error);
        }
    }

    function flushList(name, onUpdate) {
        flushCommodityList(name, onUpdate);
    }

    useEffect(() => {
        flushCommodityList(name, onMount);
    }, []);

    return [commodityList, setCommodityList, flushList];
}