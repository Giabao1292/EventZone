import apiClient from "../api/axios";

export const trackEvent = async (eventId) => {
  const res = await apiClient.post(`/tracking/track/${eventId}`);
  return res.data;
};

export const untrackEvent = async (eventId) => {
  const res = await apiClient.delete(`/tracking/untrack/${eventId}`);
  return res.data;
};

// Sử dụng API mới để kiểm tra trạng thái tracking
export const isEventTracked = async (eventId) => {
  const res = await apiClient.get(`/tracking/is-tracking/${eventId}`);
  return res.data === true;
};