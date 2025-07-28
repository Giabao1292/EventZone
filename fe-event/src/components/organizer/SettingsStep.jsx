import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const SettingsStep = ({ eventData, eventId }) => {
  console.log(
    "eventId in SettingsStep:",
    eventId,
    "eventData.id:",
    eventData?.id
  ); // Debug
  const navigate = useNavigate();

  const handleEditLayout = (showingTime, index) => {
    console.log("handleEditLayout called with:", showingTime);
    console.log("showingTime.id:", showingTime.id);
    console.log("showingTime.startTime:", showingTime.startTime);
    console.log("index:", index);

    const effectiveEventId = eventId || eventData?.id;
    console.log("eventId:", eventId);
    console.log("effectiveEventId:", effectiveEventId);

    if (!effectiveEventId) {
      console.error("No eventId available for navigation!");
      return;
    }

    // Nếu không có id, có thể là showing time mới chưa được lưu
    if (!showingTime.id) {
      toast.error("Vui lòng lưu sự kiện trước khi thiết kế chỗ ngồi!");
      console.log("Showing time chưa có ID, cần lưu trước:", showingTime);
      console.log("Hãy bấm 'Tiếp theo' để lưu sự kiện trước!");
      return;
    }

    // Sử dụng index nếu showingTime.id trùng với eventId
    console.log("showingTime.id type:", typeof showingTime.id);
    console.log("eventId type:", typeof eventId);
    console.log("showingTime.id === eventId:", showingTime.id === eventId);

    const showingTimeId =
      showingTime.id === eventId ? `index_${index}` : showingTime.id;

    console.log("Final showingTimeId:", showingTimeId);
    console.log(
      "Navigating to:",
      `/organizer/layout-designer/${showingTimeId}`
    );
    navigate(`/organizer/layout-designer/${showingTimeId}`, {
      state: {
        layoutMode: showingTime.layoutMode || "both",
        eventData,
        eventId: effectiveEventId,
        showingTimeId: showingTime.id,
        isEdit: false, // Không phải edit mode khi đang tạo sự kiện mới
        hasDesignedLayout: showingTime.hasDesignedLayout || false,
      },
    });
  };

  if (!eventData?.showingTimes?.length) {
    return (
      <motion.div
        className="text-slate-500 text-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Không có suất chiếu nào được tạo. Vui lòng quay lại bước trước.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
          Thiết kế chỗ ngồi
        </h2>
        <p className="text-slate-600">
          Thiết kế layout chỗ ngồi cho từng xuất chiếu
        </p>

        {/* Warning message nếu có showing times chưa thiết kế */}
        {eventData.showingTimes &&
          eventData.showingTimes.some((st) => !st.hasDesignedLayout) && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-orange-700">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Bạn cần thiết kế layout cho TẤT CẢ xuất chiếu trước khi gửi
                    lên phê duyệt!
                  </span>
                </div>

                {/* Danh sách showing times chưa thiết kế */}
                <div className="text-sm">
                  <p className="font-medium mb-1">
                    Các xuất chiếu chưa thiết kế:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {eventData.showingTimes
                      .filter((st) => !st.hasDesignedLayout)
                      .map((st, index) => (
                        <li key={st.id || index}>
                          Xuất chiếu {index + 1}:{" "}
                          {new Date(st.startTime).toLocaleString("vi-VN")}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
      </div>

      {eventData.showingTimes.map((st, index) => {
        console.log("ShowingTime in map:", st);
        console.log("ShowingTime ID:", st.id);
        console.log("ShowingTime startTime:", st.startTime);
        console.log("ShowingTime address:", st.address);
        console.log("Button disabled:", !st.id);
        console.log("Index:", index);

        return (
          <motion.div
            key={st.id || index}
            className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-xl p-6 flex justify-between items-center hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (st.id || 1) }}
          >
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">
                <span className="font-medium text-slate-700">Xuất chiếu:</span>{" "}
                {new Date(st.startTime).toLocaleString("vi-VN")}
              </p>
              <p className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">
                  Layout hiện tại:
                </span>{" "}
                {st.layoutMode === "seat"
                  ? "Ghế"
                  : st.layoutMode === "zone"
                  ? "Khu vực"
                  : "Cả hai"}
              </p>
            </div>
            <button
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                !st.id
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : st.hasDesignedLayout
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg shadow-green-500/25"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25"
              }`}
              onClick={() => handleEditLayout(st, index)}
              disabled={!st.id}
              title={
                !st.id
                  ? "Vui lòng lưu sự kiện trước khi thiết kế chỗ ngồi"
                  : st.hasDesignedLayout
                  ? "Chỉnh sửa layout đã thiết kế"
                  : "Thiết kế layout mới"
              }
            >
              {!st.id
                ? "Chưa lưu"
                : st.hasDesignedLayout
                ? "Chỉnh sửa chỗ ngồi"
                : "Thiết kế chỗ ngồi"}
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

SettingsStep.propTypes = {
  eventData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showingTimes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        startTime: PropTypes.string.isRequired,
        layoutMode: PropTypes.string.isRequired,
      })
    ),
  }),
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SettingsStep;
