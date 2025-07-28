import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventInfoStep from "./EventInfoStep";
import TimeTicketStep from "./TimeTicketStep";
import SettingsStep from "./SettingsStep";
import apiClient from "../../api/axios";
import { getCategories } from "../../services/categoryService";

const EditEventForm = () => {
  const { id: eventId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const eventRes = await apiClient.get(`/events/detail/${eventId}`);
        let loaded = eventRes.data.data;

        // Xử lý showingTimes nếu có
        if (loaded.showingTimes && Array.isArray(loaded.showingTimes)) {
          loaded.showingTimes = loaded.showingTimes.map((st) => ({
            ...st,
            hasDesignedLayout: st.hasDesignedLayout ?? false,
            layoutMode: st.layoutMode || "both",
          }));
        }

        // Đảm bảo categoryId là string để select hoạt động tốt
        if (loaded.categoryId) {
          loaded.categoryId = String(loaded.categoryId);
        }

        setEventData(loaded);
        console.log("EventData loaded:", loaded);
        console.log("ShowingTimes:", loaded.showingTimes);

        const catData = await getCategories();
        setCategories(catData);
      } catch (err) {
        console.error("Error fetching event data:", err);
        toast.error("Không thể tải dữ liệu sự kiện.");
        navigate("/organizer");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId, navigate]);

  const location = useLocation();

  // Xử lý returnStep từ LayoutDesigner
  useEffect(() => {
    const returnStep = location.state?.returnStep;

    if (returnStep) {
      console.log("Returning to step:", returnStep);
      setCurrentStep(Number(returnStep));
    }
  }, [location.state]);

  const isStepValid = () => {
    if (!eventData) return false;
    switch (currentStep) {
      case 1:
        return !!eventData.eventTitle && !!eventData.categoryId;
      case 2:
        return (
          !!eventData.venueName &&
          !!eventData.location &&
          !!eventData.city &&
          eventData.showingTimes?.length > 0
        );
      case 3:
        // Yêu cầu TẤT CẢ showing times phải có hasDesignedLayout = true
        return (
          eventData.showingTimes &&
          eventData.showingTimes.length > 0 &&
          eventData.showingTimes.every((st) => st.hasDesignedLayout)
        );
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    if (!isStepValid()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    // Lưu dữ liệu hiện tại lên backend trước khi chuyển bước
    try {
      setLoading(true);
      // Chuẩn bị showingTimes với cấu trúc đúng cho ShowingTimeRequest
      const preparedShowingTimes =
        eventData.showingTimes?.map((st) => {
          // Chỉ lấy các field cần thiết cho ShowingTimeRequest
          const showingTime = {
            id: st.id,
            startTime: st.startTime,
            endTime: st.endTime,
            saleOpenTime: st.saleOpenTime,
            saleCloseTime: st.saleCloseTime,
            layoutMode: st.layoutMode,
          };

          // Xử lý address fields
          if (st.address) {
            showingTime.addressId = st.address.id;
            showingTime.venueName =
              st.address.venueName || "Địa điểm chưa đặt tên";
            showingTime.location =
              st.address.location || "Địa chỉ chưa cập nhật";
            showingTime.city = st.address.city || "Thành phố chưa chọn";
          } else {
            // Fallback nếu không có address object
            showingTime.addressId = st.addressId;
            showingTime.venueName = st.venueName || "Địa điểm chưa đặt tên";
            showingTime.location = st.location || "Địa chỉ chưa cập nhật";
            showingTime.city = st.city || "Thành phố chưa chọn";
          }

          return showingTime;
        }) || [];

      const payload = {
        eventTitle: eventData.eventTitle,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        categoryId: parseInt(eventData.categoryId),
        ageRating: eventData.ageRating,
        bannerText: eventData.bannerText,
        headerImage: eventData.headerImage,
        posterImage: eventData.posterImage,
        statusId: 1, // DRAFT status
        venueName: eventData.venueName,
        location: eventData.location,
        city: eventData.city,
        showingTimes: preparedShowingTimes,
      };

      console.log(`Lưu bước ${currentStep}:`, payload);
      console.log("Original showingTimes:", eventData.showingTimes);
      console.log("Prepared showingTimes:", preparedShowingTimes);

      const response = await apiClient.put(`/events/edit/${eventId}`, payload);
      console.log("API Response:", response.data);
      console.log("API Response data:", response.data?.data);
      console.log(
        "API Response showingTimes:",
        response.data?.data?.showingTimes
      );

      // Cập nhật eventData với showingTimeId mới nếu có response data
      if (response.data?.data?.showingTimes) {
        const updatedShowingTimes = response.data.data.showingTimes;
        console.log("Updated showingTimes with IDs:", updatedShowingTimes);

        // Cập nhật eventData với showingTimeId mới
        setEventData((prev) => ({
          ...prev,
          showingTimes: updatedShowingTimes,
        }));
      }
      // Bỏ phần reload event data từ API để tránh duplicate

      // Chuyển sang bước tiếp theo
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        toast.success(`Đã lưu bước ${currentStep} thành công!`);
      } else {
        // Bước cuối: gửi lên phê duyệt với status PENDING
        try {
          const approvalPayload = {
            ...payload,
            statusId: 2, // PENDING status
          };

          console.log("Sending approval payload:", approvalPayload);
          const approvalResponse = await apiClient.put(
            `/events/edit/${eventId}`,
            approvalPayload
          );
          console.log("Approval response:", approvalResponse.data);

          toast.success("Đã gửi sự kiện lên phê duyệt thành công!", {
            autoClose: 2000,
            onClose: () => navigate("/organizer"),
          });
        } catch (approvalError) {
          console.error("Error sending for approval:", approvalError);
          const approvalErrorMessage =
            approvalError.response?.data?.message ||
            "Có lỗi khi gửi lên phê duyệt!";
          toast.error(approvalErrorMessage);
          return; // Không navigate nếu có lỗi
        }
      }
    } catch (err) {
      console.error("Error saving step:", err);
      const errorMessage =
        err.response?.data?.message || "Có lỗi khi lưu bước này!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stepProps = {
    eventData,
    handleInputChange,
    categories,
    eventId,
    isEdit: true,
    loading,
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EventInfoStep {...stepProps} />;
      case 2:
        return <TimeTicketStep {...stepProps} />;
      case 3:
        return <SettingsStep {...stepProps} />;
      default:
        return null;
    }
  };

  if (loading && !eventData) {
    return (
      <div className="text-center text-gray-400 py-10">Đang tải dữ liệu...</div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center text-gray-400 py-10">
        Không tìm thấy dữ liệu sự kiện
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 text-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Chỉnh sửa sự kiện
          </h1>
          <p className="text-slate-600 text-lg">
            Cập nhật thông tin sự kiện của bạn
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 min-h-96 border border-blue-200/50 shadow-2xl">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate("/organizer")}
            className="px-6 py-3 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all duration-300 flex items-center space-x-2"
          >
            <span>← Quay lại</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={!isStepValid() || loading}
            className={`px-8 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
              isStepValid() && !loading
                ? "bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span className="font-medium">
              {loading
                ? "Đang xử lý..."
                : currentStep === 3
                ? "Hoàn tất"
                : "Tiếp tục"}
            </span>
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default EditEventForm;
