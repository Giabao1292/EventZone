"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
  TrendingUp,
  UserCheck,
  TicketIcon as Seat,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Zap,
  Star,
  Activity,
  Sparkles,
} from "lucide-react"
import {
  getEventShowingTimes,
  getEventAttendees,
  searchAttendeeByQR,
  getEventAnalytics,
  checkInAttendee,
} from "../../services/eventService"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import AttendeeModal from "../admin/AttendeeModal"
import QrScanner from "./QrScanner"

const Select = ({ value, onValueChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`h-12 w-full rounded-2xl border-0 bg-slate-800/90 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-sm transition-shadow duration-200 ${className}`}
  >
    {children}
  </select>
)

const SelectItem = ({ value, children }) => (
  <option className="bg-slate-800 text-slate-200" value={value}>
    {children}
  </option>
)

const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  }
  return <Loader2 className={`animate-spin text-cyan-400 ${sizeClasses[size]}`} />
}

// Optimized Glass Card with reduced effects
const GlassCard = ({ children, className = "", hover = true }) => (
  <div
    className={`
    relative rounded-3xl border border-white/10 
    bg-slate-800/60 backdrop-blur-sm shadow-xl
    ${hover ? "hover:shadow-2xl hover:border-cyan-400/20 transition-all duration-300" : ""}
    ${className}
  `}
    style={{ willChange: hover ? "transform, box-shadow" : "auto" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
    <div className="relative z-10">{children}</div>
  </div>
)

// Optimized Button with reduced animations
const NeonButton = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-500/30",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white",
    ghost: "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/30",
  }

  return (
    <button
      className={`
        px-6 py-3 rounded-2xl font-medium transition-colors duration-200 
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

// Memoized Attendee Card to prevent unnecessary re-renders
const AttendeeCard = ({ attendee, onView, onCheckIn, index }) => {
  const handleView = useCallback(() => onView(attendee), [attendee, onView])
  const handleCheckIn = useCallback(() => onCheckIn(attendee), [attendee, onCheckIn])

  const getCheckInStatusBadge = (status) => {
    const statusConfig = {
      NOT_CHECKED_IN: {
        label: "Chưa check-in",
        className: "bg-amber-500/20 text-amber-300 border border-amber-400/30",
      },
      CHECKED_IN: {
        label: "Đã check-in",
        className: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
      },
      CHECKED_OUT: {
        label: "Đã check-out",
        className: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
      },
    }

    const config = statusConfig[status] || statusConfig.NOT_CHECKED_IN
    return <Badge className={`${config.className} font-medium px-3 py-1.5 text-xs rounded-full`}>{config.label}</Badge>
  }

  return (
    <div
      className="p-6 rounded-2xl bg-slate-800/40 border border-slate-600/30 hover:border-slate-500/50 transition-colors duration-200"
      style={{ transform: "translateZ(0)" }} // Force hardware acceleration
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{attendee.fullName.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <h4 className="font-semibold text-white text-lg truncate">{attendee.fullName}</h4>
              {getCheckInStatusBadge(attendee.checkInStatus)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="truncate">{attendee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{attendee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Seat className="w-4 h-4 text-purple-400" />
                <span>{attendee.seatLabels || "Chưa chọn ghế"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NeonButton variant="ghost" onClick={handleView} className="p-3">
            <Eye className="w-4 h-4" />
          </NeonButton>

          {/* {attendee.checkInStatus === "NOT_CHECKED_IN" && (
            <NeonButton variant="success" onClick={handleCheckIn} className="px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Check-in
            </NeonButton>
          )} */}
        </div>
      </div>
    </div>
  )
}

const AttendeeManager = ({ eventId: propEventId, eventTitle: propEventTitle, onBack }) => {
  let eventId = propEventId
  let eventTitle = propEventTitle

  try {
    const url = window.location.pathname
    const regex = /attendees\/(\d+)/
    const match = url.match(regex)
    if (!eventId && match) eventId = match[1]
  } catch (e) {}

  if (!eventTitle) eventTitle = ""

  // State
  const [showingTimes, setShowingTimes] = useState([])
  const [selectedShowingTime, setSelectedShowingTime] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isLoadingShowingTimes, setIsLoadingShowingTimes] = useState(false)
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [checkInFilter, setCheckInFilter] = useState("all")
  const [pagination, setPagination] = useState({
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [isSearchingByQR, setIsSearchingByQR] = useState(false)
  const [selectedAttendee, setSelectedAttendee] = useState(null)
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false)

  useEffect(() => {
    if (eventId) fetchShowingTimes()
  }, [eventId])

  useEffect(() => {
    if (selectedShowingTime) {
      fetchAttendees()
      fetchAnalytics()
    }
    // eslint-disable-next-line
  }, [selectedShowingTime, pagination.number, pagination.size])

  const fetchShowingTimes = async () => {
    setIsLoadingShowingTimes(true)
    try {
      const response = await getEventShowingTimes(eventId)
      if (response.code === 200) {
        setShowingTimes(response.data)
      }
    } catch (error) {
      console.error("Error fetching showing times:", error)
    } finally {
      setIsLoadingShowingTimes(false)
    }
  }

  const fetchAttendees = async () => {
    if (!selectedShowingTime) return

    setIsLoadingAttendees(true)
    try {
      const searchParams = []
      if (searchTerm.trim()) searchParams.push(`fullName:${searchTerm.trim()}`)
      if (searchEmail.trim()) searchParams.push(`email:${searchEmail.trim()}`)
      if (checkInFilter !== "all") {
        const statusValue = checkInFilter === "not_checked_in" ? "NOT_CHECKED_IN" : "CHECKED_IN"
        searchParams.push(`checkinStatus:${statusValue}`)
      }
      searchParams.push("paymentStatus:CONFIRMED")

      const response = await getEventAttendees(
        eventId,
        selectedShowingTime.startTime,
        pagination.number,
        pagination.size,
        searchParams,
      )

      if (response.code === 200) {
        setAttendees(response.data.content)
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          number: response.data.number,
          size: response.data.size,
        }))
      }
    } catch (error) {
      console.error("Error fetching attendees:", error)
    } finally {
      setIsLoadingAttendees(false)
    }
  }

  const fetchAnalytics = async () => {
    if (!selectedShowingTime) return

    setIsLoadingAnalytics(true)
    try {
      const response = await getEventAnalytics(eventId, selectedShowingTime.startTime)
      if (response.code === 200 && response.data) {
        setAnalytics(response.data)
      } else {
        setAnalytics(null)
      }
    } catch (error) {
      setAnalytics(null)
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ""
    return new Date(dateTimeString).toLocaleString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return ""
    return new Date(dateTimeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const attendeeStats = useMemo(() => {
    if (!analytics) return { total: 0, checkedIn: 0, attendanceRate: 0, totalSeats: 0, sale: 0, averageAttendees: 0 }

    return {
      total: analytics.numberOfAttendees ?? 0,
      checkedIn: analytics.numberOfCheckIns ?? 0,
      attendanceRate:
        analytics.numberOfAttendees > 0 ? (analytics.numberOfCheckIns / analytics.numberOfAttendees) * 100 : 0,
      totalSeats: analytics.numberOfSeats ?? 0,
      sale: analytics.sale ?? 0,
      averageAttendees: analytics.averageAttendees ?? 0,
    }
  }, [analytics])

  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 5
    const startPage = Math.max(0, pagination.number - Math.floor(maxButtons / 2))
    const endPage = Math.min(pagination.totalPages - 1, startPage + maxButtons - 1)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPagination((prev) => ({ ...prev, number: i }))}
          className={`w-10 h-10 text-sm font-medium rounded-xl transition-colors duration-200 ${
            i === pagination.number
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          {i + 1}
        </button>,
      )
    }
    return buttons
  }

  const handleQRScan = async (qrToken) => {
    if (!selectedShowingTime) {
      alert("Vui lòng chọn thời gian chiếu trước!")
      return
    }

    setIsSearchingByQR(true)
    try {
      const response = await searchAttendeeByQR(eventId, selectedShowingTime.startTime, qrToken)
      if (response.code === 200 && response.data.content.length > 0) {
        setSelectedAttendee(response.data.content[0])
        setIsAttendeeModalOpen(true)
      } else {
        alert("Không tìm thấy người tham dự với mã QR này!")
      }
    } catch (error) {
      console.error("Error searching by QR:", error)
      alert("Có lỗi xảy ra khi tìm kiếm!")
    } finally {
      setIsSearchingByQR(false)
      setIsQRScannerOpen(false)
    }
  }

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, number: 0 }))
    fetchAttendees()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSearchEmail("")
    setCheckInFilter("all")
    setPagination((prev) => ({ ...prev, number: 0 }))
  }

  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const handleCheckIn = async (bookingId) => {
    setIsCheckingIn(true)
    try {
      await checkInAttendee(bookingId)
      await fetchAttendees()
      await fetchAnalytics()
      alert("Check-in thành công!")
      setIsAttendeeModalOpen(false)
    } catch (error) {
      console.error("Error checking in attendee:", error)
      alert("Có lỗi xảy ra khi check-in!")
    } finally {
      setIsCheckingIn(false)
    }
  }

  // Optimized callbacks
  const handleAttendeeView = useCallback((attendee) => {
    setSelectedAttendee(attendee)
    setIsAttendeeModalOpen(true)
  }, [])

  const handleAttendeeCheckIn = useCallback((attendee) => {
    setSelectedAttendee(attendee)
    setIsAttendeeModalOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Simplified Background - Only one subtle orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl" />

      {/* Optimized Header */}
      <div className="sticky top-4 z-50 mx-4 mb-8">
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {onBack && (
                <NeonButton variant="ghost" onClick={onBack} className="p-3">
                  <ArrowLeft className="w-5 h-5" />
                </NeonButton>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Quản lý người tham dự</h1>
                  <p className="text-slate-400 text-sm mt-1">{eventTitle || "Chưa có tên sự kiện"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NeonButton variant="ghost" onClick={fetchShowingTimes} disabled={isLoadingShowingTimes} className="p-3">
                <RefreshCw className={`w-5 h-5 ${isLoadingShowingTimes ? "animate-spin" : ""}`} />
              </NeonButton>
              <NeonButton variant="ghost" className="p-3">
                <Download className="w-5 h-5" />
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-8 pb-12">
        {/* Showing Times */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Thời gian chiếu</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent" />
          </div>

          {isLoadingShowingTimes ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-lg">Đang tải thời gian chiếu...</span>
            </div>
          ) : showingTimes.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Clock className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-lg">Không có thời gian chiếu nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showingTimes.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedShowingTime(st)}
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transition-colors duration-200
                    ${
                      selectedShowingTime?.id === st.id
                        ? "bg-cyan-500/20 border-2 border-cyan-400/50"
                        : "bg-slate-800/50 border border-slate-600/30 hover:border-slate-500/50"
                    }
                  `}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold text-white">{formatDateTime(st.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300">
                        {formatTime(st.startTime)} - {formatTime(st.endTime)}
                      </span>
                    </div>
                    {selectedShowingTime?.id === st.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Stats */}
        {selectedShowingTime && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Tổng người tham dự",
                value: attendeeStats.total,
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: UserCheck,
                title: "Đã check-in",
                value: attendeeStats.checkedIn,
                gradient: "from-emerald-500 to-green-600",
              },
              {
                icon: Seat,
                title: "Tổng số ghế",
                value: attendeeStats.totalSeats,
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: TrendingUp,
                title: "Tỷ lệ tham dự",
                value: `${attendeeStats.attendanceRate.toFixed(1)}%`,
                gradient: "from-orange-500 to-red-600",
              },
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {isLoadingAnalytics ? <LoadingSpinner size="sm" /> : stat.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{stat.title}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Search Section */}
        {selectedShowingTime && (
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Tìm kiếm & Lọc</h3>
              </div>
              <NeonButton variant="ghost" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </NeonButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Tìm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder-slate-400 rounded-2xl focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm theo email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-12 h-12 bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder-slate-400 rounded-2xl focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <NeonButton
                  variant="success"
                  onClick={() => setIsQRScannerOpen(true)}
                  disabled={isSearchingByQR}
                  className="h-12 px-4 rounded-2xl"
                >
                  {isSearchingByQR ? <LoadingSpinner size="sm" /> : <QrCode className="w-5 h-5" />}
                </NeonButton>
              </div>

              <Select value={checkInFilter} onValueChange={setCheckInFilter}>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="not_checked_in">Chưa check-in</SelectItem>
                <SelectItem value="checked_in">Đã check-in</SelectItem>
              </Select>
            </div>

            <NeonButton onClick={handleSearch} disabled={isLoadingAttendees}>
              {isLoadingAttendees ? <LoadingSpinner size="sm" /> : <Zap className="w-4 h-4 mr-2" />}
              Tìm kiếm
            </NeonButton>
          </GlassCard>
        )}

        {/* Attendees List */}
        {selectedShowingTime && (
          <GlassCard className="overflow-hidden">
            <div className="p-8 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Danh sách người tham dự</h3>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 rounded-full text-sm text-slate-300">
                  {pagination.totalElements} người tham dự
                </div>
              </div>
            </div>

            <div className="p-8">
              {isLoadingAttendees ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3 text-lg">Đang tải danh sách...</span>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                    <Users className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-lg">Không tìm thấy người tham dự nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendees.map((attendee, index) => (
                    <AttendeeCard
                      key={attendee.id}
                      attendee={attendee}
                      onView={handleAttendeeView}
                      onCheckIn={handleAttendeeCheckIn}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-8 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Hiển thị {pagination.number * pagination.size + 1}-
                    {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)}
                    trong {pagination.totalElements} kết quả
                  </div>

                  <div className="flex items-center gap-3">
                    <NeonButton
                      variant="ghost"
                      onClick={() => setPagination((p) => ({ ...p, number: p.number - 1 }))}
                      disabled={pagination.number === 0}
                      className="p-3"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </NeonButton>

                    <div className="flex items-center gap-2">{renderPaginationButtons()}</div>

                    <NeonButton
                      variant="ghost"
                      onClick={() => setPagination((p) => ({ ...p, number: p.number + 1 }))}
                      disabled={pagination.number >= pagination.totalPages - 1}
                      className="p-3"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </NeonButton>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>

      {/* Modals */}
      <QrScanner isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} onScan={handleQRScan} />
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        attendee={selectedAttendee}
        onCheckIn={(id) => handleCheckIn(id)}
        isCheckingIn={isCheckingIn}
      />
    </div>
  )
}

export default AttendeeManager
