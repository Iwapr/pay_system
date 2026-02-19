/**
 * @file UploadToServer.jsx
 * @description 将解析后的导入数据提交到服务端并展示导入结果的操作组件
 * @module views/Home/Main/data/Import/UploadToServer
 */
import React, { useState, useMemo, useEffect } from "react";
import styled from "../../../../../styles/data/import.scss";
import { Button, Icon, Spin, Result, Progress } from "antd";
import { useAjax } from "../../../../AjaxProvider";
import { DataManage } from "../../../../../tasks/data";

export function UploadToServer({
    importData,
    uploadStatus,
    setUploadStatus,
    doneFn
}) {

    const ajax = useAjax();

    const [resultData, setResultData] = useState({
        create_count: 0,
        update_count: 0,
        skip_count: 0
    });

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (uploadStatus !== "uploading") {
            if (uploadStatus === "done") {
                setProgress(100);
            } else {
                setProgress(0);
            }
            return;
        }

        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 96) return p;
                const step = p < 60 ? 4 : 2;
                return Math.min(96, p + step);
            });
        }, 300);

        return () => clearInterval(timer);
    }, [uploadStatus]);

    async function handleUpload() {
        setProgress(3);
        setUploadStatus("uploading");

        try {
            const rules = importData && importData.rules ? importData.rules : {};
            const isStockImport = Object.prototype.hasOwnProperty.call(rules, "stock_supplier_exist");

            const request = isStockImport
                ? DataManage.importStock(ajax, importData)
                : DataManage.importCommodity(ajax, importData);

            const { data } = await request;

            setResultData(data);
            setProgress(100);
            setUploadStatus("done");
        } catch (error) {
            setUploadStatus("error");
        }
    }


    const config = [
        {
            status: "wait",
            component: (
                <Button
                    size="large"
                    type="primary"
                    disabled={!importData}
                    onClick={handleUpload}
                >
                    <Icon type="cloud-upload" />
                    开始导入
                </Button>
            )
        },
        {
            status: "uploading",
            component: (
                <div
                    style={{
                        width: 520,
                        maxWidth: "90vw"
                    }}
                >
                    <Spin
                        tip="正在导入数据，请稍候..."
                        size="large"
                        indicator={
                            <Icon type="loading" style={{ fontSize: 48 }} spin />
                        }
                    />
                    <div style={{ marginTop: 20 }}>
                        <Progress percent={progress} status="active" />
                    </div>
                </div>
            )
        },
        {
            status: "error",
            component: (
                <Result
                    title="导入商品数据失败"
                    status="error"
                    subTitle="请检查导入数据后重新导入"
                    extra={[
                        <Button
                            type="primary"
                            key="done"
                            onClick={handleUpload}
                        >
                            重试
                        </Button>
                    ]}
                />
            )
        },
        {
            status: "done",
            component: (
                <Result
                    title="商品数据导入成功"
                    status="success"
                    subTitle={`共上传${importData.data && importData.data.length || 0}条数据, 创建${resultData.create_count}条数据, 更新${resultData.update_count}条数据, 跳过${resultData.skip_count}条数据。`}
                    extra={[
                        <Button
                            type="primary"
                            key="done"
                            onClick={doneFn}
                        >
                            继续导入
                        </Button>
                    ]}
                >

                </Result>
            )
        }
    ];

    const { component } = useMemo(() => config.find(i => i.status === uploadStatus), [uploadStatus]);

    return (
        <div
            className={styled["upload-toserver-wrap"]}
        >
            {
                component
            }
        </div>
    );
}