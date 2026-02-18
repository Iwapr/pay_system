/**
 * @file LineCharts.jsx
 * @description ECharts折线图封装组件，支持动态选项驱动并监听窗口大小自适应重绘
 * @module views/Home/Main/home/common/LineCharts
 */
import React, { useEffect, useState } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/toolbox";

let reflowFlag = false;
// 已经触发重绘的flag

export function LineCharts({
    Option
}) {

    const [myChart, setMyChart] = useState();

    useEffect(() => {
        const myChart = echarts.init(document.querySelector("#echart-line-wrap"));
        // echarts实例

        setMyChart(myChart);
        // 将实例写入state

        window.addEventListener("resize", myChart.resize);
        // 监听窗口变化事件

        return () => window.removeEventListener("resize", myChart.resize);
    }, []);

    useEffect(() => {

        if (!reflowFlag && myChart) {
            // 没有触发过重绘，则进行重绘制

            myChart.resize();

            reflowFlag = true;
        }

        myChart && myChart.setOption(Option);
    }, [Option]);



    return (
        <div
            id="echart-line-wrap"
        />
    );
}