/**
 * @file CountCard.jsx
 * @description 首页数据统计卡片组件，以图标+数值形式展示多个业务指标
 * @module views/Home/Main/home/common/CountCard
 */
import React from "react";
import styled from "../../../../../styles/home.scss";
import { IconOnline } from "../../../../../components/IconOnline";

function box({ label, value, icon, color }) {
    return (
        <div key={label} className={styled["item-wrap"]}>
            <div className={styled["item-value"]}>
                <p
                    className={styled["value"]}
                    style={{ color }}
                >{value}</p>
                <p className={styled["key"]}>{label}</p>
            </div>
            <IconOnline
                type={icon}
                className={styled["item-icon"]}
            />
        </div>
    );
}

export function CountCard({
    config,
    cssHook
}) {


    return (
        <div className={cssHook(styled["count-wrap"])}>
            {
                config.map(value => box(value))
            }
        </div>
    );
}

