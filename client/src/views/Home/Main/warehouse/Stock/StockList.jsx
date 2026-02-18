/**
 * @file StockList.jsx
 * @description 进货记录列表组件，展示历史进货单据信息并支持选中查看详情
 * @module views/Home/Main/warehouse/Stock/StockList
 */
import React, { useMemo } from "react";
import styled from "../../../../../styles/warehouse/stock.scss";
import { VirtualSelectList } from "../../../../../components/VirtualSelectList";
import { getFormatTime } from "../../../../../tools/time";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 5
    },
    {
        title: "供货商",
        key: "supplier_name",
        type: 2
    },
    {
        title: "建立时间",
        key: "date",
        type: 2
    },
    {
        title: "备注",
        key: "description",
        type: 2
    }
];

const getFooterColumns = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function StockList({
    list,
    selectId,
    selectType,
    handleClickSelect
}) {

    const data = useMemo(() => list.map(i => ({
        ...i,
        date: getFormatTime(i.date)
    })), [list]);

    const footerData = useMemo(() => getFooterColumns(list.length), [list.length]);

    return (
        <VirtualSelectList
            wrapCss={styled["stock-left"]}
            select={selectId}
            data={data}
            selectType={selectType}
            columns={columns}
            footerColumn={footerData}
            handleClickSelect={handleClickSelect}
        />
    );
}