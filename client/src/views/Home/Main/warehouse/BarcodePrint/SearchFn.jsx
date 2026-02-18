/**
 * @file SearchFn.jsx
 * @description 条码打印搜索功能组件，支持按商品名称或条码搜索并展示结果
 * @module views/Home/Main/warehouse/BarcodePrint/SearchFn
 */
import React, { useRef, useState } from "react";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { Input } from "antd";

const { Search } = Input;

export function SearchFn({
    children,
    handleSearch
}) {

    const inputRef = useRef(null);

    function cleanInput(len = 10) {

        return () => {
            const { input } = inputRef.current.input;
            input.setSelectionRange(0, len);
        };
    }

    function onSearch(query) {

        handleSearch(query, cleanInput(query.length));

    }

    return (
        <div className={styled["search-fn-wrap"]}>
            <Search
                placeholder="请在此输入要查询的商品信息..."
                onSearch={onSearch}
                className={styled["search-input"]}
                ref={inputRef}
            />
            {children}
        </div>
    );
}