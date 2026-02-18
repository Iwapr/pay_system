/**
 * client/src/components/IconOnline.jsx - iconfont 图标组件
 *
 * 基于 Ant Design 的 Icon.createFromIconfontCN 创建的图标组件。
 * scriptUrl 来自 config.ICON_ONLINE_URL，在 offline/online 模式下自动切换。
 *
 * @param {string} type    - iconfont 图标类型（如 "icon-xxx"）
 * @param {object} ...args - 其他传递给 Ant Design Icon 的属性
 */
import React from "react";
import config from "../config";
import { Icon } from "antd";

const { ICON_ONLINE_URL } = config;

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: ICON_ONLINE_URL
});

export function IconOnline({
    type,
    ...args
}) {

    return <IconFont type={type} {...args} />;
}