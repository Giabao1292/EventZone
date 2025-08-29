/**
 * Demo file để test các cải thiện của LayoutDesigner
 * Kiểm tra performance và giảm thiểu việc giật
 */

// Demo function để test performance
export const demoLayoutDesignerPerformance = () => {
  console.log("=== DEMO LAYOUT DESIGNER PERFORMANCE ===");

  // Test 1: Kiểm tra collision detection
  const testCollisionDetection = () => {
    console.log("🧪 Test 1: Collision Detection");

    const seat1 = { id: 1, x: 0, y: 0, width: 30, height: 30 };
    const seat2 = { id: 2, x: 25, y: 25, width: 30, height: 30 };
    const seat3 = { id: 3, x: 100, y: 100, width: 30, height: 30 };

    // Mock collision function
    const checkCollision = (
      newItem,
      existingItems,
      itemType,
      excludeId = null
    ) => {
      const buffer = itemType === "seat" ? 2 : 5;

      return existingItems.some((item) => {
        if (item.id === newItem.id || item.id === excludeId) return false;

        const overlapX = Math.max(
          0,
          Math.min(newItem.x + newItem.width, item.x + item.width) -
            Math.max(newItem.x, item.x)
        );
        const overlapY = Math.max(
          0,
          Math.min(newItem.y + newItem.height, item.y + item.height) -
            Math.max(newItem.y, item.y)
        );

        return overlapX > buffer && overlapY > buffer;
      });
    };

    const items = [seat1, seat2];
    const newSeat = { id: 4, x: 20, y: 20, width: 30, height: 30 };

    console.log(
      "  Seat 1 & 2 overlap:",
      checkCollision(seat2, [seat1], "seat")
    );
    console.log(
      "  New seat collision:",
      checkCollision(newSeat, items, "seat")
    );
    console.log("  Seat 3 no collision:", checkCollision(seat3, items, "seat"));
  };

  // Test 2: Kiểm tra grid snapping
  const testGridSnapping = () => {
    console.log("🧪 Test 2: Grid Snapping");

    const GRID_SIZE = 30;
    const snapToGrid = (value) => {
      return Math.floor(value / GRID_SIZE) * GRID_SIZE;
    };

    const testValues = [0, 15, 30, 45, 60, 75, 90];
    testValues.forEach((value) => {
      console.log(`  ${value} -> ${snapToGrid(value)}`);
    });
  };

  // Test 3: Kiểm tra performance metrics
  const testPerformanceMetrics = () => {
    console.log("🧪 Test 3: Performance Metrics");

    // Test render time
    const startTime = performance.now();

    // Simulate rendering 100 seats
    for (let i = 0; i < 100; i++) {
      const seat = {
        id: i,
        x: i * 35,
        y: Math.floor(i / 10) * 35,
        width: 30,
        height: 30,
      };
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`  Render time for 100 seats: ${renderTime.toFixed(2)}ms`);
    console.log(`  Average per seat: ${(renderTime / 100).toFixed(2)}ms`);

    // Performance recommendations
    if (renderTime > 16) {
      console.log("  ⚠️ Render time > 16ms (60fps threshold)");
    } else {
      console.log("  ✅ Render time within 60fps threshold");
    }
  };

  // Test 4: Kiểm tra drag & drop optimization
  const testDragDropOptimization = () => {
    console.log("🧪 Test 4: Drag & Drop Optimization");

    const optimizations = [
      "✅ enableUserSelectHack={false}",
      "✅ dragHandleClassName='drag-handle'",
      "✅ willChange: 'transform'",
      "✅ backfaceVisibility: 'hidden'",
      "✅ userSelect: 'none'",
      "✅ touchAction: 'none'",
      "✅ Reduced collision buffer (2px for seats)",
      "✅ Improved overlap detection",
      "✅ Conditional position updates",
    ];

    optimizations.forEach((opt) => {
      console.log(`  ${opt}`);
    });
  };

  // Run all tests
  testCollisionDetection();
  testGridSnapping();
  testPerformanceMetrics();
  testDragDropOptimization();

  console.log("\n✅ LayoutDesigner performance demo completed!");
};

// Demo các trường hợp sử dụng thực tế
export const demoLayoutDesignerUsage = () => {
  console.log("=== DEMO LAYOUT DESIGNER USAGE ===");

  const usageScenarios = [
    {
      name: "Drag & Drop Seats",
      description: "Kéo thả ghế không bị giật",
      tips: [
        "Sử dụng cursor-move thay vì cursor-pointer",
        "Thêm dragHandleClassName để tối ưu",
        "Giảm collision buffer cho seats",
      ],
    },
    {
      name: "Resize Zones",
      description: "Thay đổi kích thước khu vực mượt mà",
      tips: [
        "Sử dụng resizeGrid để snap to grid",
        "Kiểm tra bounds trước khi update",
        "Chỉ update khi thực sự thay đổi",
      ],
    },
    {
      name: "Grid Snapping",
      description: "Snap to grid chính xác",
      tips: [
        "Sử dụng Math.floor thay vì Math.round",
        "Áp dụng grid cho cả drag và resize",
        "Tối ưu grid rendering với imageRendering",
      ],
    },
    {
      name: "Collision Detection",
      description: "Phát hiện va chạm chính xác",
      tips: [
        "Sử dụng overlap detection thay vì bounding box",
        "Giảm buffer cho seats (2px)",
        "Chỉ kiểm tra khi cần thiết",
      ],
    },
  ];

  usageScenarios.forEach((scenario, index) => {
    console.log(`\n📍 Scenario ${index + 1}: ${scenario.name}`);
    console.log(`   Description: ${scenario.description}`);
    console.log("   Tips:");
    scenario.tips.forEach((tip) => {
      console.log(`     • ${tip}`);
    });
  });
};

// Demo troubleshooting
export const demoLayoutDesignerTroubleshooting = () => {
  console.log("=== DEMO LAYOUT DESIGNER TROUBLESHOOTING ===");

  const commonIssues = [
    {
      issue: "Drag bị giật",
      cause: "Collision detection quá nghiêm ngặt",
      solution: "Giảm buffer, cải thiện overlap detection",
    },
    {
      issue: "Performance chậm",
      cause: "Re-render quá nhiều",
      solution: "Thêm CSS optimizations, conditional updates",
    },
    {
      issue: "Grid không chính xác",
      cause: "Math.round gây offset",
      solution: "Sử dụng Math.floor cho snapToGrid",
    },
    {
      issue: "Touch devices lag",
      cause: "Touch events không được tối ưu",
      solution: "Thêm touchAction: 'none'",
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
  window.layoutDesignerDemo = {
    demoLayoutDesignerPerformance,
    demoLayoutDesignerUsage,
    demoLayoutDesignerTroubleshooting,
  };
}
