import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SettingsStep = ({ eventData, eventId }) => {
  console.log(" eventId: setting", eventId);
  const navigate = useNavigate();
  const handleEditLayout = (showingTime) => {
    navigate(`/organizer/layout-designer/${showingTime.id}`, {
      state: { layoutMode: showingTime.layoutMode, eventData, eventId },
    });
  };
  if (!eventData?.showingTimes?.length) {
    return (
      <motion.div
        className="text-gray-400 text-center py-10"
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
      <h2 className="text-xl font-semibold text-white">
        Thiết kế chỗ ngồi cho các suất chiếu
      </h2>
      {eventData.showingTimes.map((st) => (
        <motion.div
          key={st.id}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:shadow-lg transition duration-300"
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * st.id }}
        >
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Xuất chiếu:</span>{" "}
              {new Date(st.startTime).toLocaleString("vi-VN")}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-medium text-white">Layout hiện tại:</span>{" "}
              {st.layoutMode}
            </p>
          </div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => handleEditLayout(st)}
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
