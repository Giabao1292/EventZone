import { Calendar, Clock, Users } from "lucide-react";

const TimeTicketStep = ({ eventData, handleInputChange, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="text-blue-400" size={20} />
        <h3 className="text-lg font-medium text-gray-200">
          Thời gian & Loại vé
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="inline mr-2" size={16} />
            Thời gian bắt đầu *
          </label>
          <input
            type="datetime-local"
            value={eventData.start_time}
            onChange={(e) => handleInputChange("start_time", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="inline mr-2" size={16} />
            Thời gian kết thúc *
          </label>
          <input
            type="datetime-local"
            value={eventData.end_time}
            onChange={(e) => handleInputChange("end_time", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Users className="inline mr-2" size={16} />
          Số lượng khách tối đa
        </label>
        <input
          type="number"
          value={eventData.max_capacity}
          onChange={(e) => handleInputChange("max_capacity", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
          placeholder="Nhập số lượng khách tối đa"
          min="1"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Để trống nếu không giới hạn số lượng khách
        </p>
      </div>

      {/* Preview thông tin đã nhập */}
      {eventData.start_time && eventData.end_time && (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h4 className="font-medium text-gray-200 mb-2">
            Xem trước thời gian
          </h4>
          <div className="space-y-1 text-sm text-gray-300">
            <p>
              <span className="font-medium">Bắt đầu:</span>{" "}
              {new Date(eventData.start_time).toLocaleString("vi-VN")}
            </p>
            <p>
              <span className="font-medium">Kết thúc:</span>{" "}
              {new Date(eventData.end_time).toLocaleString("vi-VN")}
            </p>
            <p>
              <span className="font-medium">Thời lượng:</span>{" "}
              {(() => {
                const start = new Date(eventData.start_time);
                const end = new Date(eventData.end_time);
                const diff = end - start;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor(
                  (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                return `${hours} giờ ${minutes} phút`;
              })()}
            </p>
            {eventData.max_capacity && (
              <p>
                <span className="font-medium">Sức chứa:</span>{" "}
                {parseInt(eventData.max_capacity).toLocaleString()} người
              </p>
            )}
          </div>
        </div>
      )}

      {/* Validation warnings */}
      {eventData.start_time &&
        eventData.end_time &&
        new Date(eventData.start_time) >= new Date(eventData.end_time) && (
          <div className="bg-red-900/20 border border-red-600 p-3 rounded-lg">
            <p className="text-red-400 text-sm">
              ⚠️ Thời gian kết thúc phải sau thời gian bắt đầu
            </p>
          </div>
        )}

      {eventData.start_time && new Date(eventData.start_time) < new Date() && (
        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Thời gian bắt đầu đã qua. Bạn có chắc chắn muốn tạo sự kiện trong
            quá khứ?
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeTicketStep;
