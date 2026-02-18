/**
 * client/src/components/CustomSelectTree.jsx - 树形下拉选择组件
 *
 * 基于 Ant Design TreeSelect 封装的带图标的树形下拉选择器。
 * 支持复层分类树，并可用 onlyParent 限制只显示莛节点。
 *
 * @param {string}   value          - 当前选中的值
 * @param {Function} onChange       - 选择变更回调
 * @param {Array}    tree           - 分类树数据（[{id, name, children?}]）
 * @param {boolean}  onlyParent     - 是否只显示莛节点（默认 false）
 * @param {string}   placeholder   - 输入框占位文字
 * @param {boolean}  expandAll      - 是否默认展开所有节点（默认 false）
 */
import React from "react";
import { Icon, TreeSelect } from "antd";


function renderSelectNodes(tree, onlyParent = false) {
    const { TreeNode } = TreeSelect;

    if (onlyParent) {
        return tree.map(({ id, name }) => (
            <TreeNode icon={<Icon type="tags" />} value={name} title={name} key={id} />
        ));
    }
    return tree.map(({ id, name, children }) => {
        if (children) {
            return (
                <TreeNode icon={<Icon type="tags" />} value={name} title={name} key={id} >
                    {
                        renderSelectNodes(children)
                    }
                </TreeNode>
            )
        } else {
            return (
                <TreeNode icon={<Icon type="tag" />} value={name} title={name} key={id} />
            );
        }
    });
}

export function CustomSelectTree({
    value,
    onChange,
    tree,
    onlyParent = false,
    placeholder,
    expandAll = false
}) {
    return (
        <TreeSelect
            showSearch
            treeIcon={true}
            value={value}
            placeholder={placeholder}
            allowClear
            treeDefaultExpandAll={expandAll}
            onChange={onChange}
        >
            {
                renderSelectNodes(tree, onlyParent)
            }
        </TreeSelect>
    );
}