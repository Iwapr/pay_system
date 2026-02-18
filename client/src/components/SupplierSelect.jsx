/**
 * client/src/components/SupplierSelect.jsx - 供应商下拉选择组件
 *
 * 封装了 CustomSelectTree，在组件加载时自动获取供应商列表。
 * 当 value 为 null 时自动选中第一个供应商（默认供应商逻辑）。
 *
 * @param {string}   value         - 当前选中的供应商名称
 * @param {Function} handleChange  - 选择变更时的回调函数
 * @param {object}   ajax          - AjaxProvider 提供的 HTTP 实例
 */
import React, { useState, useEffect } from "react";
import { SupplierTask } from "../tasks/supplier";
import { CustomSelectTree } from "./CustomSelectTree";

export function SupplierSelect({ value = "", handleChange, ajax }) {

    const [supplierList, setSupplierList] = useState([]);

    async function getSupplierList() {
        try {
            const { data } = await SupplierTask.getSupplier(ajax);
            setSupplierList(data);
            if (value === null) {
                // 如果为null 则设置为默认供货商
                handleChange(data[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSupplierList();
    }, []);

    return (
        <CustomSelectTree
            placeholder="选择供应商"
            tree={supplierList}
            onChange={handleChange}
            value={value}
        />
    )
}
