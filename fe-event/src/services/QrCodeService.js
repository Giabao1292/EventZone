import apiClient from "../api/axios";

const QrCodeService = {
    getQrCodeBase64: async (bookingId) => {
        try {
            const response = await apiClient.get(`/${bookingId}/qr-image`);
            return response.data; // data: "data:image/png;base64,..."
        } catch (error) {
            console.error("Lỗi khi tải mã QR:", error);
            throw error;
        }
    },
};

export default QrCodeService;

