import apiClient from "../api/axios";

export const voucherServices = {
  // Lấy danh sách vouchers với phân trang và search
  getVouchers: async (page = 0, size = 10, searchParams = []) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      // Thêm search parameters
      if (searchParams && searchParams.length > 0) {
        searchParams.forEach((searchParam) => {
          params.append("search", searchParam);
        });
      }

      const response = await apiClient.get(`/vouchers?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },
  getMyVouchers: async () => {
    try {
      const response = await apiClient.get("/vouchers/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching my vouchers:", error);
      throw error;
    }
  },

  // Đổi voucher (redeem)
  redeemVoucher: async (voucherId) => {
    try {
      const response = await apiClient.post(`/vouchers/${voucherId}/redeem`);
      return response.data;
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      throw error;
    }
  },
  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    try {
      const response = await apiClient.post("/vouchers", voucherData);
      return response.data;
    } catch (error) {
      console.error("Error creating voucher:", error);
      throw error;
    }
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await apiClient.put(`/vouchers/${id}`, voucherData);
      return response.data;
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái voucher (vô hiệu hóa)
  updateVoucherStatus: async (id, status) => {
    try {
      const response = await apiClient.delete(
        `/vouchers/${id}?status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating voucher status:", error);
      throw error;
    }
  },

  // Lấy chi tiết voucher theo ID
  getVoucherById: async (id) => {
    try {
      const response = await apiClient.get(`/vouchers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching voucher by ID:", error);
      throw error;
    }
  },
};
