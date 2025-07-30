/**
 * Demo file để test các cải thiện của BankAccountManagement
 * Kiểm tra logic chỉ cho phép 1 tài khoản ngân hàng
 */

// Demo function để test logic 1 tài khoản
export const demoBankAccountLogic = () => {
  console.log("=== DEMO BANK ACCOUNT MANAGEMENT ===");

  // Test 1: Kiểm tra logic thêm tài khoản
  const testAddBankLogic = () => {
    console.log("🧪 Test 1: Add Bank Logic");

    const scenarios = [
      {
        name: "Chưa có tài khoản",
        bankAccounts: [],
        canAdd: true,
        expected: "✅ Có thể thêm tài khoản",
      },
      {
        name: "Đã có 1 tài khoản",
        bankAccounts: [{ id: 1, bankName: "VIETCOMBANK" }],
        canAdd: false,
        expected: "❌ Không thể thêm tài khoản khác",
      },
    ];

    scenarios.forEach((scenario) => {
      console.log(`\n📍 ${scenario.name}:`);
      console.log(`   Bank accounts: ${scenario.bankAccounts.length}`);
      console.log(`   Can add: ${scenario.canAdd}`);
      console.log(`   Expected: ${scenario.expected}`);
    });
  };

  // Test 2: Kiểm tra UI states
  const testUIStates = () => {
    console.log("🧪 Test 2: UI States");

    const uiStates = [
      {
        state: "No Bank Account",
        button: "Thêm Tài Khoản Ngân Hàng",
        message: "Bạn chưa có tài khoản ngân hàng nào",
        note: "💡 Lưu ý: Chỉ được phép thêm 1 tài khoản ngân hàng duy nhất",
      },
      {
        state: "Has Bank Account",
        badge: "✅ Đã có tài khoản ngân hàng",
        message: "Chỉ được phép thêm 1 tài khoản",
        info: "Bạn đã có 1 tài khoản ngân hàng. Tài khoản này sẽ được sử dụng để nhận thanh toán từ các sự kiện.",
      },
    ];

    uiStates.forEach((uiState) => {
      console.log(`\n📍 ${uiState.state}:`);
      if (uiState.button) console.log(`   Button: "${uiState.button}"`);
      if (uiState.badge) console.log(`   Badge: "${uiState.badge}"`);
      if (uiState.message) console.log(`   Message: "${uiState.message}"`);
      if (uiState.note) console.log(`   Note: "${uiState.note}"`);
      if (uiState.info) console.log(`   Info: "${uiState.info}"`);
    });
  };

  // Test 3: Kiểm tra validation
  const testValidation = () => {
    console.log("🧪 Test 3: Validation Rules");

    const validations = [
      {
        rule: "Kiểm tra đã có tài khoản",
        condition: "bankAccounts.length > 0",
        action: "Hiển thị thông báo lỗi",
        message:
          "Bạn đã có tài khoản ngân hàng. Chỉ được phép 1 tài khoản duy nhất.",
      },
      {
        rule: "Kiểm tra thông tin bắt buộc",
        condition: "!bankName || !accountNumber || !holderName",
        action: "Hiển thị thông báo lỗi",
        message: "Vui lòng điền đầy đủ thông tin",
      },
      {
        rule: "Ẩn nút xóa",
        condition: "Luôn luôn",
        action: "Thay thế bằng text",
        message: "🔒 Không thể xóa tài khoản",
      },
    ];

    validations.forEach((validation) => {
      console.log(`\n📍 ${validation.rule}:`);
      console.log(`   Condition: ${validation.condition}`);
      console.log(`   Action: ${validation.action}`);
      console.log(`   Message: "${validation.message}"`);
    });
  };

  // Test 4: Kiểm tra thông báo
  const testNotifications = () => {
    console.log("🧪 Test 4: Notifications");

    const notifications = [
      {
        type: "Success Add",
        title: "✅ Thành công",
        message:
          "Đã thêm tài khoản ngân hàng thành công. Bạn không thể thêm tài khoản khác.",
        variant: "default",
      },
      {
        type: "Error Already Has",
        title: "❌ Không thể thêm",
        message:
          "Bạn đã có tài khoản ngân hàng. Chỉ được phép 1 tài khoản duy nhất.",
        variant: "destructive",
      },
      {
        type: "Error Missing Info",
        title: "Lỗi",
        message: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      },
    ];

    notifications.forEach((notification) => {
      console.log(`\n📍 ${notification.type}:`);
      console.log(`   Title: "${notification.title}"`);
      console.log(`   Message: "${notification.message}"`);
      console.log(`   Variant: ${notification.variant}`);
    });
  };

  // Run all tests
  testAddBankLogic();
  testUIStates();
  testValidation();
  testNotifications();

  console.log("\n✅ Bank account management demo completed!");
};

// Demo các trường hợp sử dụng thực tế
export const demoBankAccountUsage = () => {
  console.log("=== DEMO BANK ACCOUNT USAGE ===");

  const usageScenarios = [
    {
      name: "Thêm tài khoản lần đầu",
      description: "Organizer thêm tài khoản ngân hàng đầu tiên",
      steps: [
        "Vào trang quản lý tài khoản ngân hàng",
        "Nhấn nút 'Thêm Tài Khoản Ngân Hàng'",
        "Điền thông tin: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản",
        "Nhấn 'Thêm Tài Khoản'",
        "Nhận thông báo thành công",
      ],
    },
    {
      name: "Xem tài khoản đã có",
      description: "Organizer xem tài khoản đã thêm",
      steps: [
        "Vào trang quản lý tài khoản ngân hàng",
        "Thấy badge '✅ Đã có tài khoản ngân hàng'",
        "Xem thông tin tài khoản hiển thị",
        "Thấy text '🔒 Không thể xóa tài khoản'",
        "Có thể thiết lập làm tài khoản mặc định",
      ],
    },
    {
      name: "Cố gắng thêm tài khoản thứ 2",
      description: "Organizer cố gắng thêm tài khoản khi đã có",
      steps: [
        "Vào trang quản lý tài khoản ngân hàng",
        "Thấy nút thêm đã bị ẩn",
        "Nếu cố gắng thêm qua API",
        "Nhận thông báo lỗi",
        "Hiểu rằng chỉ được 1 tài khoản",
      ],
    },
  ];

  usageScenarios.forEach((scenario, index) => {
    console.log(`\n📍 Scenario ${index + 1}: ${scenario.name}`);
    console.log(`   Description: ${scenario.description}`);
    console.log("   Steps:");
    scenario.steps.forEach((step, stepIndex) => {
      console.log(`     ${stepIndex + 1}. ${step}`);
    });
  });
};

// Demo troubleshooting
export const demoBankAccountTroubleshooting = () => {
  console.log("=== DEMO BANK ACCOUNT TROUBLESHOOTING ===");

  const commonIssues = [
    {
      issue: "Không thể thêm tài khoản",
      cause: "Đã có tài khoản ngân hàng trước đó",
      solution:
        "Chỉ được phép 1 tài khoản duy nhất. Liên hệ admin nếu cần thay đổi.",
    },
    {
      issue: "Nút thêm bị ẩn",
      cause: "Đã có tài khoản ngân hàng",
      solution: "Đây là tính năng bảo vệ. Chỉ được phép 1 tài khoản.",
    },
    {
      issue: "Không thể xóa tài khoản",
      cause: "Tính năng xóa đã bị vô hiệu hóa",
      solution: "Liên hệ admin nếu cần thay đổi tài khoản ngân hàng.",
    },
    {
      issue: "Thông tin tài khoản sai",
      cause: "Nhập sai thông tin khi thêm",
      solution: "Liên hệ admin để cập nhật thông tin tài khoản.",
    },
  ];

  commonIssues.forEach((item, index) => {
    console.log(`\n🔧 Issue ${index + 1}: ${item.issue}`);
    console.log(`   Cause: ${item.cause}`);
    console.log(`   Solution: ${item.solution}`);
  });
};

// Export để sử dụng trong console browser
if (typeof window !== "undefined") {
  window.bankAccountDemo = {
    demoBankAccountLogic,
    demoBankAccountUsage,
    demoBankAccountTroubleshooting,
  };
}
