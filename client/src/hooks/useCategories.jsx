/**
 * client/src/hooks/useCategories.jsx - 商品分类数据加载 Hook
 *
 * 封装分类树的异步加载逻辑，支持多种过滤模式。
 *
 * @param {Object}   options
 * @param {Function} options.ajax          - Ajax 请求实例（来自 AjaxProvider context）
 * @param {boolean}  [options.onlyParent=false]  - true 则只返回根分类（即没有父节点的）
 * @param {boolean}  [options.onlyHasChild=false] - true 则只返回拥有子分类的父分类
 * @returns {[Array]} 分类列表数组
 */
import { useState, useEffect } from "react";
import { CategoriesTask } from "../tasks/categories";

export function useCategories({
    ajax,
    onlyParent = false,
    onlyHasChild = false
}) {

    const [categories, setCategories] = useState([]);

    async function getCategories() {
        try {
            const { data } = await CategoriesTask.getCategoriesTree(ajax);
            if (onlyParent) {
                // 只需要根分类（parent_id 为空的节点）
                return setCategories(data.filter(i => !i.parent_id));
            }

            if (onlyHasChild) {
                // 收集已有子节点的父节点 ID 列表
                const hasChildIdList = data.filter(i => i.parent_id)
                    .reduce((list, { parent_id }) => {
                        !list.includes(parent_id) && list.push(parent_id);
                        return list;
                    }, []);

                // 只返回拥有子分类的父分类
                return setCategories(data.filter(({ parent_id }) => hasChildIdList.includes(parent_id)));
            }

            // 默认返回全部分类
            return setCategories(data);
        } catch (error) {
            console.log(error);
        }
    }

    // 组件挂载时自动加载分类数据
    useEffect(() => {
        getCategories();
    }, []);

    return [categories];
}