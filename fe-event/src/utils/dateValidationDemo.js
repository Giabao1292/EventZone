/**
 * Demo file để test các tính năng validation ngày tháng mới
 * Sử dụng để kiểm tra các hàm validation
 */

import {
  calculateDuration,
  formatDuration,
  validateEventDuration,
  isFutureDate,
  isStartBeforeEnd,
  hasTimeOverlap,
  validateSaleTimes,
} from "./dateValidation";

// Demo các trường hợp validation
export const demoValidation = () => {
  console.log("=== DEMO DATE VALIDATION ===");

  // Test 1: Tính thời lượng
  const start1 = "2024-01-15T10:00:00";
  const end1 = "2024-01-15T12:30:00";
  console.log("Test 1 - Tính thời lượng:");
  console.log("Start:", start1);
  console.log("End:", end1);
  console.log("Duration:", calculateDuration(start1, end1));
  console.log("Formatted:", formatDuration(start1, end1));
  console.log("---");

  // Test 2: Validation thời lượng
  const start2 = "2024-01-15T10:00:00";
  const end2 = "2024-01-15T10:15:00"; // 15 phút - quá ngắn
  console.log("Test 2 - Validation thời lượng ngắn:");
  console.log("Result:", validateEventDuration(start2, end2));
  console.log("---");

  // Test 3: Validation thời lượng dài
  const start3 = "2024-01-15T10:00:00";
  const end3 = "2024-01-16T12:00:00"; // 26 giờ - quá dài
  console.log("Test 3 - Validation thời lượng dài:");
  console.log("Result:", validateEventDuration(start3, end3));
  console.log("---");

  // Test 4: Validation thời lượng hợp lệ
  const start4 = "2024-01-15T10:00:00";
  const end4 = "2024-01-15T12:00:00"; // 2 giờ - hợp lệ
  console.log("Test 4 - Validation thời lượng hợp lệ:");
  console.log("Result:", validateEventDuration(start4, end4));
  console.log("---");

  // Test 5: Kiểm tra thời gian tương lai
  const now = new Date();
  const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 ngày sau
  const past = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 ngày trước

  console.log("Test 5 - Kiểm tra thời gian:");
  console.log("Future date:", isFutureDate(future));
  console.log("Past date:", isFutureDate(past));
  console.log("---");

  // Test 6: Kiểm tra logic start/end
  console.log("Test 6 - Logic start/end:");
  console.log("Valid order:", isStartBeforeEnd(start1, end1));
  console.log("Invalid order:", isStartBeforeEnd(end1, start1));
  console.log("---");

  // Test 7: Kiểm tra trùng lịch
  const existingPeriods = [
    { startTime: "2024-01-15T09:00:00", endTime: "2024-01-15T11:00:00" },
    { startTime: "2024-01-15T14:00:00", endTime: "2024-01-15T16:00:00" },
  ];

  const newPeriod1 = {
    startTime: "2024-01-15T10:30:00",
    endTime: "2024-01-15T11:30:00",
  }; // Trùng
  const newPeriod2 = {
    startTime: "2024-01-15T12:00:00",
    endTime: "2024-01-15T13:00:00",
  }; // Không trùng

  console.log("Test 7 - Kiểm tra trùng lịch:");
  console.log("Overlap 1:", hasTimeOverlap(newPeriod1, existingPeriods));
  console.log("Overlap 2:", hasTimeOverlap(newPeriod2, existingPeriods));
  console.log("---");
};

// Demo các trường hợp thời lượng khác nhau
export const demoDurationFormats = () => {
  console.log("=== DEMO DURATION FORMATS ===");

  const testCases = [
    {
      start: "2024-01-15T10:00:00",
      end: "2024-01-15T10:30:00",
      desc: "30 phút",
    },
    { start: "2024-01-15T10:00:00", end: "2024-01-15T11:00:00", desc: "1 giờ" },
    {
      start: "2024-01-15T10:00:00",
      end: "2024-01-15T12:30:00",
      desc: "2 giờ 30 phút",
    },
    {
      start: "2024-01-15T10:00:00",
      end: "2024-01-15T10:15:00",
      desc: "15 phút",
    },
    {
      start: "2024-01-15T10:00:00",
      end: "2024-01-15T22:00:00",
      desc: "12 giờ",
    },
  ];

  testCases.forEach((test, index) => {
    console.log(`Test ${index + 1} - ${test.desc}:`);
    console.log("  Duration:", calculateDuration(test.start, test.end));
    console.log("  Formatted:", formatDuration(test.start, test.end));
    console.log("  Validation:", validateEventDuration(test.start, test.end));
    console.log("");
  });
};

// Demo validation cho event creation
export const demoEventValidation = () => {
  console.log("=== DEMO EVENT VALIDATION ===");

  const eventData = {
    startTime: "2024-01-15T10:00:00",
    endTime: "2024-01-15T12:00:00",
  };

  console.log("Event data:", eventData);
  console.log(
    "Duration validation:",
    validateEventDuration(eventData.startTime, eventData.endTime)
  );
  console.log(
    "Formatted duration:",
    formatDuration(eventData.startTime, eventData.endTime)
  );
};

// Demo validation cho sale times
export const demoSaleTimeValidation = () => {
  console.log("=== DEMO SALE TIME VALIDATION ===");

  // Test case từ user - có lỗi
  const problematicCase = {
    saleOpenTime: "2025-07-30T20:27:00", // 20:27 30/07/2025
    saleCloseTime: "2025-07-30T23:28:00", // 23:28 30/07/2025
    eventStartTime: "2025-07-30T22:27:00", // 22:27 30/07/2025
  };

  console.log("Problematic case:", problematicCase);
  console.log("Sale time validation:", validateSaleTimes(problematicCase));

  // Test case hợp lệ
  const validCase = {
    saleOpenTime: "2025-07-30T18:00:00", // 18:00 30/07/2025
    saleCloseTime: "2025-07-30T22:00:00", // 22:00 30/07/2025
    eventStartTime: "2025-07-30T22:27:00", // 22:27 30/07/2025
  };

  console.log("Valid case:", validCase);
  console.log("Sale time validation:", validateSaleTimes(validCase));
};

// Chạy tất cả demo
export const runAllDemos = () => {
  demoValidation();
  demoDurationFormats();
  demoEventValidation();
  demoSaleTimeValidation();
};

// Export để sử dụng trong console browser
if (typeof window !== "undefined") {
  window.dateValidationDemo = {
    demoValidation,
    demoDurationFormats,
    demoEventValidation,
    demoSaleTimeValidation,
    runAllDemos,
  };
}
