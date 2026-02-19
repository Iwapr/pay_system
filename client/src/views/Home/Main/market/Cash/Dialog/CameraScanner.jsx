/**
 * @file CameraScanner.jsx
 * @description 摄像头条码扫描弹窗，调用设备摄像头实时识别商品条码
 * @module views/Home/Main/market/Cash/Dialog/CameraScanner
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Select, message } from "antd";
import { BrowserMultiFormatReader } from "@zxing/library";

const { Option } = Select;

/**
 * 摄像头条码扫描弹窗
 * @param {boolean} visible - 是否显示
 * @param {function} onClose - 关闭回调
 * @param {function} onScanned - 扫码成功回调，参数为条码字符串
 */
export function CameraScanner({ visible, onClose, onScanned }) {
    const videoRef = useRef(null);
    const readerRef = useRef(null);
    // 用来记录"弹窗打开动画完成后需要启动的摄像头 id"
    const pendingCameraRef = useRef(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [modalReady, setModalReady] = useState(false); // 动画是否已完成

    // 弹窗打开时枚举摄像头列表（不在此时启动扫描，等动画完成后再启动）
    useEffect(() => {
        if (!visible) {
            return;
        }
        setModalReady(false);

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        reader.listVideoInputDevices().then(devices => {
            if (devices.length === 0) {
                message.error("未检测到摄像头设备！");
                onClose();
                return;
            }
            setCameras(devices);
            const back = devices.find(d =>
                /back|rear|environment/i.test(d.label)
            );
            const deviceId = (back || devices[0]).deviceId;
            pendingCameraRef.current = deviceId;
            setSelectedCamera(deviceId);
        }).catch(() => {
            message.error("无法获取摄像头列表，请检查权限设置！");
            onClose();
        });

        return () => {
            stopScanning();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    // 弹窗动画完成后启动摄像头（避免黑屏）
    const handleAfterVisibleChange = useCallback((vis) => {
        if (!vis) return;
        setModalReady(true);
        if (pendingCameraRef.current) {
            startScanning(pendingCameraRef.current);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 用户手动切换摄像头（弹窗此时已完全打开，可直接启动）
    function handleCameraChange(deviceId) {
        setSelectedCamera(deviceId);
        pendingCameraRef.current = deviceId;
        if (modalReady) {
            startScanning(deviceId);
        }
    }

    function startScanning(deviceId) {
        if (!readerRef.current || !videoRef.current) return;
        stopScanning();
        setScanning(true);
        readerRef.current.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result) => {
                if (result) {
                    const code = result.getText();
                    stopScanning();
                    onScanned(code);
                }
            }
        );
    }

    function stopScanning() {
        try {
            readerRef.current && readerRef.current.reset();
        } catch (_) { /* ignore */ }
        setScanning(false);
    }

    function handleClose() {
        stopScanning();
        setCameras([]);
        setSelectedCamera(null);
        pendingCameraRef.current = null;
        setModalReady(false);
        onClose();
    }

    return (
        <Modal
            title="摄像头扫码"
            visible={visible}
            onCancel={handleClose}
            footer={null}
            width={420}
            afterVisibleChange={handleAfterVisibleChange}
        >
            {cameras.length > 1 && (
                <div style={{ marginBottom: 10 }}>
                    <span style={{ marginRight: 8 }}>选择摄像头：</span>
                    <Select
                        value={selectedCamera}
                        onChange={handleCameraChange}
                        style={{ width: 260 }}
                        size="small"
                    >
                        {cameras.map(c => (
                            <Option key={c.deviceId} value={c.deviceId}>
                                {c.label || `摄像头 ${c.deviceId.slice(0, 8)}`}
                            </Option>
                        ))}
                    </Select>
                </div>
            )}
            <div style={{ position: "relative", background: "#000", borderRadius: 4, overflow: "hidden" }}>
                <video
                    ref={videoRef}
                    style={{ width: "100%", display: "block", maxHeight: 320 }}
                    autoPlay
                    playsInline
                    muted
                />
                {scanning && (
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "70%",
                        height: 2,
                        background: "rgba(24,144,255,0.85)",
                        boxShadow: "0 0 8px rgba(24,144,255,0.9)",
                        animation: "posScanner 2s ease-in-out infinite"
                    }} />
                )}
            </div>
            <p style={{ textAlign: "center", marginTop: 12, color: "#888", fontSize: 13 }}>
                将商品条码对准摄像头，识别后自动关闭
            </p>
            <style>{`
                @keyframes posScanner {
                    0%   { top: 15%; }
                    50%  { top: 85%; }
                    100% { top: 15%; }
                }
            `}</style>
        </Modal>
    );
}

