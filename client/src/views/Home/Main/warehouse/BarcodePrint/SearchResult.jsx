/**
 * @file SearchResult.jsx
 * @description 条码打印搜索结果展示组件，展示按关键字搜索商品后的匹配列表
 * @module views/Home/Main/warehouse/BarcodePrint/SearchResult
 */
import React from "react";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { GlobalList } from "./GlobalList";

export function SearchResult(props) {

    return (
        <GlobalList
            {...props}
            wrapCss={styled["search-result-wrap"]}
        />
    );
}