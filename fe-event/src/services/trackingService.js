// src/services/trackingService.js
import apiClient from "../api/axios";

export const trackEvent = async (eventId) => {
  const res = await apiClient.post(`/tracking/track/${eventId}`);
  return res.data;
};

export const untrackEvent = async (eventId) => {
  const res = await apiClient.delete(`/tracking/untrack/${eventId}`);
  return res.data;
};

export const isEventTracked = async (eventId) => {
  const res = await apiClient.get(`/tracking/is-tracking/${eventId}`);
  return res.data === true;
};

export const getTrackedEvents = async () => {
  const res = await apiClient.get(`/tracking/my-events`);
  return res.data;
};
