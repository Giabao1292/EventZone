import apiClient from "../api/axios";

// ----- Organizer -----
export const fetchWithdrawableEvents = () => {
  return apiClient.get("withdraw/eligible-events");
};

export const createWithdrawRequest = (data) => {
  return apiClient.post("withdraw/request", data);
};

// ----- Admin -----
export const getProcessedWithdrawRequests = () => {
  return apiClient.get("withdraw/processed");
};

export const approveWithdrawRequest = (id) => {
  return apiClient.post(`withdraw/${id}/approve`);
};

export const rejectWithdrawRequest = (id, reason) => {
  return apiClient.post(`withdraw/${id}/reject`, `"${reason}"`, {
    headers: { "Content-Type": "text/plain" },
  });
};
export const fetchAllWithdrawRequests = () => {
  return apiClient.get("/withdraw/all");
};
export const fetchWithdrawRequests = () => {
  return apiClient.get("/withdraw/my-requests");
};
