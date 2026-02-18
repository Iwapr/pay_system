/**
 * client/src/components/LoadingBox.jsx - 加载中展示盐面组件
 *
 * 在内容加载期间展示一个居中的 Ant Design Spin 加载动画。
 *
 * @param {boolean} status      - 是否显示（true = 显示）
 * @param {string}  tip         - 加载Tips文字，默认"加载中，请稍候..."
 * @param {object}  spinProps   - 额外传递给 Ant Design Spin 的属性
 * @param {string}  wrapCss     - 额外自定义包裹 className
 * @param {boolean} noPadding   - 是否去除内边距（嵌入使用时选用）
 */
import React from "react";
import styled from "../styles/components/loading-box.scss";
import { Spin } from "antd";

export function LoadingBox({
    status = true,
    tip = "加载中，请稍候...",
    spinProps = {},
    wrapCss,
    noPadding = false
}) {


    const wrapCssList = [styled["loading-wrap"]];

    noPadding && wrapCssList.push(styled["no-padding"]);

    status && wrapCssList.push(styled["show"]);

    wrapCss && wrapCssList.push(wrapCss);

    return (
        <div
            className={wrapCssList.join(" ")}
        >
            <Spin
                size="large"
                tip={tip}
                {...spinProps}
            />
        </div>
    );
}