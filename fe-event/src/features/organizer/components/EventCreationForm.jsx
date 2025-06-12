import { useState, useEffect } from "react";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import EventInfoStep from "./EventInfoStep";
import TimeTicketStep from "./TimeTicketStep";
import SettingsStep from "./SettingsStep";
import { getCategories } from "../../../services/categoryService";

import PropTypes from "prop-types";

// ProgressSteps Component
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
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
};

// Main Component
const EventCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [eventData, setEventData] = useState({
    event_title: "",
    organizer_id: 1,
    category_id: "",
    description: "",
    age_rating: "",
    banner_text: "",
    header_image: null,
    poster_image: null,
    start_time: "",
    end_time: "",
    location: "",
    seating_layout: "general",
    ticket_price: "",
    max_capacity: "",
    status_id: 1,
  });

  const steps = [
    { id: 1, title: "Thông tin sự kiện" },
    { id: 2, title: "Thời gian & Loại vé" },
    { id: 3, title: "Cài đặt" },
    { id: 4, title: "Thông tin thanh toán" },
  ];

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Fallback to mock categories");
        setCategories([
          { id: 1, name: "Âm nhạc" },
          { id: 2, name: "Thể thao" },
          { id: 3, name: "Công nghệ" },
          { id: 4, name: "Giáo dục" },
          { id: 5, name: "Nghệ thuật" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Save step data to backend
  const saveStepData = async () => {
    if (!isStepValid()) return;

    setLoading(true);
    try {
      let updateData = {};

      switch (currentStep) {
        case 1:
          updateData = {
            event_title: eventData.event_title,
            organizer_id: eventData.organizer_id,
            category_id: parseInt(eventData.category_id),
            description: eventData.description,
            age_rating: eventData.age_rating,
            banner_text: eventData.banner_text,
            header_image: eventData.header_image?.name || null,
            poster_image: eventData.poster_image?.name || null,
            status_id: eventData.status_id,
            created_at: new Date().toISOString(),
          };
          // Call createEvent here if needed
          // const created = await createEvent(updateData);
          // setEventId(created.event_id || created.id);
          break;

        case 2:
          updateData = {
            start_time: eventData.start_time,
            end_time: eventData.end_time,
            max_capacity: parseInt(eventData.max_capacity),
            updated_at: new Date().toISOString(),
          };
          // await updateEvent(eventId, updateData);
          break;

        case 3:
          updateData = {
            location: eventData.location,
            seating_layout: eventData.seating_layout,
            updated_at: new Date().toISOString(),
          };
          // await updateEvent(eventId, updateData);
          break;

        case 4:
          updateData = {
            ticket_price: parseFloat(eventData.ticket_price),
            status_id: 2, // Published
            updated_at: new Date().toISOString(),
          };
          // await updateEvent(eventId, updateData);
          alert("🎉 Tạo sự kiện thành công!");
          break;

        default:
          break;
      }

      // Simulate success for now
      if (currentStep === 1 && !eventId) {
        setEventId("EV12345"); // fake ID
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    await saveStepData();
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!eventData.event_title && !!eventData.category_id;
      case 2:
        return !!eventData.start_time && !!eventData.end_time;
      case 3:
        return !!eventData.location;
      case 4:
        return !!eventData.ticket_price;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const props = { eventData, handleInputChange, loading };
    switch (currentStep) {
      case 1:
        return <EventInfoStep {...props} categories={categories} />;
      case 2:
        return <TimeTicketStep {...props} />;
      case 3:
        return <SettingsStep {...props} />;
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

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md ${
              currentStep === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
            }`}
          >
            Quay lại
          </button>

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
                ? "Đang lưu..."
                : currentStep === 4
                ? "Hoàn thành"
                : "Lưu & Tiếp tục"}
            </span>
            {currentStep < 4 && !loading && <ChevronRight size={16} />}
          </button>
        </div>

        {eventId && (
          <div className="mt-4 text-center text-sm text-green-400">
            ✅ Event ID: {eventId}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCreationForm;
