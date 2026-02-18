/**
 * @file ProportionFn.jsx
 * @description 销售占比操作栏组件，提供商品类目级联选择与时间范围筛选功能
 * @module views/Home/Main/statistics/proportion/ProportionFn
 */
import React from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { Cascader } from "antd";

export function ProportionFn({
    changeTimeBtn,
    currentType,
    option,
    setCurrentType
}) {


    return (
        <div className={styled["sales-fn-wrap"]}>
            {changeTimeBtn}
            <Cascader
                className={styled["select-type-wrap"]}
                value={currentType}
                options={option}
                allowClear={false}
                expandTrigger="hover"
                onChange={setCurrentType}
                placeholder="请选择分析类型"
            />
        </div>
    );
}