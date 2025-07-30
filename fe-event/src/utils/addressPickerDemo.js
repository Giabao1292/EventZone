/**
 * Demo file để test AddressPicker component
 * Kiểm tra việc load 63 tỉnh thành từ API
 */

// Demo function để test AddressPicker
export const demoAddressPicker = () => {
  console.log("=== DEMO ADDRESS PICKER ===");

  // Test API provinces
  const testProvincesAPI = async () => {
    try {
      const response = await fetch(
        "https://provinces.open-api.vn/api/?depth=1"
      );
      const provinces = await response.json();

      console.log("✅ API Provinces loaded successfully!");
      console.log(`📊 Total provinces: ${provinces.length}`);
      console.log("🏙️ Sample provinces:");
      provinces.slice(0, 5).forEach((province, index) => {
        console.log(
          `  ${index + 1}. ${province.name} (Code: ${province.code})`
        );
      });

      // Kiểm tra có đủ 63 tỉnh thành không
      if (provinces.length >= 63) {
        console.log("✅ Đủ 63 tỉnh thành Việt Nam!");
      } else {
        console.log(`⚠️ Thiếu ${63 - provinces.length} tỉnh thành`);
      }

      return provinces;
    } catch (error) {
      console.error("❌ Failed to load provinces:", error);
      return [];
    }
  };

  // Test districts cho một tỉnh
  const testDistrictsAPI = async (provinceCode) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();

      console.log(`✅ Districts for province ${provinceCode} loaded!`);
      console.log(`📊 Total districts: ${data.districts.length}`);
      console.log("🏘️ Sample districts:");
      data.districts.slice(0, 3).forEach((district, index) => {
        console.log(
          `  ${index + 1}. ${district.name} (Code: ${district.code})`
        );
      });

      return data.districts;
    } catch (error) {
      console.error("❌ Failed to load districts:", error);
      return [];
    }
  };

  // Test wards cho một quận/huyện
  const testWardsAPI = async (districtCode) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();

      console.log(`✅ Wards for district ${districtCode} loaded!`);
      console.log(`📊 Total wards: ${data.wards.length}`);
      console.log("🏠 Sample wards:");
      data.wards.slice(0, 3).forEach((ward, index) => {
        console.log(`  ${index + 1}. ${ward.name} (Code: ${ward.code})`);
      });

      return data.wards;
    } catch (error) {
      console.error("❌ Failed to load wards:", error);
      return [];
    }
  };

  // Chạy test
  const runTests = async () => {
    console.log("🚀 Starting AddressPicker tests...");

    // Test 1: Load provinces
    const provinces = await testProvincesAPI();

    if (provinces.length > 0) {
      // Test 2: Load districts cho tỉnh đầu tiên
      const firstProvince = provinces[0];
      console.log(`\n📍 Testing districts for: ${firstProvince.name}`);
      const districts = await testDistrictsAPI(firstProvince.code);

      if (districts.length > 0) {
        // Test 3: Load wards cho quận/huyện đầu tiên
        const firstDistrict = districts[0];
        console.log(`\n🏘️ Testing wards for: ${firstDistrict.name}`);
        await testWardsAPI(firstDistrict.code);
      }
    }

    console.log("\n✅ AddressPicker demo completed!");
  };

  runTests();
};

// Demo các trường hợp sử dụng AddressPicker
export const demoAddressPickerUsage = () => {
  console.log("=== DEMO ADDRESS PICKER USAGE ===");

  const testCases = [
    {
      name: "Hà Nội - Quận Ba Đình",
      provinceCode: "01",
      districtCode: "001",
      expectedProvince: "Thành phố Hà Nội",
      expectedDistrict: "Quận Ba Đình",
    },
    {
      name: "TP. Hồ Chí Minh - Quận 1",
      provinceCode: "79",
      districtCode: "760",
      expectedProvince: "Thành phố Hồ Chí Minh",
      expectedDistrict: "Quận 1",
    },
    {
      name: "Đà Nẵng - Quận Hải Châu",
      provinceCode: "48",
      districtCode: "492",
      expectedProvince: "Thành phố Đà Nẵng",
      expectedDistrict: "Quận Hải Châu",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n📍 Test ${index + 1}: ${testCase.name}`);
    console.log(`   Province Code: ${testCase.provinceCode}`);
    console.log(`   District Code: ${testCase.districtCode}`);
    console.log(
      `   Expected: ${testCase.expectedProvince} - ${testCase.expectedDistrict}`
    );
  });
};

// Export để sử dụng trong console browser
if (typeof window !== "undefined") {
  window.addressPickerDemo = {
    demoAddressPicker,
    demoAddressPickerUsage,
  };
}
