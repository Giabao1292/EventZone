import apiClient from "../api/axios";

// Lấy danh sách event cho homepage
export const getHomeEvents = async () => {
  const res = await apiClient.get("/events/home");
  return res.data.data; // {ongoing, upcoming}
};

// Search events (có phân trang, filter)
export const searchEvents = async (page = 0, size = 10, searchParams = []) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    searchParams.forEach((param) => {
      params.append("search", param);
    });
    const response = await apiClient.get(`/events?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

// Lấy danh sách event (admin) - sửa đúng truyền params
export const getEvents = async (page, pageSize, searchParams = []) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", pageSize.toString());
    (Array.isArray(searchParams) ? searchParams : []).forEach((param) => {
      params.append("search", param);
    });

    // Truyền params trực tiếp cho axios
    const response = await apiClient.get("/events", { params });

    const data = response.data;
    if (data.code === 200 && data.data && data.data.content) {
      return {
        code: 200,
        data: {
          content: data.data.content.map((event) => ({
            id: event.id?.toString() || "",
            title: event.eventTitle,
            category: event.categoryName,
            organizerName: event.organizerName,
            location: event.address,
            startDate: event.startTime ? event.startTime.split("T")[0] : "",
            status: event.status,
            description: event.description,
            posterImage: event.posterImage,
            ageRating: event.ageRating,
            endTime: event.endTime,
          })),
          totalElements: data.data.totalElements,
          totalPages: data.data.totalPages,
          number: data.data.number,
          size: data.data.size,
        },
        message: "Events fetched successfully",
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      code: 500,
      data: null,
      message: "Failed to fetch events",
    };
  }
};

// Lấy chi tiết 1 event (dùng cho cả admin, organizer)
export const getEventDetails = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    const data = response.data;
    if (data.code === 200 && data.data) {
      const event = data.data;
      return {
        code: 200,
        data: {
          eventName: event.eventTitle,
          thumbnailUrl: event.headerImage || "/placeholder.svg",
          bannerUrl: event.headerImage || "/placeholder.svg",
          description: event.description,
          startDate: event.startTime ? event.startTime.split("T")[0] : "",
          endDate: event.endTime ? event.endTime.split("T")[0] : "",
          startTime: event.startTime
            ? event.startTime.split("T")[1]?.substring(0, 5)
            : "",
          endTime: event.endTime
            ? event.endTime.split("T")[1]?.substring(0, 5)
            : "",
          location: event.address,
          address: event.address,
          maxParticipants: 500,
          price: 0,
          registrationDeadline: event.startTime,
          contactEmail: "contact@event.com",
          contactPhone: "+84 123 456 789",
          requirements: event.bannerText || "",
          galleryImages: [
            { url: event.headerImage || "/placeholder.svg" },
            { url: event.orgLogoUrl || "/placeholder.svg" },
          ],
          rejectionReason: event.rejectionReason || "",
          ageRating: event.ageRating,
          organizerName: event.organizerName,
          organizerEmail: event.organizerEmail,
          categoryName: event.categoryName,
          status: event.status,
          bannerText: event.bannerText,
          orgLogoUrl: event.orgLogoUrl,
          showingTimes: event.showingTimes,
        },
        message: "Event details fetched successfully",
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    return {
      code: 500,
      data: null,
      message: "Failed to fetch event details",
    };
  }
};

export const getEventDetail = async (eventId) => {
  return await getEventDetails(eventId);
};

// Lấy danh mục sự kiện
export const getEventCategories = async () => {
  try {
    const response = await apiClient.get("/events/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return {
      code: 500,
      data: [],
      message: "Failed to fetch event categories",
    };
  }
};

// Cập nhật trạng thái sự kiện (duyệt/từ chối...)
export const updateEventStatus = async (
  eventId,
  status,
  rejectionReason = null
) => {
  try {
    const body = {
      status,
      ...(rejectionReason && { rejectionReason }),
    };
    const response = await apiClient.patch(`/events/${eventId}/status`, body);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating event status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getRecommendedEvents = async () => {
  try {
    const response = await apiClient.get("/events/recommend");
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy sự kiện gợi ý:", error);
    return [];
  }
};
// Lấy showing times của 1 event
export const getEventShowingTimes = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/showing-times`);
    return response.data;
  } catch (error) {
    console.error("Error fetching showing times:", error);
    return {
      code: 500,
      data: [],
      message: "Failed to fetch showing times",
    };
  }
};

// Lấy danh sách attendee cho 1 showing time của event (phân trang)
export const getEventAttendees = async (
  eventId,
  startTime,
  page = 0,
  size = 10,
  search = []
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("startTime", startTime);

    search.forEach((param) => {
      params.append("search", param);
    });

    const response = await apiClient.get(
      `/events/${eventId}/attendees?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return {
      code: 500,
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: page,
        size: size,
      },
      message: "Failed to fetch attendees",
    };
  }
};

// Search attendee bằng QR token
export const searchAttendeeByQR = async (eventId, startTime, qrToken) => {
  try {
    const params = new URLSearchParams();
    params.append("page", "0");
    params.append("size", "1");
    params.append("startTime", startTime);
    params.append("search", `qrToken:${qrToken}`);
    const response = await apiClient.get(
      `/events/${eventId}/attendees?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching attendee by QR:", error);
    throw error;
  }
};

// Lấy thống kê analytics cho showing time
export const getEventAnalytics = async (eventId, startTime) => {
  try {
    const params = new URLSearchParams();
    params.append("startTime", startTime);

    const response = await apiClient.get(
      `/events/${eventId}/analytics?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      code: 500,
      data: {
        numberOfAttendees: 0,
        numberOfCheckIns: 0,
        numberOfSeats: 0,
        sale: 0,
        averageAttendees: 0.0,
      },
      message: "Failed to fetch analytics",
    };
  }
};

// Check-in attendee
export const checkInAttendee = async (bookingId) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/check-in`);
    return response.data;
  } catch (error) {
    console.error("Error checking in attendee:", error);
    throw error;
  }
};

// Hàm build search params ví dụ
export const buildSearchParams = (statusName, eventTitle) => {
  const searchParams = [];
  if (statusName && statusName !== "all") {
    const statusMap = {
      pending: "PENDING",
      approved: "APPROVED",
      rejected: "REJECTED",
      draft: "DRAFT",
    };
    const apiStatus = statusMap[statusName] || statusName.toUpperCase();
    searchParams.push(`statusName:${apiStatus}`);
  }
  if (eventTitle && eventTitle.trim()) {
    searchParams.push(`eventTitle:${eventTitle.trim()}`);
  }
  return searchParams;
};

export const getEventsByStatus = async (organizerId, statusId) => {
  try {
    const res = await apiClient.get(
      `/events/organizer/${organizerId}/status/${statusId}`
    );
    return res.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy sự kiện theo status:", error);
    return [];
  }
};

// Map API detail response to component format
export const mapApiEventDetailToComponent = (apiEventDetail) => {
  return {
    id: apiEventDetail.id?.toString() || "",
    title: apiEventDetail.eventName || apiEventDetail.eventTitle || "",
    description: apiEventDetail.description || "",
    date:
      apiEventDetail.startDate ||
      (apiEventDetail.startTime ? apiEventDetail.startTime.split("T")[0] : ""),
    time: apiEventDetail.startTime || "",
    endDate:
      apiEventDetail.endDate ||
      (apiEventDetail.endTime ? apiEventDetail.endTime.split("T")[0] : ""),
    endTime: apiEventDetail.endTime || "",
    location: apiEventDetail.location || apiEventDetail.address || "",
    price: apiEventDetail.price || 0,
    maxTickets: apiEventDetail.maxParticipants || 0,
    soldTickets: 0,
    category: apiEventDetail.categoryName || "",
    rejectionReason: apiEventDetail.rejectionReason || "",
    imageUrl:
      apiEventDetail.thumbnailUrl ||
      apiEventDetail.bannerUrl ||
      "/placeholder.svg?height=200&width=300",
    organizerId: "",
    organizerName: apiEventDetail.organizerName || "",
    organizerEmail: apiEventDetail.organizerEmail || "",
    status: mapApiStatusToDisplay(apiEventDetail.status),
    createdAt: apiEventDetail.createdAt
      ? new Date(apiEventDetail.createdAt).toISOString()
      : apiEventDetail.startTime
      ? new Date(apiEventDetail.startTime).toISOString()
      : new Date().toISOString(),
    updatedAt: apiEventDetail.updatedAt
      ? new Date(apiEventDetail.updatedAt).toISOString()
      : apiEventDetail.createdAt
      ? new Date(apiEventDetail.createdAt).toISOString()
      : apiEventDetail.startTime
      ? new Date(apiEventDetail.startTime).toISOString()
      : new Date().toISOString(),
    tags: [],
    featured: false,
    ageRating: apiEventDetail.ageRating || "",
    bannerText: apiEventDetail.bannerText || apiEventDetail.requirements || "",
    orgLogoUrl: "",
    showingTimes: apiEventDetail.showingTimes || [],
  };
};

// Map API response to component format
export const mapApiEventToComponent = (apiEvent) => {
  return {
    id: apiEvent.id?.toString() || "",
    title: apiEvent.eventTitle || "",
    description: apiEvent.description || "",
    startDate: apiEvent.startTime ? apiEvent.startTime.split("T")[0] : "",
    endDate: apiEvent.endTime ? apiEvent.endTime.split("T")[0] : "",
    time: apiEvent.startTime
      ? apiEvent.startTime.split("T")[1]?.substring(0, 5)
      : "",
    location: apiEvent.address || "",
    price: 0,
    maxTickets: 0,
    soldTickets: 0,
    category: apiEvent.categoryName || "",
    imageUrl: apiEvent.posterImage || "/placeholder.svg?height=200&width=300",
    organizerId: "",
    organizerName: apiEvent.organizerName || "",
    organizerEmail: "",
    status: mapApiStatusToDisplay(apiEvent.status),
    createdAt: apiEvent.createdAt
      ? new Date(apiEvent.createdAt).toISOString()
      : apiEvent.startTime
      ? new Date(apiEvent.startTime).toISOString()
      : new Date().toISOString(),
    updatedAt: apiEvent.updatedAt
      ? new Date(apiEvent.updatedAt).toISOString()
      : apiEvent.createdAt
      ? new Date(apiEvent.createdAt).toISOString()
      : apiEvent.startTime
      ? new Date(apiEvent.startTime).toISOString()
      : new Date().toISOString(),
    tags: [],
    featured: false,
    ageRating: apiEvent.ageRating || "",
    endTime: apiEvent.endTime || "",
  };
};

export const userSearchEvents = async (searchParams = []) => {
  try {
    const params = new URLSearchParams();

    // Thêm từng search param
    searchParams.forEach((param) => {
      if (param && param.trim()) {
        params.append("search", param);
      }
    });

    const queryString = params.toString();
    const url = queryString
      ? `/events/public?${queryString}`
      : "/events/public";
    const response = await apiClient.get(url);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi tìm kiếm sự kiện:", error);
    return {
      code: 500,
      data: [],
      message: "Lỗi khi tìm kiếm sự kiện",
    };
  }
};

// Map API status to display status
export const mapApiStatusToDisplay = (apiStatus) => {
  const statusMap = {
    "Bản nháp": "draft",
    "Chờ duyệt": "pending",
    "Đã duyệt": "approved",
    "Từ chối": "rejected",
    DRAFT: "draft",
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  };

  return statusMap[apiStatus] || "pending";
};

// Map display status to API status
export const mapDisplayStatusToApi = (displayStatus) => {
  const statusMap = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
  };

  return statusMap[displayStatus] || "PENDING";
};

// Get event statistics
export const getEventStats = (events) => {
  try {
    if (events && events.length > 0) {
      const stats = {
        total: events.length,
        pending: events.filter(
          (e) => mapApiStatusToDisplay(e.status) === "pending"
        ).length,
        approved: events.filter(
          (e) => mapApiStatusToDisplay(e.status) === "approved"
        ).length,
        rejected: events.filter(
          (e) => mapApiStatusToDisplay(e.status) === "rejected"
        ).length,
      };
      return stats;
    }

    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
    };
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
    };
  }
};

export const getAllEvents = async () => {
  try {
    const response = await apiClient.get("/events", {
      params: { page: 0, size: 1000 },
    });
    // Trả về mảng cho FE dùng dropdown select
    return response.data.data?.content || [];
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
};

export const getEventsWithReviews = async () => {
  try {
    const response = await apiClient.get("/events/with-reviews");
    // Trả về mảng cho FE dùng dropdown select
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching events with reviews:", error);
    return [];
  }
};

export const getMyEventsWithReviews = async (token) => {
  try {
    const response = await apiClient.get("/events/my-events-with-reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách sự kiện có đánh giá:", error);
    return [];
  }
};

export const getMyEvents = async (token) => {
  try {
    const response = await apiClient.get("/events/myevents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách sự kiện của tôi:", error);
    return {
      code: error.response?.status || 500,
      data: [],
      message: "Lỗi khi lấy danh sách sự kiện của tôi",
    };
  }
};

// Lấy danh sách event review được theo category
export const getEndedEventsByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`/events/reviewable`, {
      params: { categoryId },
    });
    // Đảm bảo trả về đúng kiểu mảng event cho FE xài luôn
    // Nếu backend trả về dạng { code, message, data }
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching ended/reviewable events:", error);
    return [];
  }
};

export const getReviewableEvents = async (
  page = 0,
  size = 20,
  search = "",
  categoryId = null
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (search && search.trim()) {
      params.append("search", `eventTitle:${search.trim()}`);
    }
    if (categoryId && categoryId !== "all") {
      params.append("categoryId", categoryId);
    }
    // Giả sử BE định nghĩa endpoint này:
    const response = await apiClient.get(
      `/events/reviewable/all?${params.toString()}`
    );
    const data = response.data.data;
    // Trả về PageResponse dạng { content: [...], totalElements, totalPages, number, size }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy sự kiện reviewable:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 1,
      number: 0,
      size: size,
    };
  }
};
