// src/components/dashboard/ProfitExpensesChart.jsx
import React, { useState } from "react";
import Chart from "react-apexcharts"; // Import Chart từ react-apexcharts
import { MoreVertical } from "lucide-react"; // Cho icon ba chấm

const ProfitExpensesChart = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cấu hình biểu đồ từ dashboard.js
  const chartOptions = {
    series: [
      {
        name: "Pixel ",
        data: [9, 5, 3, 7, 5, 10, 3],
      },
      {
        name: "Ample ",
        data: [6, 3, 9, 5, 4, 6, 4],
      },
    ],
    chart: {
      fontFamily: "Poppins,sans-serif",
      type: "bar",
      height: 370,
      offsetY: 10,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,.1)",
    },
    colors: ["#1e88e5", "#21c1d6"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        endingShape: "flat",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#0085db", "#fb977d"], // Thay đổi màu sắc theo ảnh nếu khác (ban đầu có thể là `colors` bên trên)
    },
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 767,
        options: {
          stroke: {
            show: false,
            width: 5,
            colors: ["transparent"],
          },
        },
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex justify-between mb-5">
          <h4 className="text-gray-500 text-lg font-semibold sm:mb-0 mb-2">
            Profit & Expenses
          </h4>
          <div className="hs-dropdown relative inline-flex [--placement:bottom-right] sm:[--trigger:hover]">
            <a className="relative hs-dropdown-toggle cursor-pointer align-middle rounded-full">
              <i className="ti ti-dots-vertical text-2xl text-gray-400"></i>
            </a>
            <div
              className="card hs-dropdown-menu transition-[opacity,margin] rounded-md duration hs-dropdown-open:opacity-100 opacity-0 mt-2 min-w-max w-[150px] hidden z-[12]"
              aria-labelledby="hs-dropdown-custom-icon-trigger"
            >
              <div className="card-body p-0 py-2">
                <a
                  href="javscript:void(0)"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Action</p>
                </a>
                <a
                  href="javscript:void(0)"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Another Action</p>
                </a>
                <a
                  href="javscript:void(0)"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Something else here</p>
                </a>
              </div>
            </div>
          </div>
          {/* Dropdown menu */}
          <div className="hs-dropdown relative inline-flex [--placement:bottom-right] sm:[--trigger:hover]">
            <a
              className="relative hs-dropdown-toggle cursor-pointer align-middle rounded-full"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              <MoreVertical className="text-2xl text-gray-400" />
            </a>
            <div
              className={`card hs-dropdown-menu transition-[opacity,margin] rounded-md duration hs-dropdown-open:opacity-100 opacity-0 mt-2 min-w-max w-[150px] hidden z-[12] ${
                isDropdownOpen ? "block" : "hidden"
              }`}
              aria-labelledby="hs-dropdown-custom-icon-trigger"
            >
              <div className="card-body p-0 py-2">
                <a
                  href="#"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Action</p>
                </a>
                <a
                  href="#"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Another Action</p>
                </a>
                <a
                  href="#"
                  className="flex gap-2 items-center font-medium px-4 py-2.5 hover:bg-gray-200 text-gray-400"
                >
                  <p className="text-sm">Something else here</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Biểu đồ */}
        <Chart
          options={chartOptions}
          series={chartOptions.series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </div>
  );
};

export default ProfitExpensesChart;
