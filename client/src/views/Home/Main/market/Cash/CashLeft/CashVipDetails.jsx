/**
 * @file CashVipDetails.jsx
 * @description 收银界面会员信息展示组件，展示卡号、积分、手机号等详细信息
 * @module views/Home/Main/market/Cash/CashLeft/CashVipDetails
 */
import React from "react";
import styled from "../../../../../../styles/cash.scss";({ label, value }) {
    return (
        <div className={styled["cash-vip-details"]}>
            <span className={styled["label"]}>{label}:&nbsp;&nbsp;</span>
            <span className={styled["value"]}>{value}</span>
        </div>
    );
}

export function CashVipDetails({ vip }) {

    const { code, name, type = "积分卡", phone, vip_sum, consume_count } = vip;
    if (!code) return null;

    return (
        <div className={styled["cash-vip"]}>
            <VipDetails label="会员卡类型" value={type} />
            <VipDetails label="会员卡号" value={code} />
            <VipDetails label="会员姓名" value={name} />
            <VipDetails label="会员积分" value={vip_sum} />
            <VipDetails label="手机号码" value={phone} />
            <VipDetails label="消费次数" value={consume_count} />
        </div>
    );
}