"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Clock,
    Calendar,
    Users,
    Search,
    Mail,
    Phone,
    QrCode,
    CheckCircle,
    ArrowLeft,
    Loader2,
    Filter,
    RefreshCw,
} from "lucide-react";

import {
    getEventShowingTimes,
    getEventAttendees,
    searchAttendeeByQR,
    getEventAnalytics,
    checkInAttendee,
} from "../../services/eventService";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import AttendeeModal from "../admin/AttendeeModal";
import QrScanner from "./QrScanner";

const Select = ({ value, onValueChange, children, className = "" }) => (
    <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`flex h-10 w-full rounded-lg border border-gray-700 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner ${className}`}
    >
        {children}
    </select>
);

const SelectItem = ({ value, children }) => (
    <option className="bg-[#232c48] text-gray-100" value={value}>{children}</option>
);

const LoadingSpinner = ({ size = "default" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
    };
    return <Loader2 className={`animate-spin text-blue-400 ${sizeClasses[size]}`} />;
};

const AttendeeManager = ({ eventId: propEventId, eventTitle: propEventTitle, onBack }) => {
    let eventId = propEventId;
    let eventTitle = propEventTitle;
    try {
        const url = window.location.pathname;
        const regex = /attendees\/(\d+)/;
        const match = url.match(regex);
        if (!eventId && match) eventId = match[1];
    } catch (e) {}

    if (!eventTitle) eventTitle = "";

    // State
    const [showingTimes, setShowingTimes] = useState([]);
    const [selectedShowingTime, setSelectedShowingTime] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoadingShowingTimes, setIsLoadingShowingTimes] = useState(false);
    const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [checkInFilter, setCheckInFilter] = useState("all");
    const [pagination, setPagination] = useState({
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });

    const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
    const [isSearchingByQR, setIsSearchingByQR] = useState(false);

    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);

    useEffect(() => {
        if (eventId) fetchShowingTimes();
    }, [eventId]);

    useEffect(() => {
        if (selectedShowingTime) {
            fetchAttendees();
            fetchAnalytics();
        }
        // eslint-disable-next-line
    }, [selectedShowingTime, pagination.number, pagination.size]);

    const fetchShowingTimes = async () => {
        setIsLoadingShowingTimes(true);
        try {
            const response = await getEventShowingTimes(eventId);
            if (response.code === 200) {
                setShowingTimes(response.data);
            }
        } catch (error) {
            console.error("Error fetching showing times:", error);
        } finally {
            setIsLoadingShowingTimes(false);
        }
    };

    const fetchAttendees = async () => {
        if (!selectedShowingTime) return;
        setIsLoadingAttendees(true);
        try {
            const searchParams = [];
            if (searchTerm.trim()) searchParams.push(`fullName:${searchTerm.trim()}`);
            if (searchEmail.trim()) searchParams.push(`email:${searchEmail.trim()}`);
            if (checkInFilter !== "all") {
                const statusValue = checkInFilter === "not_checked_in" ? "NOT_CHECKED_IN" : "CHECKED_IN";
                searchParams.push(`checkinStatus:${statusValue}`);
            }
            searchParams.push("paymentStatus:CONFIRMED");

            const response = await getEventAttendees(
                eventId,
                selectedShowingTime.startTime,
                pagination.number,
                pagination.size,
                searchParams
            );
            if (response.code === 200) {
                setAttendees(response.data.content);
                setPagination((prev) => ({
                    ...prev,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    number: response.data.number,
                    size: response.data.size,
                }));
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
        } finally {
            setIsLoadingAttendees(false);
        }
    };

    const fetchAnalytics = async () => {
        if (!selectedShowingTime) return;
        setIsLoadingAnalytics(true);
        try {
            const response = await getEventAnalytics(eventId, selectedShowingTime.startTime);
            if (response.code === 200 && response.data) {
                setAnalytics(response.data);
            } else {
                setAnalytics(null);
            }
        } catch (error) {
            setAnalytics(null);
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoadingAnalytics(false);
        }
    };

    const getCheckInStatusBadge = (status) => {
        const statusConfig = {
            NOT_CHECKED_IN: { label: "Chưa check-in", variant: "secondary" },
            CHECKED_IN: { label: "Đã check-in", variant: "default" },
            CHECKED_OUT: { label: "Đã check-out", variant: "outline" },
        };
        const config = statusConfig[status] || statusConfig.NOT_CHECKED_IN;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const attendeeStats = useMemo(() => {
        if (!analytics)
            return { total: 0, checkedIn: 0, attendanceRate: 0, totalSeats: 0, sale: 0, averageAttendees: 0 };
        return {
            total: analytics.numberOfAttendees ?? 0,
            checkedIn: analytics.numberOfCheckIns ?? 0,
            attendanceRate: analytics.numberOfAttendees > 0
                ? (analytics.numberOfCheckIns / analytics.numberOfAttendees) * 100
                : 0,
            totalSeats: analytics.numberOfSeats ?? 0,
            sale: analytics.sale ?? 0,
            averageAttendees: analytics.averageAttendees ?? 0,
        };
    }, [analytics]);

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;
        const startPage = Math.max(0, pagination.number - Math.floor(maxButtons / 2));
        const endPage = Math.min(pagination.totalPages - 1, startPage + maxButtons - 1);
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setPagination((prev) => ({ ...prev, number: i }))}
                    className={`px-3 py-1 text-sm rounded-lg border shadow
            ${i === pagination.number
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600"
                        : "border-gray-700 text-gray-100 hover:bg-indigo-900/80"
                    }`}
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };

    const handleQRScan = async (qrToken) => {
        if (!selectedShowingTime) {
            alert("Vui lòng chọn thời gian chiếu trước!");
            return;
        }
        setIsSearchingByQR(true);
        try {
            const response = await searchAttendeeByQR(eventId, selectedShowingTime.startTime, qrToken);
            if (response.code === 200 && response.data.content.length > 0) {
                setSelectedAttendee(response.data.content[0]);
                setIsAttendeeModalOpen(true);
            } else {
                alert("Không tìm thấy người tham dự với mã QR này!");
            }
        } catch (error) {
            console.error("Error searching by QR:", error);
            alert("Có lỗi xảy ra khi tìm kiếm!");
        } finally {
            setIsSearchingByQR(false);
            setIsQRScannerOpen(false);
        }
    };

    const handleSearch = () => {
        setPagination((prev) => ({ ...prev, number: 0 }));
        fetchAttendees();
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSearchEmail("");
        setCheckInFilter("all");
        setPagination((prev) => ({ ...prev, number: 0 }));
    };

    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const handleCheckIn = async (bookingId) => {
        setIsCheckingIn(true);
        try {
            await checkInAttendee(bookingId);
            await fetchAttendees();
            await fetchAnalytics();
            alert("Check-in thành công!");
            setIsAttendeeModalOpen(false);
        } catch (error) {
            console.error("Error checking in attendee:", error);
            alert("Có lỗi xảy ra khi check-in!");
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-2">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white drop-shadow-md">
                        Quản lý người tham dự
                    </h1>
                </div>
                <Button
                    onClick={fetchShowingTimes}
                    variant="outline"
                    className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
                    disabled={isLoadingShowingTimes}
                >
                    <RefreshCw
                        className={`w-5 h-5 mr-2 ${isLoadingShowingTimes ? "animate-spin" : ""}`}
                    />
                    Làm mới
                </Button>
            </div>

            {/* Event Title */}
            <p className="text-lg md:text-xl font-semibold text-blue-300 mb-2">
                Sự kiện: <span className="text-white">{eventTitle || "Chưa có tên sự kiện"}</span>
            </p>

            {/* Showing Times */}
            <Card className="mb-4 bg-gradient-to-br from-[#1e2a45] via-[#212c55] to-[#16203a] border border-blue-900 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Clock className="w-5 h-5" />
                        Danh sách thời gian chiếu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingShowingTimes ? (
                        <div className="flex items-center justify-center py-8 text-blue-400">
                            <LoadingSpinner size="lg" />
                            <span className="ml-2">Đang tải thời gian chiếu...</span>
                        </div>
                    ) : showingTimes.length === 0 ? (
                        <div className="text-center py-8 text-blue-400">
                            <Clock className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Không có thời gian chiếu nào</h3>
                            <p>Sự kiện này chưa có thời gian chiếu được thiết lập</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto">
                            {showingTimes.map((st) => (
                                <Card
                                    key={st.id}
                                    className={`min-w-[300px] cursor-pointer transition-all duration-200 
                    ${selectedShowingTime?.id === st.id
                                        ? "ring-2 ring-blue-500 bg-blue-900/70"
                                        : "hover:bg-blue-900/50"
                                    }`}
                                    onClick={() => setSelectedShowingTime(st)}
                                >
                                    <CardContent className="p-4 text-gray-100">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-300" />
                                                <span className="font-medium">{formatDateTime(st.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-300" />
                                                <span>
                                                    {formatTime(st.startTime)} - {formatTime(st.endTime)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-blue-200 pt-2">
                                                <div>Mở bán: {formatDateTime(st.saleOpenTime)}</div>
                                                <div>Đóng bán: {formatDateTime(st.saleCloseTime)}</div>
                                            </div>
                                            {selectedShowingTime?.id === st.id && (
                                                <Badge className="w-full justify-center bg-blue-300 text-gray-900 font-semibold">
                                                    Đã chọn
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats */}
            {selectedShowingTime && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-200">
                                <Users className="w-6 h-6" />
                                Tổng người tham dự
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white text-center drop-shadow">
                                {isLoadingAnalytics ? <LoadingSpinner /> : attendeeStats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-900 to-green-700 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-200">
                                <CheckCircle className="w-6 h-6" />
                                Đã check-in
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-100 text-center drop-shadow">
                                {isLoadingAnalytics ? <LoadingSpinner /> : attendeeStats.checkedIn}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-sky-900 to-blue-700 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-200">
                                <QrCode className="w-6 h-6" />
                                Tổng số ghế
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-100 text-center drop-shadow">
                                {isLoadingAnalytics ? <LoadingSpinner /> : attendeeStats.totalSeats}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-900 to-purple-700 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-200">
                                <Users className="w-6 h-6" />
                                Tỷ lệ tham dự
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-100 text-center drop-shadow">
                                {isLoadingAnalytics
                                    ? <LoadingSpinner />
                                    : `${attendeeStats.attendanceRate.toFixed(1)}%`}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            {selectedShowingTime && (
                <Card className="mb-4 bg-gradient-to-br from-[#18223a] via-[#212c48] to-[#1e1f39] border border-blue-800 shadow">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <Label className="text-blue-300 font-semibold mb-1">Tìm kiếm theo tên</Label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <Input
                                        placeholder="Nhập tên người tham dự..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-11 bg-[#18223a] text-white placeholder-blue-300 border border-blue-600 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-blue-300 font-semibold mb-1">Tìm kiếm theo email</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                        <Input
                                            placeholder="Nhập email..."
                                            value={searchEmail}
                                            onChange={(e) => setSearchEmail(e.target.value)}
                                            className="pl-11 bg-[#18223a] text-white placeholder-blue-300 border border-blue-600 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setIsQRScannerOpen(true)}
                                        className="h-12 px-4 bg-green-600 hover:bg-green-700 rounded-lg"
                                        disabled={isSearchingByQR}
                                    >
                                        {isSearchingByQR ? <LoadingSpinner size="sm" /> : <QrCode className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-blue-300 font-semibold mb-1">Trạng thái check-in</Label>
                                <Select
                                    value={checkInFilter}
                                    onValueChange={setCheckInFilter}
                                >
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="not_checked_in">Chưa check-in</SelectItem>
                                    <SelectItem value="checked_in">Đã check-in</SelectItem>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button
                                onClick={handleSearch}
                                className="bg-blue-700 hover:bg-blue-800 rounded-lg"
                                disabled={isLoadingAttendees}
                            >
                                {isLoadingAttendees ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <Search className="w-4 h-4 mr-2" />
                                )}
                                Tìm kiếm
                            </Button>
                            <Button
                                onClick={clearFilters}
                                variant="outline"
                                className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Attendees List */}
            {selectedShowingTime && (
                <div>
                    {isLoadingAttendees ? (
                        <div className="flex items-center justify-center py-12 text-blue-400">
                            <LoadingSpinner size="lg" />
                            <span className="ml-2">Đang tải danh sách người tham dự...</span>
                        </div>
                    ) : attendees.length === 0 ? (
                        <div className="text-center py-12 text-blue-400">
                            <Users className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Không tìm thấy người tham dự nào</h3>
                            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    ) : (
                        attendees.map((attendee) => (
                            <Card
                                key={attendee.id}
                                className="mb-4 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-[#232c48] to-[#18223a] border border-blue-900"
                            >
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-semibold text-white">{attendee.fullName}</h3>
                                                {getCheckInStatusBadge(attendee.checkInStatus)}
                                            </div>
                                            <div className="flex flex-wrap gap-6 mt-2 text-blue-300 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{attendee.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{attendee.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <QrCode className="w-4 h-4" />
                                                    <span>{attendee.qrToken}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{attendee.seatLabels || "Chưa chọn ghế"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>
                                                        {attendee.zoneNames || "Chưa chọn khu vực"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs flex flex-wrap gap-6 text-blue-400">
                                                {attendee.paidAt && (
                                                    <span>
                                                        Thanh toán: {new Date(attendee.paidAt).toLocaleString("vi-VN")}
                                                    </span>
                                                )}
                                                {attendee.checkInTime && (
                                                    <span>
                                                        Check-in: {new Date(attendee.checkInTime).toLocaleString("vi-VN")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        {attendee.checkInStatus === "NOT_CHECKED_IN" && (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 text-white hover:bg-green-700 rounded-lg"
                                                onClick={() => {
                                                    setSelectedAttendee(attendee);
                                                    setIsAttendeeModalOpen(true);
                                                }}
                                            >
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Check-in
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {selectedShowingTime && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-blue-800 mt-6 text-blue-300">
                    <div className="text-sm">
                        Hiển thị {pagination.number * pagination.size + 1} -{" "}
                        {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)} trong tổng
                        số {pagination.totalElements} kết quả
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white rounded-lg"
                            onClick={() => setPagination((p) => ({ ...p, number: p.number - 1 }))}
                            disabled={pagination.number === 0}
                        >
                            Trước
                        </Button>
                        <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white rounded-lg"
                            onClick={() => setPagination((p) => ({ ...p, number: p.number + 1 }))}
                            disabled={pagination.number >= pagination.totalPages - 1}
                        >
                            Sau
                        </Button>
                    </div>
                </div>
            )}

            {/* QR Scanner and Modal */}
            <QrScanner
                isOpen={isQRScannerOpen}
                onClose={() => setIsQRScannerOpen(false)}
                onScan={handleQRScan}
            />
            <AttendeeModal
                isOpen={isAttendeeModalOpen}
                onClose={() => setIsAttendeeModalOpen(false)}
                attendee={selectedAttendee}
                onCheckIn={(id) => handleCheckIn(id)}
                isCheckingIn={isCheckingIn}
            />
        </div>
    );
};

export default AttendeeManager;
