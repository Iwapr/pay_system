/**
 * @file Checkout.jsx
 * @description 结账弹窗组件，支持多种支付方式、自动打印小票和自动开錢笱
 * @module views/Home/Main/market/Cash/Dialog/Checkout
 */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAjax } from "../../../../../AjaxProvider";
import { Modal, Statistic, Radio, Input, Button, Switch } from "antd";
import styled from "../../../../../../styles/cash.scss";
import { mathc } from "../../../../../../tools/mathc";
import config from "../../../../../../config";
import { PosPrint } from "../../../../../../device/pos_print";
import { MoneyBox } from "../../../../../../device/money_box";
import { Order } from "../../../../../../tasks/frontOrder";
import { resetOrderAction, addOrderToHistoryAction } from "../../../../../../redux/action";
import { ClientDisplay } from "../../../../../../device/client_display";

const { confirm } = Modal;

const { GLOBAL_FRONT_BOX_STATUS, GLOBAL_FRONT_AUTO_PRINT_STATUS } = config;

function DeviceStatus({ value, status, fn, hotkey }) {

    return (
        <div>
            <Switch
                checked={status}
                onChange={fn}
            />&nbsp;
            {value}
            {`<${hotkey}>`}
        </div>
    );
}

export function Checkout({
    status,
    hideFn,
    money: sale_price,
    origin_price,
    list,
    vipCode
}) {

    const dispatch = useDispatch();

    const ajax = useAjax();

    const [printStatus, setPrintStatus] = useState(localStorage.getItem(GLOBAL_FRONT_AUTO_PRINT_STATUS) !== "hide");
    // 是否自动打印小票

    const [moneyBoxStatus, setBoxStatus] = useState(localStorage.getItem(GLOBAL_FRONT_BOX_STATUS) !== "hide");
    // 结账完成自动打开钱箱


    function handleBoxConfig(b) {
        function save(bool) {
            if (bool) {
                localStorage.removeItem(GLOBAL_FRONT_BOX_STATUS);
            } else {
                localStorage.setItem(GLOBAL_FRONT_BOX_STATUS, "hide");
            }
        }

        if (b === undefined) {
            save(!moneyBoxStatus);
            setBoxStatus(s => !s);
        } else {
            save(b);
            setBoxStatus(b);
        }
    }

    function handlePrintConfig(b) {
        function save(bool) {
            if (bool) {
                localStorage.removeItem(GLOBAL_FRONT_AUTO_PRINT_STATUS);
            } else {
                localStorage.setItem(GLOBAL_FRONT_AUTO_PRINT_STATUS, "hide");
            }
        }

        if (b === undefined) {
            save(!printStatus);
            setPrintStatus(s => !s);
        } else {
            save(b);
            setPrintStatus(b);
        }
    }


    const hotKeyList = [
        {
            value: "现金",
            hotkey: "F1"
        },
        {
            value: "支付宝",
            hotkey: "F2"
        },
        {
            value: "微信",
            hotkey: "F3"
        },
        {
            value: "小票打印",
            hotkey: "F4",
            status: printStatus,
            fn: handlePrintConfig,
            device: true
        },
        {
            value: "自动开启钱箱",
            hotkey: "F5",
            status: moneyBoxStatus,
            fn: handleBoxConfig,
            device: true
        }
    ];

    const inputRef = useRef(null);
    const [data, setData] = useState({
        show_client_pay: sale_price,
        // 结账界面左侧的实付金额，当右侧输入的金额(client_pay)是合法数值时会和这里同步
        client_pay: sale_price,


        pay_type: hotKeyList[0].value,
        // 支付方式选择

        change: 0
        // 找零金额
    });

    const { show_client_pay, client_pay, pay_type, change } = data;

    const isAlipay = pay_type === "支付宝";

    // 支付宝专属状态
    const [alipay, setAlipay] = useState({
        authCode: "",          // 扫码枪扫入的授权码
        status: "idle",        // idle | paying | success | fail
        message: ""            // 成功时为 tradeNo，失败时为错误原因
    });

    const alipayInputRef = useRef(null);

    const checkPassFlag = list.length > 0 && (
        isAlipay
            ? alipay.authCode.length >= 16   // 支付宝模式：授权码长度合法即可点击
            : String(show_client_pay) === String(client_pay) && change >= 0
    );

    function closeModal() {
        hideFn();
        setData(s => ({
            ...s,
            pay_type: hotKeyList[0].value,
            change: 0
        }));
        setAlipay({ authCode: "", status: "idle", message: "" });
        ClientDisplay.reset();
    }

    const changeStyle = {
        color: "red"
    }

    const moneyStyle = {
        color: "#4c8bf5"
    }

    function handlePayTypeChange({ target }) {
        setData(s => ({
            ...s,
            pay_type: target.value
        }));
        // 切换支付方式时重置支付宝状态
        setAlipay({ authCode: "", status: "idle", message: "" });
    }

    function handleClientPay({ target }) {
        // 将输入的用户付款金额同步到state里


        const { value } = target;
        if (value.length >= 9) return;


        const v = (() => {
            if (value === "" || value[value.length - 1] === ".") return value;
            const num = Number(value);
            return Number.isNaN(num) ? value : num;
        })();

        if (typeof v === "number") {
            if (v < 0 || v > 999999) return;
            const index = value.indexOf(".");
            if (index !== -1 && value.slice(index + 1).length > 2) return;
            // 小数位超过两位时return

            setData(s => ({
                ...s,
                client_pay: value,
                change: mathc.subtract(v, sale_price),
                show_client_pay: v
            }));

            ClientDisplay.show({
                pay_price: v,
                change: mathc.subtract(v, sale_price),
            });
        } else {
            if (v === "") {
                setData(s => ({
                    ...s,
                    client_pay: v,
                    change: mathc.subtract(0, sale_price),
                    show_client_pay: 0,
                }));
                ClientDisplay.show({
                    pay_price: 0,
                    change: mathc.subtract(0, sale_price)
                });
            } else {
                setData(s => ({
                    ...s,
                    client_pay: v
                }));
            }
        }

    }

    /**
     * 支付宝条码支付流程
     * 1. 检验授权码格式（16-24位数字）
     * 2. 调后端 alipay-pay（后端轮询支付宝最多30秒）
     * 3. 成功 → 自动提交订单到 POS 数据库 → 关闭弹窗、打印小票
     * 4. 失败 → 显示错误，允许重新扫码
     */
    async function checkAlipay() {
        if (!checkPassFlag || alipay.status === "paying") return;
        if (!/^\d{16,24}$/.test(alipay.authCode)) {
            setAlipay(s => ({ ...s, status: "fail", message: "付款码格式不正确，请重新扫码" }));
            return;
        }

        setAlipay(s => ({ ...s, status: "paying", message: "" }));

        const out_trade_no = Date.now();

        try {
            const { data: result } = await Order.alipayPay(ajax, {
                auth_code: alipay.authCode,
                total_amount: sale_price,
                subject: "收银台消费",
                out_trade_no
            });

            if (!result.success) {
                setAlipay(s => ({ ...s, status: "fail", message: result.message || "支付失败" }));
                return;
            }

            // 支付成功 → 提交订单到 POS 数据库
            setAlipay(s => ({ ...s, status: "success", message: `支付成功  流水号: ${result.tradeNo}` }));
            await end();

        } catch (err) {
            setAlipay(s => ({
                ...s,
                status: "fail",
                message: err?.response?.data?.message || "网络异常，请检查连接后重试"
            }));
        }
    }

    /**
     * 提交订单到 POS 数据库，打印小票（现金、微信、支付宝支付成功后均调此函数）
     */
    async function end() {
        let allCount = 0;
        const commodity_list = list.map(
            ({
                barcode,
                origin_price,
                sale_price,
                count,
                status
            }) => {
                allCount = mathc.add(allCount, count);
                return {
                    barcode,
                    origin_price,
                    sale_price,
                    count,
                    status
                };
            }
        );

        const orderData = {
            pay_type,
            client_pay: show_client_pay,
            change,
            origin_price,
            sale_price,
            commodity_list,
            count: allCount
        };
        if (vipCode) {
            orderData["vip_code"] = vipCode;
        }

        moneyBoxStatus && MoneyBox.open();
        // 打开钱箱

        const { data } = await Order.submitOrder(ajax, orderData);
        // 提交订单

        closeModal();
        // 关闭结账界面

        dispatch(resetOrderAction());
        // 清空当前收银界面

        dispatch(addOrderToHistoryAction(data));
        // 提交订单信息到历史订单里
        printStatus && PosPrint.print(data);
    }

    function check() {
        // 结账（现金/微信模式）
        if (isAlipay) { checkAlipay(); return; }
        if (!checkPassFlag) return;

        if (change > 100) {
            confirm({
                okText: "继续",
                title: "找零金额大于100，继续吗?",
                onOk: end,
                autoFocusButton: "cancel"
            });
        } else end();
    }

    function handleHotKey(e) {
        // 处理快捷键

        const { key } = e;
        const item = hotKeyList.find(({ hotkey }) => hotkey === key);
        item && (!item.device ? (() => {
            if (item.value == pay_type) return;
            e.preventDefault();
            setData(s => ({
                ...s,
                pay_type: item.value
            }));
            setAlipay({ authCode: "", status: "idle", message: "" });
        })() : item.fn());
    }

    useEffect(() => {
        if (!status) return;
        setTimeout(() => {
            // 当打开结账界面时将订单金额同步到结账界面里并聚焦和选中付款金额

            setData(s => ({
                ...s,
                show_client_pay: sale_price,
                client_pay: sale_price
            }));
            if (isAlipay) {
                alipayInputRef.current && alipayInputRef.current.focus();
            } else {
                const { current } = inputRef;
                current && current.focus();
                current && current.input && current.input.setSelectionRange(0, 10);
            }
        });
    }, [status]);

    return (
        <Modal
            visible={status}
            title="结账"
            closable={false}
            onCancel={closeModal}
            footer={null}
            width={500}
            className={styled["cash-dialog-checkout"]}
        >
            <div className={styled["wrap"]}>
                <div>
                    <Statistic
                        title="应付金额"
                        value={origin_price}
                        precision={2}
                    />
                    <Statistic
                        title="实际金额"
                        value={sale_price}
                        valueStyle={moneyStyle}
                        precision={2}
                    />
                    <Statistic
                        title="实付金额"
                        value={show_client_pay}
                        precision={2}
                    />
                    <Statistic
                        title="找零金额"
                        value={change}
                        valueStyle={changeStyle}
                        precision={2}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexFlow: "column"
                    }}
                >
                    <div
                        className={styled["device-status-wrap"]}
                    >
                        <p>设备状态: </p>
                        <div className={styled["device-status"]}>
                            {
                                hotKeyList
                                    .filter(({ device }) => device)
                                    .map(({ value, status, fn, hotkey }) => (
                                        <DeviceStatus
                                            key={value}
                                            value={value}
                                            status={status}
                                            fn={fn}
                                            hotkey={hotkey}
                                        />
                                    ))
                            }
                        </div>
                    </div>
                    <div className={styled["pay-type-wrap"]}>
                        <p>支付方式: </p>
                        <Radio.Group
                            value={pay_type}
                            onChange={handlePayTypeChange}
                            name="pay_type"
                        >
                            {
                                hotKeyList
                                    .filter(({ device = false }) => !device)
                                    .map(
                                        ({ value, hotkey }) => (
                                            <Radio
                                                key={value}
                                                value={value}
                                            >
                                                {`${value}<${hotkey}>`}
                                            </Radio>
                                        )
                                    )
                            }
                        </Radio.Group>
                    </div>
                    <div className={styled["check-wrap"]}>
                        {isAlipay ? (
                            // 支付宝模式：显示扫码输入框
                            <>
                                <p>付款码: </p>
                                <div className={styled["input-wrap"]}>
                                    <Input
                                        size="large"
                                        ref={alipayInputRef}
                                        value={alipay.authCode}
                                        placeholder="请用扫码枪扫描顾客手机付款码"
                                        disabled={alipay.status === "paying"}
                                        onChange={e => {
                                            // React 16 事件池化：必须在进入 setAlipay 前先取出值，
                                            // 否则 updater 函数执行时 e 已被回收，e.target 为 null 会崩溃白屏
                                            const authCode = e.target.value.replace(/\D/g, "");
                                            setAlipay(s => ({
                                                ...s,
                                                authCode,
                                                status: "idle",
                                                message: ""
                                            }));
                                        }}
                                        onKeyDown={handleHotKey}
                                        onPressEnter={check}
                                    />
                                    <Button
                                        onClick={check}
                                        type="primary"
                                        size="large"
                                        loading={alipay.status === "paying"}
                                        disabled={!checkPassFlag || alipay.status === "paying"}
                                    >
                                        {alipay.status === "paying" ? "支付中..." : "收款"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // 现金/微信模式：原有付款金额输入框
                            <>
                                <p>付款金额: </p>
                                <div className={styled["input-wrap"]}>
                                    <Input
                                        size="large"
                                        ref={inputRef}
                                        value={client_pay}
                                        placeholder="请输入付款金额"
                                        onChange={handleClientPay}
                                        onKeyDown={handleHotKey}
                                        onPressEnter={check}
                                    />
                                    <Button
                                        onClick={check}
                                        type="primary"
                                        size="large"
                                        disabled={!checkPassFlag}
                                    >结账</Button>
                                </div>
                            </>
                        )}
                    </div>
                    {/* 支付宝支付结果区（原作者留的空白占位） */}
                    {isAlipay && alipay.status !== "idle" && (
                        <div style={{
                            marginTop: 12,
                            padding: "8px 12px",
                            borderRadius: 4,
                            background: alipay.status === "success" ? "#f6ffed" : alipay.status === "paying" ? "#e6f7ff" : "#fff2f0",
                            border: `1px solid ${alipay.status === "success" ? "#b7eb8f" : alipay.status === "paying" ? "#91d5ff" : "#ffccc7"}`,
                            color: alipay.status === "success" ? "#52c41a" : alipay.status === "paying" ? "#1890ff" : "#ff4d4f",
                            fontSize: 13
                        }}>
                            {alipay.status === "paying" && "⏳ 正在请求支付宝，请稍候..."}
                            {alipay.status === "success" && `✅ ${alipay.message}`}
                            {alipay.status === "fail" && (
                                <>
                                    <span>❌ {alipay.message}</span>
                                    <Button
                                        size="small"
                                        style={{ marginLeft: 12 }}
                                        onClick={() => {
                                            setAlipay({ authCode: "", status: "idle", message: "" });
                                            setTimeout(() => alipayInputRef.current && alipayInputRef.current.focus(), 50);
                                        }}
                                    >重新扫码</Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}