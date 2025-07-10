"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";
import { Button } from "../ui/button.jsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card.jsx";

const QrScanner = ({ isOpen, onClose, onScan }) => {
    const qrCodeRegionId = "qr-reader";
    const html5QrCodeRef = useRef(null);
    const [error, setError] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startScan();
        } else {
            stopScan();
        }

        return () => {
            stopScan();
        };
    }, [isOpen]);

    const startScan = () => {
        setError("");
        if (html5QrCodeRef.current && isScanning) {
            stopScan();
        }

        const config = { fps: 10, qrbox: 250 };
        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

        html5QrCodeRef.current
            .start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    console.log("✅ Đã quét được QR:", decodedText);
                    onScan(decodedText);
                    stopScan();
                    onClose();
                },
                (errorMessage) => {
                    // Không log spam error
                }
            )
            .then(() => {
                setIsScanning(true);
            })
            .catch((err) => {
                console.error("Start camera error:", err);
                setError("Không thể khởi động camera.");
            });
    };

    const stopScan = () => {
        if (html5QrCodeRef.current && isScanning) {
            html5QrCodeRef.current.stop().then(() => {
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
                setIsScanning(false);
            });
        }
    };

    const handleManualInput = () => {
        const qrCode = prompt("Nhập mã QR thủ công:");
        if (qrCode && qrCode.trim()) {
            onScan(qrCode.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Quét mã QR
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error ? (
                        <div className="text-center space-y-4">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <p className="text-red-600">{error}</p>
                            <Button onClick={startScan} className="w-full">
                                Thử lại
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div
                                id={qrCodeRegionId}
                                className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
                            ></div>
                            <p className="text-center text-sm text-gray-600">
                                Đưa mã QR vào khung hình để quét
                            </p>
                            <Button
                                onClick={handleManualInput}
                                variant="outline"
                                className="w-full bg-transparent"
                            >
                                Nhập mã thủ công
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default QrScanner;
