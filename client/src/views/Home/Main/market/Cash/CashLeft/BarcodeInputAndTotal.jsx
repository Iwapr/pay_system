/**
 * @file BarcodeInputAndTotal.jsx
 * @description 收银左侧条码输入与订单合计组件，支持客显同步和多商品选择
 * @module views/Home/Main/market/Cash/CashLeft/BarcodeInputAndTotal
 */
import React, { useRef, useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import styled from "../../../../../../styles/cash.scss";
import { useAjax } from "../../../../../AjaxProvider";
import { CommodityTasks } from "../../../../../../tasks/commodity";
import { SelectCommodity } from "../Dialog/SelectCommodity";
import { CameraScanner } from "../Dialog/CameraScanner";
import { ClientDisplay } from "../../../../../../device/client_display";

const { Search } = Input;

function formatValue(value) {
    const str = String(value);
    const index = str.indexOf(".");
    if (index === -1) {
        return (
            <span className={styled["value"]}>
                {str}
            </span>
        );
    }

    const int = str.slice(0, index);
    const float = str.slice(index + 1);
    return (
        <span className={styled["value"]}>
            {int}.
            <span className={styled["float"]}>{float}</span>
        </span>
    );
}

/**
 * 识别扫码枪扫入的内容是否为移动支付付款码
 * 支付宝付款码：以 25~30 开头，共 16~24 位纯数字
 * 微信付款码：以 10~15 开头，共 18 位纯数字
 * @param {string} code
 * @returns {{ isPayCode: boolean, payType: string|null }}
 */
function detectPayCode(code) {
    const str = code.trim();
    if (!/^\d+$/.test(str)) return { isPayCode: false, payType: null };
    const prefix = parseInt(str.slice(0, 2), 10);
    if (str.length >= 16 && str.length <= 24 && prefix >= 25 && prefix <= 30) {
        return { isPayCode: true, payType: "支付宝" };
    }
    if (str.length === 18 && prefix >= 10 && prefix <= 15) {
        return { isPayCode: true, payType: "微信" };
    }
    return { isPayCode: false, payType: null };
}

export function BarcodeInputAndTotal({
    addCommodity,
    value,
    setValue,
    hotkey,
    count,
    money,
    onPayCodeScanned
}) {

    const ajax = useAjax();

    useEffect(() => {
        ClientDisplay.show({
            all_price: money
        });
        // 通过客显显示当前订单价格
    }, [money]);

    const inputRef = useRef(null);
    const [selectCommodityData, setSelectCommodityData] = useState({
        show: false,
        list: []
    });
    const [cameraScannerVisible, setCameraScannerVisible] = useState(false);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // 全局键盘监听：当焦点不在任何可输入元素上时，自动将按键内容导向搜索框
    // 这样扫码枪在任何时候扫码都能直接进入搜索框，不需要先手动点击搜索框
    useEffect(() => {
        function handleGlobalKeyDown(e) {
            const active = document.activeElement;
            const tag = active ? active.tagName : "";
            const isInputLike = tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable);
            if (isInputLike) return; // 焦点已在输入框，不干预

            // 过滤掉功能键、修饰键、快捷键组合
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (e.key.length !== 1) return; // 只处理可打印字符

            // 如果有模态框打开（除了SelectCommodity自身），不劫持输入
            // 检查是否有可见的 ant-modal-wrap（display 非 none）
            const openModal = Array.from(document.querySelectorAll(".ant-modal-wrap"))
                .some(el => el.style.display !== "none" && el.offsetParent !== null);
            if (openModal) return;

            // 将焦点转移到搜索框并追加字符
            const searchInput = inputRef.current && inputRef.current.input;
            if (!searchInput) return;
            searchInput.focus();
            // value 是受控值，通过父组件的 setValue 更新
            // 这里直接用闭包捕获的 value（注意：useEffect 依赖包含 value 和 setValue）
            setValue(value + e.key);
            e.preventDefault();
        }

        document.addEventListener("keydown", handleGlobalKeyDown);
        return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }, [value, setValue]);

    function closeSelectCommodity(args) {
        // 隐藏选择商品对话框

        setSelectCommodityData({
            show: false,
            list: []
        });

        if (args) {
            addCommodity(args);
        }
        setValue("");
    }

    function handleHotKey(e) {
        const { key } = e;
        const item = hotkey.find(t => t.key === key);
        item && (() => {
            e.preventDefault();
            item.fn();
        })();
    }

    function handleChange({ target }) {
        setValue(target.value);
    }

    function handleCameraScanned(code) {
        setCameraScannerVisible(false);
        setValue(code.trim().toUpperCase());
        // 延迟一帧确保 value 已更新后再触发查询
        setTimeout(async () => {
            try {
                const { data } = await CommodityTasks.query(ajax, code.trim().toUpperCase());
                if (data.length === 0) {
                    Modal.error({
                        title: `找不到 ${code} 相关的商品信息!`,
                        autoFocusButton: null,
                        okText: "关闭"
                    });
                } else if (data.length === 1) {
                    const [details] = data;
                    if (details.is_delete) {
                        Modal.error({ title: "此商品已被下架，无法销售!" });
                    } else if (details.sale_price === 0) {
                        Modal.error({ title: "此商品尚未设置销售价格，请联系管理员!" });
                    } else {
                        addCommodity(details);
                        setValue("");
                    }
                } else {
                    setSelectCommodityData(s => ({ ...s, list: data, show: true }));
                }
            } catch (error) {
                console.log(error);
            }
        }, 0);
    }

    async function queryCommodity() {
        if (value === "" || value.trim() === "") return;

        // 先检测是否为移动支付付款码（支付宝/微信）
        const { isPayCode, payType } = detectPayCode(value);
        if (isPayCode) {
            setValue("");
            if (onPayCodeScanned) {
                onPayCodeScanned(payType, value.trim());
            }
            return;
        }

        try {
            const { data } = await CommodityTasks.query(ajax, value.trim().toUpperCase());
            if (data.length === 0) {
                Modal.error({
                    title: `找不到 ${value}相关的商品信息!`,
                    autoFocusButton: null,
                    okText: "关闭"
                });
            } else if (data.length === 1) {
                const [details] = data;
                if (details.is_delete) {
                    Modal.error({
                        title: "此商品已被下架，无法销售!"
                    });
                } else if (details.sale_price === 0) {
                    Modal.error({
                        title: "此商品尚未设置销售价格，请联系管理员!"
                    });
                } else {
                    addCommodity(details);
                    setValue("");
                }
            } else {
                setSelectCommodityData(s => ({
                    ...s,
                    list: data,
                    show: true
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styled["cash-top"]}>
            <Search
                className={styled["input-wrap"]}
                value={value}
                ref={inputRef}
                style={{ width: 250 }}
                onChange={handleChange}
                onKeyDown={handleHotKey}
                onSearch={queryCommodity}
            />
            <Button
                icon="camera"
                title="摄像头扫码"
                style={{ marginLeft: 6, flexShrink: 0 }}
                onClick={() => setCameraScannerVisible(true)}
            />
            <CameraScanner
                visible={cameraScannerVisible}
                onClose={() => setCameraScannerVisible(false)}
                onScanned={handleCameraScanned}
            />
            <div className={styled["cash-total"]}>
                <p>数量:&nbsp;&nbsp;
                    {
                        formatValue(count)
                    }
                </p>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p>总价:&nbsp;&nbsp;
                    {
                        formatValue(money)
                    }
                </p>
            </div>
            <SelectCommodity data={selectCommodityData} closeFn={closeSelectCommodity} />
        </div>
    );
}