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
        className={`flex h-10 w-full rounded-md border border-gray-700 bg-[#1e2a45] px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
        {children}
    </select>
);

const SelectItem = ({ value, children }) => (
    <option className="bg-[#1e2a45] text-gray-100" value={value}>{children}</option>
);

const LoadingSpinner = ({ size = "default" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
    };
    return <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />;
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

    // Fetch showing times
    useEffect(() => {
        if (eventId) fetchShowingTimes();
    }, [eventId]);

    // Fetch attendees & analytics when showing time selected
    useEffect(() => {
        if (selectedShowingTime) {
            fetchAttendees();
            fetchAnalytics();
        }
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
            if (response.code === 200) setAnalytics(response.data);
        } catch (error) {
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
        if (analytics) {
            return {
                total: analytics.numberOfAttendees,
                checkedIn: analytics.numberOfCheckIns,
                attendanceRate:
                    analytics.numberOfAttendees > 0
                        ? (analytics.numberOfCheckIns / analytics.numberOfAttendees) * 100
                        : 0,
                totalSeats: analytics.numberOfSeats,
                sale: analytics.sale,
                averageAttendees: analytics.averageAttendees,
            };
        }
        const total = attendees.length;
        const checkedIn = attendees.filter((a) => a.checkInStatus === "CHECKED_IN").length;
        const totalSeats = attendees.reduce((sum, a) => sum + (a.numberOfSeats || 0), 0);
        return {
            total,
            checkedIn,
            attendanceRate: total > 0 ? (checkedIn / total) * 100 : 0,
            totalSeats,
            sale: 0,
            averageAttendees: 0,
        };
    }, [attendees, analytics]);

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
                    className={`px-3 py-1 text-sm rounded-md border ${
                        i === pagination.number
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-700 text-gray-100 hover:bg-blue-800"
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

    return (
        <div className="min-h-screen p-8 bg-[#121b2f] text-gray-100 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
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
                <h1 className="text-3xl font-semibold tracking-wide text-white drop-shadow-md">
                    Quản lý thời gian chiếu
                </h1>
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
            <p className="mb-8 text-xl font-semibold text-blue-400">
                Sự kiện: <span className="text-white">{eventTitle || "Chưa có tên sự kiện"}</span>
            </p>

            {/* Showing Times */}
            <Card className="mb-8 bg-[#1e2a45] border border-blue-800 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Clock className="w-5 h-5" />
                        Danh sách thời gian chiếu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingShowingTimes ? (
                        <div className="flex items-center justify-center py-8 text-blue-500">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {showingTimes.map((st) => (
                                <Card
                                    key={st.id}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        selectedShowingTime?.id === st.id
                                            ? "ring-2 ring-blue-500 bg-blue-700"
                                            : "hover:bg-blue-900"
                                    }`}
                                    onClick={() => setSelectedShowingTime(st)}
                                >
                                    <CardContent className="p-4 text-gray-100">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span className="font-medium">{formatDateTime(st.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-400" />
                                                <span>
                                                    {formatTime(st.startTime)} - {formatTime(st.endTime)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-blue-400">
                                                <div>Mở bán: {formatDateTime(st.saleOpenTime)}</div>
                                                <div>Đóng bán: {formatDateTime(st.saleCloseTime)}</div>
                                            </div>
                                            {selectedShowingTime?.id === st.id && (
                                                <Badge className="w-full justify-center bg-blue-400 text-gray-900 font-semibold">
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
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <Card className="bg-[#1e2a45] border border-blue-800 shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-400">
                                <Users className="w-6 h-6" />
                                Tổng người tham dự
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{attendeeStats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1e2a45] border border-blue-800 shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-6 h-6" />
                                Đã check-in
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-300">{attendeeStats.checkedIn}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1e2a45] border border-blue-800 shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-400">
                                <QrCode className="w-6 h-6" />
                                Tổng số ghế
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-300">{attendeeStats.totalSeats}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1e2a45] border border-purple-600 shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-400">
                                <Users className="w-6 h-6" />
                                Tỷ lệ tham dự
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-300">
                                {attendeeStats.attendanceRate.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            {selectedShowingTime && (
                <Card className="mb-8 bg-[#1e2a45] border border-blue-800 shadow">
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                            <div>
                                <Label className="text-blue-400 font-semibold mb-1">Tìm kiếm theo tên</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                    <Input
                                        placeholder="Nhập tên người tham dự..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-11 bg-[#18223a] text-white placeholder-blue-400 border border-blue-600 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-blue-400 font-semibold mb-1">Tìm kiếm theo email</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                        <Input
                                            placeholder="Nhập email..."
                                            value={searchEmail}
                                            onChange={(e) => setSearchEmail(e.target.value)}
                                            className="pl-11 bg-[#18223a] text-white placeholder-blue-400 border border-blue-600 focus:ring-blue-500 focus:border-blue-500"
                                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setIsQRScannerOpen(true)}
                                        className="h-12 px-4 bg-green-600 hover:bg-green-700"
                                        disabled={isSearchingByQR}
                                    >
                                        {isSearchingByQR ? <LoadingSpinner size="sm" /> : <QrCode className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-blue-400 font-semibold mb-1">Trạng thái check-in</Label>
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
                                className="bg-blue-600 hover:bg-blue-700"
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
                                className="text-blue-400 border-blue-600 hover:bg-blue-600 hover:text-white"
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
                        <div className="flex items-center justify-center py-12 text-blue-500">
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
                                className="mb-4 shadow-lg hover:shadow-xl transition-shadow bg-[#1e2a45] border border-blue-700"
                            >
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-semibold text-white">{attendee.fullName}</h3>
                                            {getCheckInStatusBadge(attendee.checkInStatus)}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-blue-400 text-sm mt-2">
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
                                                <span>{attendee.zoneNames || "Chưa chọn khu vực"}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm flex flex-wrap gap-6 text-blue-400">
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
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-blue-600 text-blue-300 hover:bg-blue-600 hover:text-white"
                                            onClick={() => alert(`Gửi email cho ${attendee.fullName}`)}
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Gửi email
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {selectedShowingTime && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-blue-700 mt-6 text-blue-400">
                    <div className="text-sm">
                        Hiển thị {pagination.number * pagination.size + 1} -{" "}
                        {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)} trong tổng số{" "}
                        {pagination.totalElements} kết quả
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                            onClick={() => setPagination((p) => ({ ...p, number: p.number - 1 }))}
                            disabled={pagination.number === 0}
                        >
                            Trước
                        </Button>
                        <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
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
                onCheckIn={() => {}}
                isCheckingIn={false}
            />
        </div>
    );
};

export default AttendeeManager;
