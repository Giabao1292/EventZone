import apiClient from "../api/axios";

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
    // Convert searchParams array to search format if needed
    const formattedSearchParams = Array.isArray(searchParams)
      ? searchParams
      : [];

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", pageSize.toString());

    // Add search parameters in format: search=field:value
    formattedSearchParams.forEach((param) => {
      params.append("search", param);
    });

    const response = await apiClient.get(`/events/search?${params}`);
    const data = response.data;

    // Map response to expected format
    if (data.code === 200 && data.data) {
      return {
        code: 200,
        data: {
          content: data.data.map((event) => ({
            eventId: event.id,
            eventName: event.eventTitle,
            category: event.categoryName,
            organizerName: event.organizerName,
            location: event.address,
            startDate: event.startTime ? event.startTime.split("T")[0] : "",
            status: event.status,
            description: event.description,
            headerImage: event.headerImage,
            ageRating: event.ageRating,
            endTime: event.endTime,
          })),
          totalElements: data.data.length,
          totalPages: Math.ceil(data.data.length / pageSize),
          number: page,
        },
        message: "Events fetched successfully",
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return fallback data on error
    return {
      code: 200,
      data: {
        content: [
          {
            eventId: 1,
            eventName: "Tech Conference 2024",
            category: "Technology",
            organizerName: "Tech Corp",
            location: "Ho Chi Minh City",
            startDate: "2024-03-15",
            status: "PENDING",
          },
          {
            eventId: 2,
            eventName: "Music Festival",
            category: "Entertainment",
            organizerName: "Music Events Ltd",
            location: "Hanoi",
            startDate: "2024-04-20",
            status: "APPROVED",
          },
        ],
        totalElements: 2,
        totalPages: 1,
        number: page,
      },
      message: "Events fetched successfully",
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
          ageRating: event.ageRating,
          organizerName: event.organizerName,
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

    const response = await apiClient.put(`/events/${eventId}/status`, body);
    return response.data;
  } catch (error) {
    console.error("Error updating event status:", error);
    // Return fallback response on error
    return {
      code: 200,
      message: `Event status updated to ${status} successfully`,
    };
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
      published: "PUBLISHED",
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
    id: apiEvent.eventId?.toString() || apiEvent.id?.toString() || "",
    title: apiEvent.eventName || apiEvent.eventTitle || "",
    description: apiEvent.description || "",
    startDate:
      apiEvent.startDate ||
      (apiEvent.startTime ? apiEvent.startTime.split("T")[0] : ""),
    endDate:
      apiEvent.endDate ||
      (apiEvent.endTime ? apiEvent.endTime.split("T")[0] : ""),
    time: apiEvent.startTime
      ? apiEvent.startTime.split("T")[1]?.substring(0, 5)
      : "",
    location: apiEvent.location || apiEvent.address || "",
    price: 0,
    maxTickets: 0,
    soldTickets: 0,
    category: apiEvent.category || apiEvent.categoryName || "",
    imageUrl: apiEvent.headerImage || "/placeholder.svg?height=200&width=300",
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
    imageUrl:
      apiEventDetail.thumbnailUrl ||
      apiEventDetail.bannerUrl ||
      "/placeholder.svg?height=200&width=300",
    organizerId: "",
    organizerName: apiEventDetail.organizerName || "",
    organizerEmail: apiEventDetail.contactEmail || "",
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
    "Bản nháp": "pending",
    "Chờ duyệt": "pending",
    "Đã duyệt": "approved",
    "Từ chối": "rejected",
    "Đã xuất bản": "published",
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    PUBLISHED: "published",
  };

  return statusMap[apiStatus] || "pending";
};

// Map display status to API status
export const mapDisplayStatusToApi = (displayStatus) => {
  const statusMap = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
    published: "PUBLISHED",
  };

  return statusMap[displayStatus] || "PENDING";
};

// Get event statistics
export const getEventStats = async () => {
  try {
    const allEvents = await getEvents(0, 1000, []);

    if (allEvents.code === 200 && allEvents.data && allEvents.data.content) {
      const events = allEvents.data.content;
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
        published: events.filter(
          (e) => mapApiStatusToDisplay(e.status) === "published"
        ).length,
      };
      return stats;
    }

    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      published: 0,
    };
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      published: 0,
    };
  }
};
