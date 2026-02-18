/**
 * @file index.jsx
 * @description 主页面布局组件，整合左侧菜单、顶部导航、多标签页与主内容区域的整体框架
 * @module views/Home/index
 */
import React, { useState } from "react";
import { Layout } from "antd";
import { LeftSideMenu } from "./LeftSideMenu";
import { Header } from "./Header";
import { Main } from "./Main";
import { MultipleTabs } from "./MultipleTabs";
import { TabsProvider } from "./TabsProvider";
import { useSelector } from "react-redux";
import config from "../../config";

const selector = ({ showTabs }) => ({ showTabs });

const { GLOBAL_SIDER_COLLAPSED } = config;

export function Home() {

    const { showTabs } = useSelector(selector);

    const [collapsed, setCollapsed] = useState(
        localStorage.getItem(GLOBAL_SIDER_COLLAPSED) === "collapsed" ? true : false
    );

    function toggleCollapsed() {
        if (collapsed) {
            localStorage.removeItem(GLOBAL_SIDER_COLLAPSED);
        } else {
            localStorage.setItem(GLOBAL_SIDER_COLLAPSED, "collapsed");
        }
        setCollapsed(state => !state);
    }
    return (
        <Layout style={{ height: "100vh" }}>
            <TabsProvider>
                <LeftSideMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <Layout>
                    <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                    {
                        showTabs && <MultipleTabs />
                    }
                    <Main />
                </Layout>
            </TabsProvider>
        </Layout>
    );
}

export default Home;