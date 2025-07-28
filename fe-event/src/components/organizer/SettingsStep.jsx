import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SettingsStep = ({ eventData, eventId }) => {
  console.log(
    "eventId in SettingsStep:",
    eventId,
    "eventData.id:",
    eventData?.id
  ); // Debug
  const navigate = useNavigate();

  const handleEditLayout = (showingTime) => {
    const effectiveEventId = eventId || eventData?.id;
    if (!effectiveEventId) {
      console.error("No eventId available for navigation!");
      return;
    }
    navigate(`/organizer/layout-designer/${showingTime.id}`, {
      state: {
        layoutMode: showingTime.layoutMode,
        eventData,
        eventId: effectiveEventId,
        showingTimeId: showingTime.id,
        isEdit: true, // <-- Thêm dòng này để biết đang EDIT event
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
      </div>

      {eventData.showingTimes.map((st) => (
        <motion.div
          key={st.id}
          className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-xl p-6 flex justify-between items-center hover:shadow-lg transition duration-300"
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * st.id }}
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
              st.id
                ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600 shadow-lg shadow-blue-500/25"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            onClick={() => st.id && handleEditLayout(st)}
            disabled={!st.id}
            title={!st.id ? "Cần lưu sự kiện trước khi thiết kế chỗ ngồi" : ""}
          >
            Thiết kế chỗ ngồi
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

SettingsStep.propTypes = {
  eventData: PropTypes.shape({
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
