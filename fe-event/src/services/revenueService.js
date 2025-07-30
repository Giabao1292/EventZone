import apiClient from "../api/axios";

// Hàm tính toán groupBy và số lượng cột hiển thị dựa trên period
const getChartConfig = (period, selectedYear = null) => {
  const now = new Date();
  let fromDate, toDate, groupBy, displayCount;

  // Nếu có selectedYear, ưu tiên sử dụng năm đó
  if (selectedYear) {
    fromDate = new Date(selectedYear, 0, 1); // 1/1/selectedYear
    toDate = new Date(selectedYear, 11, 31); // 31/12/selectedYear
    groupBy = "month";
    displayCount = 12;
    return {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      groupBy,
      displayCount,
    };
  }

  switch (period) {
    case "7days":
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      toDate = now;
      groupBy = "day";
      displayCount = 7;
      break;
    case "30days":
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      toDate = now;
      groupBy = "day";
      displayCount = 6;
      break;
    case "6months":
      fromDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      toDate = now;
      groupBy = "month";
      displayCount = 6;
      break;
    case "1year":
      fromDate = new Date(now.getFullYear() - 1, 0, 1);
      toDate = now;
      groupBy = "month";
      displayCount = 6;
      break;
    default:
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      toDate = now;
      groupBy = "day";
      displayCount = 6;
  }

  return {
    fromDate: fromDate.toISOString().split("T")[0],
    toDate: toDate.toISOString().split("T")[0],
    groupBy,
    displayCount,
  };
};

export const fetchRevenueChartData = async (
  period = "30days",
  orgName = null,
  selectedYear = null
) => {
  const { fromDate, toDate, groupBy } = getChartConfig(period, selectedYear);

  const params = {
    from: fromDate,
    to: toDate,
    groupBy: groupBy,
    type: "all",
  };

  // Thêm orgName nếu có
  if (orgName && orgName !== "all") {
    params.orgName = orgName;
  }

  const response = await apiClient.get("/revenue/time-series", { params });
  return response.data.data;
};

export const fetchBookings = async (
  page = 0,
  size = 10,
  searchFilters = [],
  orgName = null
) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  // Thêm orgName nếu có
  if (orgName && orgName !== "all") {
    params.append("orgName", orgName);
  }

  // Thêm từng search filter riêng biệt
  searchFilters.forEach((filter) => {
    params.append("search", filter);
  });

  const response = await apiClient.get(
    `/revenue/bookings?${params.toString()}`
  );
  return response.data.data;
};

export const fetchEventAds = async (
  page = 0,
  size = 10,
  searchFilters = [],
  orgName = null
) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  // Thêm orgName nếu có
  if (orgName && orgName !== "all") {
    params.append("orgName", orgName);
  }

  // Thêm từng search filter riêng biệt
  searchFilters.forEach((filter) => {
    params.append("search", filter);
  });

  const response = await apiClient.get(
    `/revenue/event-ads?${params.toString()}`
  );
  return response.data.data;
};

export const getOrganizers = async (
  page = 0,
  size = 10,
  sortBy = "createdAt,desc",
  searchParams = {}
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sort", sortBy.toString());

    // Add search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.append("search", `${key}:${value}`);
      }
    });

    const response = await apiClient.get(`/organizers?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizers:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch organizers"
    );
  }
};

export const getTopEvents = async () => {
  try {
    const response = await apiClient.get("/events/top", {
      params: {
        page: 0,
        size: 4,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch top events", error);
    throw error;
  }
};

export const fetchEventAdsRevenues = async ({ page = 0, size = 6 }) => {
  const response = await apiClient.get("/revenue/event-ads", {
    params: {
      page,
      size,
    },
  });
  return response.data.data;
};
