import apiClient from "../api/axios";

export const adminService = {
  // Chạy migration documents từ URL sang public_id
  migrateDocuments: async () => {
    const response = await apiClient.post("/admin/migrate-documents");
    return response.data;
  },
};
