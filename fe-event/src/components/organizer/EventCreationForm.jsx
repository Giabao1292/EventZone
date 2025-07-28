import { useState, useEffect } from "react";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import EventInfoStep from "./EventInfoStep";
import TimeTicketStep from "./TimeTicketStep";
import SettingsStep from "./SettingsStep";
import { getCategories } from "../../services/categoryService";
import { createShowingTime } from "../../services/showingTime";
import apiClient from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DepositStep from "./DepositStep";

const steps = [
  { id: 1, title: "Thông tin sự kiện", icon: "🎉" },
  { id: 2, title: "Địa chỉ & Thời gian", icon: "📍" },
  { id: 3, title: "Thiết kế vé & Chỗ ngồi", icon: "🎫" },
  { id: 4, title: "Hoàn Tất Sự Kiện", icon: "💰" },
];

const ProgressSteps = ({ steps, currentStep }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                    : isCurrent
                    ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/25"
                    : "bg-white/80 text-slate-400 border-2 border-slate-200 shadow-sm"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              <p
                className={`mt-3 text-sm font-medium text-center transition-colors duration-300 ${
                  isCurrent
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-6 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

ProgressSteps.propTypes = {
  steps: PropTypes.array.isRequired,
  currentStep: PropTypes.number.isRequired,
};

const EventCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [eventId, setEventId] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const organizerId = user?.organizer.id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    eventTitle: "",
    categoryId: "",
    description: "",
    ageRating: "",
    bannerText: "",
    headerImage: null,
    posterImage: null,
    startTime: "",
    endTime: "",
    location: "",
    city: "",
    hasDesignedLayout: false,
    venueName: "",
    maxCapacity: "",
    statusId: 1,
    showingTimes: [],
  });

  useEffect(() => {
    if (location.state?.eventData) {
      console.log("Received state:", location.state);
      setEventData(location.state.eventData);
      setEventId(location.state.eventData.id || location.state.eventId);
    }
    if (location.state?.returnStep) {
      setCurrentStep(location.state.returnStep);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        toast.error("Không thể tải danh mục. Sử dụng danh mục mặc định.");
        setCategories([
          { id: 1, name: "Âm nhạc" },
          { id: 2, name: "Thể thao" },
          { id: 3, name: "Công nghệ" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!eventData.eventTitle && !!eventData.categoryId;
      case 2:
        return (
          !!eventData.venueName &&
          !!eventData.location &&
          !!eventData.city &&
          eventData.showingTimes.length > 0
        );
      case 3:
        return eventData.showingTimes.every((st) => st.hasDesignedLayout);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    if (!isStepValid()) return;

    setLoading(true);
    try {
      if (currentStep === 1 && !eventId) {
        const payload = {
          organizerId,
          eventTitle: eventData.eventTitle,
          description: eventData.description,
          startTime: eventData?.startTime,
          endTime: eventData?.endTime,
          categoryId: parseInt(eventData.categoryId),
          ageRating: eventData?.ageRating,
          bannerText: eventData?.bannerText,
          headerImage: eventData.headerImage,
          posterImage: eventData.posterImage,
        };

        const res = await apiClient.post("/events/create", payload);
        const createdId = res.data.data.eventId;
        setEventId(createdId);
        setEventData((prev) => ({ ...prev, id: createdId }));
        toast.success("Tạo bản nháp sự kiện thành công!");
      }

      if (currentStep === 2 && eventId) {
        const payload = {
          eventId,
          venueName: eventData.venueName,
          location: eventData.location,
          city: eventData.city,
          showingTimes: eventData.showingTimes,
        };

        const res = await createShowingTime(payload);
        console.log("Showing times created:", res.data.data);
        const showingTimes = res.data.data;

        if (Array.isArray(showingTimes) && showingTimes.length > 0) {
          setEventData((prev) => ({
            ...prev,
            showingTimes: showingTimes.map((st) => ({
              ...st,
              hasDesignedLayout: false,
            })),
          }));
          toast.success("Lưu địa điểm & thời gian thành công!");
        } else {
          toast.error("Không nhận được dữ liệu showing time.");
        }
      }

      if (currentStep === 4) {
        try {
          await apiClient.post(`/events/save/${eventData.id}`);
          toast.success("Sự kiện đã được gửi để phê duyệt!", {
            autoClose: 2000,
            onClose: () => navigate("/organizer"),
          });
        } catch (error) {
          toast.error("Lỗi khi gửi sự kiện!");
          console.error(error);
        }
        return;
      }

      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      const message = "Lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      eventData,
      handleInputChange,
      categories,
      loading,
      eventId,
      setLoading,
    };

    switch (currentStep) {
      case 1:
        return <EventInfoStep {...stepProps} onNextStep={handleNextStep} />;
      case 2:
        return <TimeTicketStep {...stepProps} />;
      case 3:
        return <SettingsStep {...stepProps} />;
      case 4:
        return <DepositStep {...stepProps} />;
      default:
        return null;
    }
  };

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
            Tạo sự kiện mới
          </h1>
          <p className="text-slate-600 text-lg">
            Thiết lập sự kiện của bạn với thông tin chi tiết
          </p>
        </div>

        <ProgressSteps steps={steps} currentStep={currentStep} />

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
            {loading && <Loader2 className="animate-spin" size={18} />}
            <span className="font-medium">
              {loading
                ? "Đang xử lý..."
                : currentStep === 4
                ? "Hoàn tất"
                : "Tiếp tục"}
            </span>
            {currentStep < 4 && !loading && <ChevronRight size={18} />}
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

export default EventCreationForm;
