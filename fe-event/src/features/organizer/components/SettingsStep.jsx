import React from "react";

const SettingsStep = ({ eventData, handleInputChange, loading }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Địa điểm tổ chức
        </label>
        <input
          type="text"
          value={eventData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Nhập địa điểm tổ chức"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Loại sơ đồ chỗ ngồi
        </label>
        <select
          value={eventData.seating_layout}
          onChange={(e) => handleInputChange("seating_layout", e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="general">Chỗ ngồi tự do</option>
          <option value="assigned">Chỗ ngồi cố định</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsStep;
