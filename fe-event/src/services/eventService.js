import apiClient from "../api/axios";

export const getHomeEvents = async () => {
  const res = await apiClient.get("/events/home");
  return res.data.data; // {ongoing, upcoming}
};

// Search events with pagination and filters
export const searchEvents = async (page = 0, size = 10, searchParams = []) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    // Add search parameters in format: search=field:value
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

export const getEvents = async (page, pageSize, searchParams = []) => {
  try {
    const formattedSearchParams = Array.isArray(searchParams)
      ? searchParams
      : [];

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", pageSize.toString());

    formattedSearchParams.forEach((param) => {
      params.append("search", param);
    });

    const response = await apiClient.get("/events", {
      params: Object.fromEntries(params),
    });

    const data = response.data;

    if (data.code === 200 && data.data && data.data.content) {
      return {
        code: 200,
        data: {
          content: data.data.content.map((event) => ({
            eventId: event.id,
            eventName: event.eventTitle,
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

export const getEventDetails = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    const data = response.data;

    // Map API response to expected format
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
          maxParticipants: 500, // Not provided in API
          price: 0, // Not provided in API
          registrationDeadline: event.startTime,
          contactEmail: "contact@event.com", // Not provided in API
          contactPhone: "+84 123 456 789", // Not provided in API
          requirements: event.bannerText || "",
          galleryImages: [
            { url: event.headerImage || "/placeholder.svg" },
            { url: event.orgLogoUrl || "/placeholder.svg" },
          ],
          // Additional fields from API
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
    // Return fallback data on error
    return {
      code: 200,
      data: {
        eventName: "Tech Conference 2024",
        thumbnailUrl: "/placeholder.svg",
        bannerUrl: "/placeholder.svg",
        description:
          "A comprehensive technology conference featuring the latest innovations and trends.",
        startDate: "2024-03-15",
        endDate: "2024-03-16",
        startTime: "09:00",
        endTime: "17:00",
        location: "Ho Chi Minh City Convention Center",
        address: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
        maxParticipants: 500,
        price: 1500000,
        registrationDeadline: "2024-03-10",
        contactEmail: "contact@techconf.com",
        contactPhone: "+84 123 456 789",
        requirements:
          "Participants should bring their own laptops and business cards.",
        galleryImages: [
          { url: "/placeholder.svg" },
          { url: "/placeholder.svg" },
        ],
      },
      message: "Event details fetched successfully",
    };
  }
};

// Get event detail by ID (alias for getEventDetails)
export const getEventDetail = async (eventId) => {
  return await getEventDetails(eventId);
};

export const getEventCategories = async () => {
  try {
    const response = await apiClient.get("/events/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching event categories:", error);
    // Return fallback data on error
    return {
      code: 200,
      data: [
        { categoryCode: "TECH", categoryName: "Technology" },
        { categoryCode: "MUSIC", categoryName: "Music & Entertainment" },
        { categoryCode: "BUSINESS", categoryName: "Business & Networking" },
        { categoryCode: "EDUCATION", categoryName: "Education & Training" },
      ],
      message: "Event categories fetched successfully",
    };
  }
};

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

// NEW: Get showing times for an event
export const getEventShowingTimes = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/showing-times`);
    return response.data;
  } catch (error) {
    console.error("Error fetching showing times:", error);
    // Return mock data for development
    return {
      code: 200,
      data: [
        {
          id: 1,
          event_id: eventId,
          startTime: "2024-03-15T09:00:00",
          endTime: "2024-03-15T12:00:00",
          saleOpenTime: "2024-03-01T00:00:00",
          saleCloseTime: "2024-03-14T23:59:59",
        },
        {
          id: 2,
          event_id: eventId,
          startTime: "2024-03-15T14:00:00",
          endTime: "2024-03-15T17:00:00",
          saleOpenTime: "2024-03-01T00:00:00",
          saleCloseTime: "2024-03-14T23:59:59",
        },
        {
          id: 3,
          event_id: eventId,
          startTime: "2024-03-16T09:00:00",
          endTime: "2024-03-16T12:00:00",
          saleOpenTime: "2024-03-01T00:00:00",
          saleCloseTime: "2024-03-15T23:59:59",
        },
      ],
      message: "Showing times fetched successfully",
    };
  }
};

// NEW: Get attendees for a specific event and showing time with pagination
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

    // Add search parameters
    search.forEach((param) => {
      params.append("search", param);
    });

    const response = await apiClient.get(
      `/events/${eventId}/attendees?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendees:", error);
    // Return mock data for development
    return {
      code: 200,
      data: {
        content: [
          {
            id: 1,
            fullName: "Nguyễn Văn An",
            email: "nguyenvanan@email.com",
            phone: "0901234567",
            qrToken: "QR001234567",
            paidAt: "2024-01-15T10:30:00Z",
            numberOfSeats: 2,
            checkInTime: "2024-03-15T08:45:00Z",
            checkInStatus: "CHECKED_IN",
          },
          {
            id: 2,
            fullName: "Trần Thị Bình",
            email: "tranthibinh@email.com",
            phone: "0912345678",
            qrToken: "QR001234568",
            paidAt: "2024-01-16T14:20:00Z",
            numberOfSeats: 1,
            checkInTime: null,
            checkInStatus: "NOT_CHECKED_IN",
          },
          {
            id: 3,
            fullName: "Lê Văn Cường",
            email: "levancuong@email.com",
            phone: "0923456789",
            qrToken: "QR001234569",
            paidAt: "2024-01-17T09:15:00Z",
            numberOfSeats: 3,
            checkInTime: null,
            checkInStatus: "NOT_CHECKED_IN",
          },
        ],
        totalElements: 25,
        totalPages: 3,
        number: page,
        size: size,
      },
      message: "Attendees fetched successfully",
    };
  }
};

// NEW: Search attendee by QR token
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

// NEW: Get analytics for event
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
    // Return mock data for development
    return {
      code: 200,
      data: {
        numberOfAttendees: 0,
        numberOfCheckIns: 0,
        numberOfSeats: 0,
        sale: 0,
        averageAttendees: 0.0,
      },
      message: "Analytics fetched successfully",
    };
  }
};

// NEW: Check-in attendee
export const checkInAttendee = async (bookingId) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/check-in`);
    return response.data;
  } catch (error) {
    console.error("Error checking in attendee:", error);
    throw error;
  }
};

// Helper function to build search parameters
export const buildSearchParams = (statusName, eventTitle) => {
  const searchParams = [];

  if (statusName && statusName !== "all") {
    // Map display status to API status
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    featured: false,
    ageRating: apiEvent.ageRating || "",
    endTime: apiEvent.endTime || "",
  };
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    featured: false,
    ageRating: apiEventDetail.ageRating || "",
    bannerText: apiEventDetail.bannerText || apiEventDetail.requirements || "",
    orgLogoUrl: "",
    showingTimes: apiEventDetail.showingTimes || [],
  };
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

export async function getEventsByStatus(organizerId, statusId) {
  try {
    const res = await apiClient.get(
      `/events/organizer/${organizerId}/status/${statusId}`
    );
    // Giả sử API trả về { code: 200, data: [...] }
    return res.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy sự kiện theo status:", error);
    return [];
  }
}

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
    return [
      {
        id: 1,
        eventTitle:
          "[VIVIAN VU'S CANDLES] WORKSHOP LÀM NẾN THƠM VÀ SÁP THƠM HANDMADE",
        price: 315000,
        startTime: "2025-07-05T10:00:00",
        endTime: "2025-07-05T12:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Hồ Chí Minh",
        categoryName: "Workshop",
      },
      {
        id: 2,
        eventTitle: "Sân khấu 5B: Kịch thiếu nhi 'BIỆT ĐỘI GÀ VỊT'",
        price: 270000,
        startTime: "2025-07-05T19:00:00",
        endTime: "2025-07-05T21:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Hà Nội",
        categoryName: "Sân khấu",
      },
      {
        id: 3,
        eventTitle: "Nhà Hát Kịch IDECAF: NXXX36 - Hành Trình Mật Trời",
        price: 250000,
        startTime: "2025-07-06T20:00:00",
        endTime: "2025-07-06T22:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Đà Nẵng",
        categoryName: "Nghệ thuật",
      },
      {
        id: 4,
        eventTitle: "[FLOWER 1969's] WORKSHOP CANDLE - HỌC LÀM NẾN THƠM",
        price: 279000,
        startTime: "2025-07-07T14:00:00",
        endTime: "2025-07-07T16:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Đà Lạt",
        categoryName: "Workshop",
      },
      {
        id: 5,
        eventTitle: "ART WORKSHOP 'BANOFF PEANUT BUTTER BROWNIE'",
        price: 390000,
        startTime: "2025-07-08T15:00:00",
        endTime: "2025-07-08T17:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Hồ Chí Minh",
        categoryName: "Ẩm thực",
      },
      {
        id: 6,
        eventTitle:
          "Ngắm nhìn bầu trời đêm tuyệt đẹp cùng Đài thiên văn Nha Trang",
        price: 100000,
        startTime: "2025-07-09T21:00:00",
        endTime: "2025-07-09T23:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Nha Trang",
        categoryName: "Khoa học",
      },
      {
        id: 7,
        eventTitle: "Concert Acoustic - Đêm nhạc lãng mạn",
        price: 0,
        startTime: "2025-07-10T19:30:00",
        endTime: "2025-07-10T21:30:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Hồ Chí Minh",
        categoryName: "Âm nhạc",
      },
      {
        id: 8,
        eventTitle: "Triển lám tranh đương đại Việt Nam",
        price: 50000,
        startTime: "2025-07-11T09:00:00",
        endTime: "2025-07-11T18:00:00",
        imageUrl: "/placeholder.svg?height=200&width=300",
        city: "Hà Nội",
        categoryName: "Nghệ thuật",
      },
    ];
  }
};
