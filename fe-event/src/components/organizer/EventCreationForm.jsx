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
const steps = [
  { id: 1, title: "Thông tin sự kiện" },
  { id: 2, title: "Địa chỉ & Thời gian" },
  { id: 3, title: "Thiết kế vé Và chỗ ngồi" },
  { id: 4, title: "Thông tin thanh toán" },
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
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-green-900/30 text-green-400 border-2 border-green-500"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium text-center ${
                  isCurrent ? "text-green-400" : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  isCompleted ? "bg-green-500" : "bg-gray-700"
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
    event_title: "",
    category_id: "",
    description: "",
    age_rating: "",
    banner_text: "",
    header_image: null,
    poster_image: null,
    start_time: "",
    end_time: "",
    location: "",
    city: "",
    hasDesignedLayout: false,
    venueName: "",
    max_capacity: "",
    status_id: 1,
    showingTimes: [],
  });
  useEffect(() => {
    // Handle when returning from layout designer with state
    if (location.state?.eventData) {
      console.log("Received eventData from state:", location.state.eventData);
      setEventData(location.state.eventData);
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
        return !!eventData.event_title && !!eventData.category_id;
      case 2:
        return (
          !!eventData.venueName &&
          !!eventData.location &&
          !!eventData.city &&
          eventData.showingTimes.length > 0
        );
      case 3:
        return eventData.hasDesignedLayout;
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
          eventTitle: eventData.event_title,
          description: eventData.description,
          startTime: eventData.start_time,
          endTime: eventData.end_time,
          categoryId: parseInt(eventData.category_id),
          ageRating: eventData.age_rating,
          bannerText: eventData.banner_text,
          headerImage: eventData.header_image,
          posterImage: eventData.poster_image,
        };

        const res = await apiClient.post("/events/create", payload);
        const createdId = res.data.data.eventId;
        setEventId(createdId);
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
        const showingTimes = res.data;

        if (Array.isArray(showingTimes) && showingTimes.length > 0) {
          setEventData((prev) => ({
            ...prev,
            showingTimes, // đã là camelCase → gán thẳng
          }));
          toast.success("Lưu địa điểm & thời gian thành công!");
        } else {
          toast.error("Không nhận được dữ liệu showing time.");
        }
      }
      if (currentStep === 4) {
        // Final submission
        try {
          const res = await apiClient.post(`/events/save/${eventData.id}`);
          toast.success("Sự kiện đã được gửi để phê duyệt!", {
            autoClose: 2000, // Show for 2 seconds
            onClose: () => navigate("/organizer"), // Navigate after toast closes
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
      console.error("Lỗi:", err);
      const message =
        err?.message || "Lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại.";
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
    };

    switch (currentStep) {
      case 1:
        return <EventInfoStep {...stepProps} onNextStep={handleNextStep} />;
      case 2:
        return <TimeTicketStep {...stepProps} />;
      case 3:
        return <SettingsStep {...stepProps} />;
      case 4:
        return <div>Thông tin thanh toán chưa làm bấm hoàn tất đi</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <ProgressSteps steps={steps} currentStep={currentStep} />
        <div className="bg-gray-800 rounded-lg p-6 min-h-96 border border-gray-700">
          {renderStepContent()}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleNextStep}
            disabled={!isStepValid() || loading}
            className={`px-6 py-2 rounded-md flex items-center space-x-2 ${
              isStepValid() && !loading
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            <span>
              {loading
                ? "Đang xử lý..."
                : currentStep === 4
                ? "Hoàn tất"
                : "Tiếp tục"}
            </span>
            {currentStep < 4 && !loading && <ChevronRight size={16} />}
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
          theme="dark"
        />
      </div>
    </div>
  );
};

export default EventCreationForm;
