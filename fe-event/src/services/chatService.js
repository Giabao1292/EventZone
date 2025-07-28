import apiClient from "../api/axios";

const chatService = {
  // Gửi tin nhắn
  sendMessage: async (
    receiverId,
    content,
    messageType = "TEXT",
    eventId = null
  ) => {
    const response = await apiClient.post("/chat/send", {
      receiverId,
      content,
      messageType,
      eventId,
    });
    return response.data;
  },

  // Tạo cuộc trò chuyện hỗ trợ
  createSupportConversation: async (receiverId, content, eventName = null) => {
    const response = await apiClient.post("/chat/support", {
      receiverId,
      content,
      messageType: "TEXT",
      eventId: null,
      eventName,
    });
    return response.data;
  },

  // Lấy danh sách conversations
  getConversations: async () => {
    const response = await apiClient.get("/chat/conversations");
    return response.data;
  },

  // Lấy tin nhắn của một conversation
  getMessages: async (partnerId, eventId = null, page = 0, size = 20) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    params.append("page", page);
    params.append("size", size);

    const response = await apiClient.get(
      `/chat/messages/${partnerId}?${params}`
    );
    return response.data;
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (partnerId, eventId = null) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);

    const response = await apiClient.post(
      `/chat/mark-read/${partnerId}?${params}`
    );
    return response.data;
  },

  // Lấy số tin nhắn chưa đọc
  getUnreadCount: async () => {
    const response = await apiClient.get("/chat/unread-count");
    return response.data;
  },

  // Lấy admin user ID
  getAdminUserId: async () => {
    const response = await apiClient.get("/chat/admin");
    return response.data;
  },

  // Lấy danh sách organizers
  getOrganizers: async () => {
    const response = await apiClient.get("/chat/organizers");
    return response.data;
  },

  // Lấy organizer user ID cho một sự kiện cụ thể
  getOrganizerUserId: async (eventId) => {
    const response = await apiClient.get(`/chat/organizer/${eventId}`);
    return response.data;
  },
};

export default chatService;
