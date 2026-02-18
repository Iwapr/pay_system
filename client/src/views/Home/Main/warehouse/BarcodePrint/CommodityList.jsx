/**
 * @file CommodityList.jsx
 * @description 条码打印商品列表组件，展示库内全部可打印条码的商品数据
 * @module views/Home/Main/warehouse/BarcodePrint/CommodityList
 */
import React from "react";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { GlobalList } from "./GlobalList";

export function CommodityList(props) {

    return (
        <GlobalList
            {...props}
            wrapCss={styled["commodity-list-wrap"]}
        />
    );
}