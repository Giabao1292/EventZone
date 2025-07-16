import apiClient from "../api/axios";

// Hàm tính toán groupBy và số lượng cột hiển thị dựa trên period
const getChartConfig = (period) => {
  const now = new Date();
  let fromDate, toDate, groupBy, displayCount;

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
      displayCount = 6; // Hiển thị 6 cột đại diện
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
      displayCount = 6; // Hiển thị 6 cột đại diện
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

export const fetchRevenueChartData = async (period = "30days") => {
  const { fromDate, toDate, groupBy } = getChartConfig(period);

  const response = await apiClient.get("/revenue/time-series", {
    params: {
      from: fromDate,
      to: toDate,
      groupBy: groupBy,
      type: "all",
    },
  });
  return response.data.data;
};

export const fetchBookings = async (
  page = 0,
  size = 10,
  searchFilters = []
) => {
  // Tạo params object với search parameters riêng lẻ
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

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
  searchFilters = []
) => {
  // Tạo params object với search parameters riêng lẻ
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  // Thêm từng search filter riêng biệt
  searchFilters.forEach((filter) => {
    params.append("search", filter);
  });

  const response = await apiClient.get(
    `/revenue/event-ads?${params.toString()}`
  );
  return response.data.data;
};
