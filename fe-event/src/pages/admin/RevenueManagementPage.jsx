"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import StatusBadge from "../../components/ui/status-badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  fetchRevenueChartData,
  fetchBookings,
  fetchEventAds,
  getOrganizers,
} from "../../services/revenueService";

export default function RevenueDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState("all");
  const [organizers, setOrganizers] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [bookings, setBookings] = useState([]);
  const [bookingPage, setBookingPage] = useState(0);
  const [bookingTotalPages, setBookingTotalPages] = useState(0);
  const [bookingPageSize, setBookingPageSize] = useState(5);
  const [bookingFilters, setBookingFilters] = useState({
    fullName: "",
    eventTitle: "",
    paymentStatus: "",
    paymentMethod: "",
    minPrice: "",
    maxPrice: "",
    paidAtFrom: "",
    paidAtTo: "",
  });

  // EventAds state
  const [eventAds, setEventAds] = useState([]);
  const [eventAdsPage, setEventAdsPage] = useState(0);
  const [eventAdsTotalPages, setEventAdsTotalPages] = useState(0);
  const [eventAdsPageSize, setEventAdsPageSize] = useState(5);
  const [eventAdsFilters, setEventAdsFilters] = useState({
    eventTitle: "",
    orgName: "",
    paymentGateway: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  // Tạo danh sách năm (từ 2020 đến năm hiện tại)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // Năm mới nhất trước
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatChartData = (apiData) => {
    if (!apiData || !apiData.revenueDetails) return [];

    return apiData.revenueDetails.map((item) => ({
      month: item.bucket,
      booking: item.booking || 0,
      eventads: item.ads || 0,
    }));
  };

  const loadOrganizers = async () => {
    try {
      const response = await getOrganizers(0, 100); // Lấy 100 organizers đầu tiên
      if (response && response.data && response.data.content) {
        setOrganizers(response.data.content || []);
        console.log("Loaded organizers:", response.data.content);
      } else {
        console.error("Invalid organizers response structure:", response);
      }
    } catch (error) {
      console.error("Error loading organizers:", error);
    }
  };

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const orgName = selectedOrganizer === "all" ? null : selectedOrganizer;
      const data = await fetchRevenueChartData(
        selectedPeriod,
        orgName,
        selectedYear
      );
      setRevenueData(data);
      setChartData(formatChartData(data));
    } catch (error) {
      console.error("Error loading revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeForSearch = (dateInput, isEndDate = false) => {
    if (!dateInput) return null;

    const date = new Date(dateInput);
    if (isEndDate) {
      date.setDate(date.getDate() + 1);
    }

    return date.toISOString().slice(0, 10);
  };

  const buildSearchFilters = (filters) => {
    const searchArray = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() && value !== "all") {
        if (key === "minPrice") {
          searchArray.push(`finalPrice>${value}`);
        } else if (key === "maxPrice") {
          searchArray.push(`finalPrice<${value}`);
        } else if (key === "paidAtFrom") {
          const formattedDate = formatDateTimeForSearch(value, false);
          if (formattedDate) {
            searchArray.push(`paidAt>${formattedDate}`);
          }
        } else if (key === "paidAtTo") {
          const formattedDate = formatDateTimeForSearch(value, true);
          if (formattedDate) {
            searchArray.push(`paidAt<${formattedDate}`);
          }
        } else {
          searchArray.push(`${key}:${value}`);
        }
      }
    });
    return searchArray;
  };

  const buildEventAdsSearchFilters = (filters) => {
    const searchArray = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() && value !== "all") {
        if (key === "minPrice") {
          searchArray.push(`totalPrice>${value}`);
        } else if (key === "maxPrice") {
          searchArray.push(`totalPrice<${value}`);
        } else {
          searchArray.push(`${key}:${value}`);
        }
      }
    });
    return searchArray;
  };

  const loadBookings = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 0 : bookingPage;
      if (resetPage) {
        setBookingPage(0);
      }
      const searchFilters = buildSearchFilters(bookingFilters);
      const orgName = selectedOrganizer === "all" ? null : selectedOrganizer;
      const data = await fetchBookings(
        currentPage,
        bookingPageSize,
        searchFilters,
        orgName
      );
      setBookings(data.content);
      setBookingTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const loadEventAds = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 0 : eventAdsPage;
      if (resetPage) {
        setEventAdsPage(0);
      }
      const searchFilters = buildEventAdsSearchFilters(eventAdsFilters);
      const orgName = selectedOrganizer === "all" ? null : selectedOrganizer;
      const data = await fetchEventAds(
        currentPage,
        eventAdsPageSize,
        searchFilters,
        orgName
      );
      setEventAds(data.content);
      setEventAdsTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading event ads:", error);
    }
  };

  // Load organizers khi component mount
  useEffect(() => {
    loadOrganizers();
  }, []);

  // Load revenue data khi thay đổi period, organizer hoặc year
  useEffect(() => {
    loadRevenueData();
  }, [selectedPeriod, selectedOrganizer, selectedYear]);

  // Load bookings khi thay đổi page, size hoặc organizer
  useEffect(() => {
    loadBookings();
  }, [bookingPage, bookingPageSize, selectedOrganizer]);

  // Load event ads khi thay đổi page, size hoặc organizer
  useEffect(() => {
    loadEventAds();
  }, [eventAdsPage, eventAdsPageSize, selectedOrganizer]);

  // Load initial data
  useEffect(() => {
    loadBookings();
    loadEventAds();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${
                entry.name === "booking" ? "Booking" : "EventAds"
              }: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const totalRevenue =
    (revenueData?.ticketSellingRevenue || 0) +
    (revenueData?.eventAdsRevenue || 0);
  const bookingRevenue = revenueData?.ticketSellingRevenue || 0;
  const eventAdsRevenue = revenueData?.eventAdsRevenue || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Doanh Thu
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và phân tích doanh thu từ Booking và EventAds
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Organizer Selector */}
            <Select
              value={selectedOrganizer}
              onValueChange={setSelectedOrganizer}
            >
              <SelectTrigger className="w-[200px]">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn organizer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả organizers</SelectItem>
                {organizers.map((org) => (
                  <SelectItem key={org.id} value={org.orgName}>
                    {org.orgName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select
              value={selectedYear?.toString() || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedYear(null);
                } else {
                  setSelectedYear(Number.parseInt(value));
                  setSelectedPeriod(""); // Clear period when year is selected
                }
              }}
            >
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {generateYearOptions().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Period Selector - disabled when year is selected */}
            <Select
              value={selectedPeriod}
              onValueChange={(value) => {
                setSelectedPeriod(value);
                setSelectedYear(null); // Clear year when period is selected
              }}
              disabled={selectedYear !== null}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="6months">6 tháng qua</SelectItem>
                <SelectItem value="1year">1 năm qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Doanh Thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedOrganizer !== "all"
                  ? `Doanh thu của ${selectedOrganizer}`
                  : "Tổng doanh thu trong kỳ"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh Thu Booking
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(bookingRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Doanh thu từ bán vé
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh Thu EventAds
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(eventAdsRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Doanh thu từ quảng cáo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tỷ Lệ Booking/EventAds
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRevenue > 0
                  ? `${Math.round(
                      (bookingRevenue / totalRevenue) * 100
                    )}% / ${Math.round(
                      (eventAdsRevenue / totalRevenue) * 100
                    )}%`
                  : "0% / 0%"}
              </div>
              <p className="text-xs text-muted-foreground">
                {bookingRevenue > eventAdsRevenue
                  ? "Booking chiếm ưu thế"
                  : "EventAds chiếm ưu thế"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Xu Hướng Doanh Thu
              </CardTitle>
              <CardDescription>
                So sánh doanh thu giữa Booking và EventAds theo thời gian
                {selectedYear && ` - Năm ${selectedYear}`}
                {selectedOrganizer !== "all" && ` - ${selectedOrganizer}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}M`
                      }
                      axisLine={false}
                      tickLine={false}
                    />
                    <CustomTooltip />
                    <Line
                      type="monotone"
                      dataKey="booking"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                      name="booking"
                    />
                    <Line
                      type="monotone"
                      dataKey="eventads"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2 }}
                      name="eventads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm">EventAds</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Phân Bố Doanh Thu
              </CardTitle>
              <CardDescription>
                Tỷ lệ đóng góp của từng nguồn doanh thu
                {selectedOrganizer !== "all" && ` - ${selectedOrganizer}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${
                        totalRevenue > 0
                          ? (bookingRevenue / totalRevenue) * 251.2
                          : 0
                      } 251.2`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      strokeDasharray={`${
                        totalRevenue > 0
                          ? (eventAdsRevenue / totalRevenue) * 251.2
                          : 0
                      } 251.2`}
                      strokeDashoffset={`-${
                        totalRevenue > 0
                          ? (bookingRevenue / totalRevenue) * 251.2
                          : 0
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-500">Tổng</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Booking</span>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(bookingRevenue)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalRevenue > 0
                      ? `${Math.round((bookingRevenue / totalRevenue) * 100)}%`
                      : "0%"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-sm">EventAds</span>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(eventAdsRevenue)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalRevenue > 0
                      ? `${Math.round((eventAdsRevenue / totalRevenue) * 100)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quản Lý Booking</CardTitle>
            <CardDescription>
              Danh sách các giao dịch booking và bộ lọc
              {selectedOrganizer !== "all" && ` - ${selectedOrganizer}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Booking Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Tên khách hàng"
                value={bookingFilters.fullName}
                onChange={(e) =>
                  setBookingFilters({
                    ...bookingFilters,
                    fullName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Tên sự kiện"
                value={bookingFilters.eventTitle}
                onChange={(e) =>
                  setBookingFilters({
                    ...bookingFilters,
                    eventTitle: e.target.value,
                  })
                }
              />
              <Select
                value={bookingFilters.paymentStatus}
                onValueChange={(value) =>
                  setBookingFilters({ ...bookingFilters, paymentStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                  <SelectItem value="CONFIRMED">Đã thanh toán</SelectItem>
                  <SelectItem value="CANCELLED">Thất bại</SelectItem>
                  <SelectItem value="REFUNDED">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Phương thức thanh toán"
                value={bookingFilters.paymentMethod}
                onChange={(e) =>
                  setBookingFilters({
                    ...bookingFilters,
                    paymentMethod: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Giá tối thiểu"
                type="number"
                value={bookingFilters.minPrice}
                onChange={(e) =>
                  setBookingFilters({
                    ...bookingFilters,
                    minPrice: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Giá tối đa"
                type="number"
                value={bookingFilters.maxPrice}
                onChange={(e) =>
                  setBookingFilters({
                    ...bookingFilters,
                    maxPrice: e.target.value,
                  })
                }
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="from" className="text-sm text-gray-600">
                  Từ ngày
                </label>
                <Input
                  id="from"
                  type="date"
                  value={bookingFilters.paidAtFrom}
                  onChange={(e) =>
                    setBookingFilters({
                      ...bookingFilters,
                      paidAtFrom: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="to" className="text-sm text-gray-600">
                  Đến ngày
                </label>
                <Input
                  id="to"
                  type="date"
                  value={bookingFilters.paidAtTo}
                  onChange={(e) =>
                    setBookingFilters({
                      ...bookingFilters,
                      paidAtTo: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={() =>
                  setBookingFilters({
                    fullName: "",
                    eventTitle: "",
                    paymentStatus: "all",
                    paymentMethod: "",
                    minPrice: "",
                    maxPrice: "",
                    paidAtFrom: "",
                    paidAtTo: "",
                  })
                }
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={() => loadBookings(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tìm kiếm
              </Button>
              <select
                value={bookingPageSize}
                onChange={(e) => {
                  setBookingPageSize(Number.parseInt(e.target.value));
                  setBookingPage(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[120px]"
              >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
                <option value={50}>50 dòng</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Số ghế</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking.fullName}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {booking.eventTitle}
                    </TableCell>
                    <TableCell className="text-center">
                      {booking.numberOfSeats}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(booking.finalPrice)}
                    </TableCell>
                    <TableCell>{booking.paymentMethod}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      {booking.paidAt
                        ? new Date(booking.paidAt).toLocaleDateString("vi-VN")
                        : "Chưa thanh toán"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Booking Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {bookingPageSize} dòng - Trang {bookingPage + 1} /{" "}
                {bookingTotalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingPage(Math.max(0, bookingPage - 1))}
                  disabled={bookingPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBookingPage(
                      Math.min(bookingTotalPages - 1, bookingPage + 1)
                    )
                  }
                  disabled={bookingPage >= bookingTotalPages - 1}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EventAds Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quản Lý EventAds</CardTitle>
            <CardDescription>
              Danh sách các giao dịch quảng cáo sự kiện và bộ lọc
              {selectedOrganizer !== "all" && ` - ${selectedOrganizer}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* EventAds Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Tên sự kiện"
                value={eventAdsFilters.eventTitle}
                onChange={(e) =>
                  setEventAdsFilters({
                    ...eventAdsFilters,
                    eventTitle: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Tên tổ chức"
                value={eventAdsFilters.orgName}
                onChange={(e) =>
                  setEventAdsFilters({
                    ...eventAdsFilters,
                    orgName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Cổng thanh toán"
                value={eventAdsFilters.paymentGateway}
                onChange={(e) =>
                  setEventAdsFilters({
                    ...eventAdsFilters,
                    paymentGateway: e.target.value,
                  })
                }
              />
              <Select
                value={eventAdsFilters.status}
                onValueChange={(value) =>
                  setEventAdsFilters({ ...eventAdsFilters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Giá tối thiểu"
                type="number"
                value={eventAdsFilters.minPrice}
                onChange={(e) =>
                  setEventAdsFilters({
                    ...eventAdsFilters,
                    minPrice: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Giá tối đa"
                type="number"
                value={eventAdsFilters.maxPrice}
                onChange={(e) =>
                  setEventAdsFilters({
                    ...eventAdsFilters,
                    maxPrice: e.target.value,
                  })
                }
              />
              <Button
                onClick={() =>
                  setEventAdsFilters({
                    eventTitle: "",
                    orgName: "",
                    paymentGateway: "",
                    status: "all",
                    minPrice: "",
                    maxPrice: "",
                  })
                }
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={() => loadEventAds(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tìm kiếm
              </Button>
              <select
                value={eventAdsPageSize}
                onChange={(e) => {
                  setEventAdsPageSize(Number.parseInt(e.target.value));
                  setEventAdsPage(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[120px]"
              >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
                <option value={50}>50 dòng</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Tổ chức</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Cổng thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventAds.map((ad) => (
                  <TableRow key={ad.eventAdsId}>
                    <TableCell className="max-w-[200px] truncate">
                      {ad.eventTitle}
                    </TableCell>
                    <TableCell>{ad.organizerName}</TableCell>
                    <TableCell>
                      {new Date(ad.startDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {new Date(ad.endDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(ad.totalPrice)}
                    </TableCell>
                    <TableCell>{ad.paymentGateway}</TableCell>
                    <TableCell>
                      <StatusBadge status={ad.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(ad.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* EventAds Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {eventAdsPageSize} dòng - Trang {eventAdsPage + 1} /{" "}
                {eventAdsTotalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEventAdsPage(Math.max(0, eventAdsPage - 1))}
                  disabled={eventAdsPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEventAdsPage(
                      Math.min(eventAdsTotalPages - 1, eventAdsPage + 1)
                    )
                  }
                  disabled={eventAdsPage >= eventAdsTotalPages - 1}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
