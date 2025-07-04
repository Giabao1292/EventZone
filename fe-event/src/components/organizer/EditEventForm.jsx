import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventInfoStep from "./EventInfoStep";
import TimeTicketStep from "./TimeTicketStep";
import SettingsStep from "./SettingsStep";
import apiClient from "../../api/axios";
import { getCategories } from "../../services/categoryService";
import { createShowingTime } from "../../services/showingTime"; // hoặc updateShowingTime nếu có

const steps = [
    { id: 1, title: "Thông tin sự kiện" },
    { id: 2, title: "Địa chỉ & Thời gian" },
    { id: 3, title: "Thiết kế vé và chỗ ngồi" },
];

const EditEventForm = () => {
    const { id: eventId } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [eventData, setEventData] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // === Đặt ở ĐÂY, KHÔNG ĐẶT BÊN NGOÀI ===
    const handleInputChange = (field, value) => {
        setEventData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const eventRes = await apiClient.get(`/events/detail/${eventId}`);
                let loaded = eventRes.data.data;
                if (loaded.showingTimes && Array.isArray(loaded.showingTimes)) {
                    loaded.showingTimes = loaded.showingTimes.map(st => ({
                        ...st,
                        hasDesignedLayout: st.hasDesignedLayout ?? false // hoặc true nếu bạn chắc chắn
                    }));
                }
                setEventData(eventRes.data.data); // tùy API trả về
                console.log("EventData loaded:", eventRes.data.data); // Log chỉ 1 lần ở đây khi load
                const catData = await getCategories();
                setCategories(catData);
            } catch (err) {
                toast.error("Không thể tải dữ liệu sự kiện.");
                navigate("/organizer");
            }
        }
        fetchData();
    }, [eventId, navigate]);

    const isStepValid = () => {
        if (!eventData) return false;
        switch (currentStep) {
            case 1:
                return !!eventData.eventTitle && !!eventData.categoryId;
            case 2:
                return !!eventData.venueName && !!eventData.location && !!eventData.city && eventData.showingTimes?.length > 0;
            case 3:
                return eventData.showingTimes && eventData.showingTimes.length > 0;
            default:
                return false;
        }
    };

    const handleNextStep = () => {
        if (!isStepValid()) return;
        if (currentStep < 3) setCurrentStep((prev) => prev + 1);
        else handleSave();
    };

    const handleSave = async () => {
        console.log("==== ĐÃ GỌI handleSave ====");
        try {
            // Nếu backend cần status thì gửi status
            const payload = {
                ...eventData,
                statusId: 1,
            };
            await apiClient.put(`/events/edit/${eventId}`, payload);
            toast.success("Đã lưu bản nháp!", {
                autoClose: 1500,
                onClose: () => navigate(`/organizer?status=${statusId}`),
            });
        } catch (err) {
            toast.error("Có lỗi khi lưu sự kiện!");
        }
    };


    const stepProps = {
        eventData,
        handleInputChange,
        categories,
        eventId,
        isEdit: true,
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <EventInfoStep {...stepProps} />;
            case 2: return <TimeTicketStep {...stepProps} />;
            case 3: return <SettingsStep {...stepProps} />;
            default: return null;
        }
    };

    if (!eventData) return <div className="text-center text-gray-400 py-10">Đang tải dữ liệu...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Chỉnh sửa sự kiện</h1>
                {/* Thêm ProgressSteps ở đây nếu muốn */}
                <div className="bg-gray-800 rounded-lg p-6 min-h-96 border border-gray-700">
                    {renderStepContent()}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleNextStep}
                        // disabled={!isStepValid()}    // <-- Comment hoặc xoá dòng này
                        className="px-6 py-2 rounded-md bg-green-600"
                    >
                        {currentStep < 3 ? "Tiếp tục" : "Lưu"}
                    </button>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default EditEventForm;
