"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

// Import API services
import {
  getEventDetail,
  updateEventStatus,
  mapApiEventDetailToComponent,
  mapDisplayStatusToApi,
} from "../../services/eventService";

import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="p-6 pb-4 border-b">{children}</div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

const DialogContent = ({ children }) => <div className="p-6">{children}</div>;

const DialogFooter = ({ children, className = "" }) => (
  <div className={`p-6 pt-4 border-t flex justify-end gap-3 ${className}`}>
    {children}
  </div>
);
// Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};
const EventApprovalModal = ({ event, isOpen, onClose, onSuccess }) => {
  const [action, setAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventDetail, setEventDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch event detail when modal opens
  useEffect(() => {
    if (isOpen && event && !eventDetail) {
      fetchEventDetail();
    }
  }, [isOpen, event]);

  const fetchEventDetail = async () => {
    if (!event?.id) return;

    setLoadingDetail(true);
    try {
      const response = await getEventDetail(event.id);
      if (response.code === 200) {
        const mappedDetail = mapApiEventDetailToComponent(response.data);
        setEventDetail(mappedDetail);
      }
    } catch (error) {
      console.error("Error fetching event detail:", error);
      // Use basic event data if detail fetch fails
      setEventDetail(event);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async () => {
    if (!event) return;
    setIsLoading(true);

    try {
      const response = await updateEventStatus(
        event.id,
        mapDisplayStatusToApi("approved")
      );
      alert("Sự kiện đã được duyệt thành công!");
      onSuccess();
      onClose();
      setAction(null);
      window.location.reload();
    } catch (error) {
      console.error("Error approving event:", error);
      alert("Có lỗi xảy ra khi duyệt sự kiện!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!event || !rejectionReason.trim()) return;

    setIsLoading(true);

    try {
      await updateEventStatus(
        event.id,
        mapDisplayStatusToApi("rejected"),
        rejectionReason
      );

      // Nếu tới được đây tức là không bị catch lỗi => Thành công
      alert("Sự kiện đã được từ chối!");
      onSuccess?.();
      onClose?.();
      setAction(null);
      setRejectionReason("");
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting event:", error);
      alert("Có lỗi xảy ra khi từ chối sự kiện!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setAction(null);
    setRejectionReason("");
    setEventDetail(null);
    onClose();
  };

  if (!event) return null;

  const displayEvent = eventDetail || event;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogHeader>
        {displayEvent?.status === "approved" ? (
          <DialogTitle>
            Sự kiện đã được duyệt{" "}
            <CheckCircle className="inline w-5 h-5 text-green-600 ml-1" />
          </DialogTitle>
        ) : displayEvent?.status === "rejected" ? (
          <DialogTitle>
            Sự kiện đã bị từ chối{" "}
            <XCircle className="inline w-5 h-5 text-red-600 ml-1" />
          </DialogTitle>
        ) : (
          <DialogTitle>Chi tiết sự kiện - Xem xét duyệt</DialogTitle>
        )}
      </DialogHeader>

      <DialogContent>
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-2">Đang tải chi tiết sự kiện...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Event Image */}
            {displayEvent.imageUrl && (
              <div className="w-full">
                <img
                  src={displayEvent.imageUrl || "/placeholder.svg"}
                  alt={displayEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Event Title and Category */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {displayEvent.title}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{displayEvent.category}</Badge>
                {displayEvent.ageRating && (
                  <Badge variant="secondary">{displayEvent.ageRating}</Badge>
                )}
                {displayEvent.tags &&
                  displayEvent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Ngày diễn ra</p>
                    <p className="text-gray-600">
                      {displayEvent.date &&
                        new Date(displayEvent.date).toLocaleDateString(
                          "vi-VN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Thời gian</p>
                    <p className="text-gray-600">
                      {displayEvent.time}
                      {displayEvent.endTime && ` - ${displayEvent.endTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Địa điểm</p>
                    <p className="text-gray-600">{displayEvent.location}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Giá vé</p>
                    <p className="text-gray-600">
                      {displayEvent.price === 0
                        ? "Miễn phí"
                        : `${displayEvent.price.toLocaleString("vi-VN")} VNĐ`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Số lượng vé</p>
                    <p className="text-gray-600">
                      {displayEvent.maxTickets || "Không giới hạn"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    {displayEvent.orgLogoUrl ? (
                      <img
                        src={displayEvent.orgLogoUrl || "/placeholder.svg"}
                        alt="Organizer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">O</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Người tổ chức</p>
                    <p className="text-gray-600">
                      {displayEvent.organizerName}
                    </p>
                    {displayEvent.organizerEmail && (
                      <p className="text-sm text-gray-500">
                        {displayEvent.organizerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Mô tả sự kiện
              </h3>
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {displayEvent.description}
                </p>
              </div>
            </div>

            {/* Banner Text */}
            {displayEvent.bannerText && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin banner
                </h3>
                <div className="p-4 bg-blue-50 border rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {displayEvent.bannerText}
                  </p>
                </div>
              </div>
            )}

            {/* Showing Times */}
            {displayEvent.showingTimes &&
              displayEvent.showingTimes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lịch chiếu
                  </h3>
                  <div className="space-y-2">
                    {displayEvent.showingTimes.map((showTime, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 border rounded-lg"
                      >
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>
                              {showTime.startTime &&
                                new Date(showTime.startTime).toLocaleString(
                                  "vi-VN"
                                )}
                              {showTime.endTime &&
                                ` - ${new Date(showTime.endTime).toLocaleString(
                                  "vi-VN"
                                )}`}
                            </span>
                          </div>
                          {showTime.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span>{showTime.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Event Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                <p className="text-gray-900">
                  {displayEvent.createdAt &&
                    new Date(displayEvent.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cập nhật lần cuối
                </p>
                <p className="text-gray-900">
                  {displayEvent.updatedAt &&
                    new Date(displayEvent.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            {action === "reject" ? (
              // ✅ Trường hợp đang thực hiện hành động từ chối: Cho phép chỉnh lý do
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <Label
                  htmlFor="rejection-reason"
                  className="text-lg font-semibold text-red-800 mb-3 block"
                >
                  Lý do từ chối sự kiện *
                </Label>
                <Textarea
                  placeholder="Vui lòng nhập lý do cụ thể tại sao sự kiện này bị từ chối..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-red-600 mt-2">
                  Lý do từ chối sẽ được gửi email thông báo đến người tổ chức.
                </p>
              </div>
            ) : displayEvent?.status === "rejected" ? (
              // ✅ Trường hợp đã từ chối nhưng chưa click action: Chỉ hiển thị readonly
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <Label
                  htmlFor="rejection-reason"
                  className="text-lg font-semibold text-red-800 mb-3 block"
                >
                  Lý do từ chối sự kiện
                </Label>
                <Textarea
                  value={displayEvent.rejectionReason}
                  readOnly
                  rows={4}
                />
                <p className="text-sm text-red-600 mt-2">
                  Lý do từ chối đã được gửi email cho người tổ chức.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>

      <DialogFooter>
        {displayEvent?.status === "approved" ? (
          // ✅ Đã duyệt: Chỉ còn cho phép Từ chối
          !action ? (
            <>
              <Button variant="outline" onClick={resetModal}>
                Đóng
              </Button>
              <Button variant="destructive" onClick={() => setAction("reject")}>
                <XCircle className="w-5 h-5 mr-2" />
                Từ chối sự kiện
              </Button>
            </>
          ) : action === "reject" ? (
            <>
              <Button variant="outline" onClick={() => setAction(null)}>
                Quay lại
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </Button>
            </>
          ) : null
        ) : !action ? (
          // ✅ Trường hợp status là pending, null hoặc rejected → luôn hiển thị cả Duyệt và Từ chối
          <>
            <Button variant="outline" onClick={resetModal}>
              Đóng
            </Button>
            <Button variant="destructive" onClick={() => setAction("reject")}>
              <XCircle className="w-5 h-5 mr-2" />
              Từ chối sự kiện
            </Button>
            <Button
              onClick={() => setAction("approve")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Duyệt sự kiện
            </Button>
          </>
        ) : action === "approve" ? (
          <>
            <Button variant="outline" onClick={() => setAction(null)}>
              Quay lại
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setAction(null)}>
              Quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading || !rejectionReason.trim()}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
};
export default EventApprovalModal;

