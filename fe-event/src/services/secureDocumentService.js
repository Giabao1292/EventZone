import apiClient from "../api/axios";

export const secureDocumentService = {
  // Lấy signed URL cho CCCD mặt trước
  getCCCDFrontUrl: async (organizerId) => {
    const response = await apiClient.get(
      `/secure-documents/organizer/${organizerId}/cccd-front`
    );
    return response.data.data;
  },

  // Lấy signed URL cho CCCD mặt sau
  getCCCDBackUrl: async (organizerId) => {
    const response = await apiClient.get(
      `/secure-documents/organizer/${organizerId}/cccd-back`
    );
    return response.data.data;
  },

  // Lấy signed URL cho giấy phép kinh doanh
  getBusinessLicenseUrl: async (organizerId) => {
    const response = await apiClient.get(
      `/secure-documents/organizer/${organizerId}/business-license`
    );
    return response.data.data;
  },
};
