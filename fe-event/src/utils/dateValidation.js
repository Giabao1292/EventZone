/**
 * Date validation utilities for event management
 */

/**
 * Validates if a date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if date is in the future
 */
export const isFutureDate = (date) => {
  const dateToCheck = new Date(date);
  const now = new Date();
  return dateToCheck > now;
};

/**
 * Validates if start time is before end time
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {boolean} - True if start time is before end time
 */
export const isStartBeforeEnd = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return start < end;
};

/**
 * Validates minimum duration between start and end time
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @param {number} minDurationMinutes - Minimum duration in minutes (default: 30)
 * @returns {boolean} - True if duration meets minimum requirement
 */
export const hasMinimumDuration = (
  startTime,
  endTime,
  minDurationMinutes = 30
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end - start;
  const minDuration = minDurationMinutes * 60 * 1000; // Convert to milliseconds
  return duration >= minDuration;
};

/**
 * Calculates duration between two times in hours and minutes
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {Object} - Duration object with hours and minutes
 */
export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, totalMinutes: Math.floor(durationMs / (1000 * 60)) };
};

/**
 * Formats duration for display
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (startTime, endTime) => {
  const { hours, minutes } = calculateDuration(startTime, endTime);

  if (hours > 0 && minutes > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else if (hours > 0) {
    return `${hours} giờ`;
  } else if (minutes > 0) {
    return `${minutes} phút`;
  } else {
    return "0 phút";
  }
};

/**
 * Validates if event duration is reasonable (minimum 30 minutes, maximum 24 hours)
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {Object} - Validation result with isValid boolean and message
 */
export const validateEventDuration = (startTime, endTime) => {
  const { totalMinutes } = calculateDuration(startTime, endTime);
  const minMinutes = 30;
  const maxMinutes = 24 * 60; // 24 hours

  if (totalMinutes < minMinutes) {
    return {
      isValid: false,
      message: `Sự kiện phải kéo dài ít nhất ${minMinutes} phút`,
    };
  }

  if (totalMinutes > maxMinutes) {
    return {
      isValid: false,
      message: `Sự kiện không được kéo dài quá 24 giờ`,
    };
  }

  return {
    isValid: true,
    message: `Thời lượng: ${formatDuration(startTime, endTime)}`,
  };
};

/**
 * Validates if sale time is before event start time
 * @param {string|Date} saleTime - Sale time (open or close)
 * @param {string|Date} eventStartTime - Event start time
 * @returns {boolean} - True if sale time is before or equal to event start time
 */
export const isSaleBeforeEvent = (saleTime, eventStartTime) => {
  const sale = new Date(saleTime);
  const eventStart = new Date(eventStartTime);
  return sale <= eventStart;
};

/**
 * Validates if sale open time is before sale close time
 * @param {string|Date} saleOpenTime - Sale open time
 * @param {string|Date} saleCloseTime - Sale close time
 * @returns {boolean} - True if open time is before close time
 */
export const isSaleOpenBeforeClose = (saleOpenTime, saleCloseTime) => {
  const open = new Date(saleOpenTime);
  const close = new Date(saleCloseTime);
  return open < close;
};

/**
 * Comprehensive sale time validation
 * @param {Object} saleData - Sale time data {saleOpenTime, saleCloseTime, eventStartTime}
 * @returns {Object} - Validation result with isValid boolean and errors object
 */
export const validateSaleTimes = (saleData) => {
  const errors = {};
  const { saleOpenTime, saleCloseTime, eventStartTime } = saleData;

  // Required fields
  if (!saleOpenTime) errors.saleOpenTime = "Thời gian mở bán là bắt buộc";
  if (!saleCloseTime) errors.saleCloseTime = "Thời gian đóng bán là bắt buộc";

  if (saleOpenTime && saleCloseTime) {
    // Check if open time is before close time
    if (!isSaleOpenBeforeClose(saleOpenTime, saleCloseTime)) {
      errors.saleCloseTime = "Thời gian đóng bán phải sau thời gian mở bán";
    }
  }

  if (eventStartTime) {
    // Check if sale open time is before or equal to event start
    if (saleOpenTime && !isSaleBeforeEvent(saleOpenTime, eventStartTime)) {
      errors.saleOpenTime =
        "Thời gian mở bán phải trước hoặc bằng thời gian bắt đầu";
    }

    // Check if sale close time is before or equal to event start
    if (saleCloseTime && !isSaleBeforeEvent(saleCloseTime, eventStartTime)) {
      errors.saleCloseTime =
        "Thời gian đóng bán phải trước hoặc bằng thời gian bắt đầu";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Checks for overlapping time periods
 * @param {Object} newPeriod - New time period {startTime, endTime}
 * @param {Array} existingPeriods - Array of existing time periods
 * @returns {boolean} - True if there's overlap
 */
export const hasTimeOverlap = (newPeriod, existingPeriods) => {
  const newStart = new Date(newPeriod.startTime);
  const newEnd = new Date(newPeriod.endTime);

  return existingPeriods.some((period) => {
    const existingStart = new Date(period.startTime);
    const existingEnd = new Date(period.endTime);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

/**
 * Comprehensive event time validation
 * @param {Object} eventData - Event data with startTime and endTime
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateEventTimes = (eventData) => {
  const errors = [];
  const { startTime, endTime } = eventData;

  // Required fields
  if (!startTime) errors.push("Thời gian bắt đầu là bắt buộc");
  if (!endTime) errors.push("Thời gian kết thúc là bắt buộc");

  if (startTime && endTime) {
    // Future date validation
    if (!isFutureDate(startTime)) {
      errors.push("Thời gian bắt đầu không thể trong quá khứ");
    }
    if (!isFutureDate(endTime)) {
      errors.push("Thời gian kết thúc không thể trong quá khứ");
    }

    // Logic validation
    if (!isStartBeforeEnd(startTime, endTime)) {
      errors.push("Thời gian kết thúc phải sau thời gian bắt đầu");
    }

    // Duration validation with detailed feedback
    const durationValidation = validateEventDuration(startTime, endTime);
    if (!durationValidation.isValid) {
      errors.push(durationValidation.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Comprehensive showing time validation
 * @param {Object} showingTime - Showing time data
 * @param {Array} existingShowingTimes - Existing showing times for overlap check
 * @returns {Object} - Validation result with isValid boolean and errors object
 */
export const validateShowingTime = (showingTime, existingShowingTimes = []) => {
  const errors = {};
  const { startTime, endTime, saleOpenTime, saleCloseTime, layoutMode } =
    showingTime;

  // Required field validation
  if (!startTime) errors.startTime = "Thời gian bắt đầu là bắt buộc";
  if (!endTime) errors.endTime = "Thời gian kết thúc là bắt buộc";
  if (!saleOpenTime) errors.saleOpenTime = "Thời gian mở bán là bắt buộc";
  if (!saleCloseTime) errors.saleCloseTime = "Thời gian đóng bán là bắt buộc";
  if (!layoutMode) errors.layoutMode = "Chế độ layout là bắt buộc";

  // Time logic validation
  if (startTime && endTime) {
    if (!isFutureDate(startTime)) {
      errors.startTime = "Thời gian bắt đầu không thể trong quá khứ";
    }
    if (!isFutureDate(endTime)) {
      errors.endTime = "Thời gian kết thúc không thể trong quá khứ";
    }
    if (!isStartBeforeEnd(startTime, endTime)) {
      errors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }

    // Duration validation with detailed feedback
    const durationValidation = validateEventDuration(startTime, endTime);
    if (!durationValidation.isValid) {
      errors.endTime = durationValidation.message;
    }
  }

  // Sale time validation
  if (saleOpenTime && saleCloseTime) {
    if (!isSaleOpenBeforeClose(saleOpenTime, saleCloseTime)) {
      errors.saleCloseTime = "Thời gian đóng bán phải sau thời gian mở bán";
    }
  }

  if (startTime && saleOpenTime) {
    if (!isSaleBeforeEvent(saleOpenTime, startTime)) {
      errors.saleOpenTime =
        "Thời gian mở bán phải trước hoặc bằng thời gian bắt đầu";
    }
  }

  if (startTime && saleCloseTime) {
    if (!isSaleBeforeEvent(saleCloseTime, startTime)) {
      errors.saleCloseTime =
        "Thời gian đóng bán phải trước hoặc bằng thời gian bắt đầu";
    }
  }

  // Overlap validation
  if (startTime && endTime && existingShowingTimes.length > 0) {
    if (hasTimeOverlap({ startTime, endTime }, existingShowingTimes)) {
      errors.startTime = "Xuất chiếu bị trùng với lịch đã có";
      errors.endTime = "Xuất chiếu bị trùng với lịch đã có";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Gets minimum datetime string for HTML datetime-local input
 * @returns {string} - ISO datetime string for current time
 */
export const getMinDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Formats date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
