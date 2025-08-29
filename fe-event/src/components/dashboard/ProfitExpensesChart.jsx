import Chart from "react-apexcharts";
import { MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";

const ProfitExpensesChart = ({ revenueDetails }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const categories = revenueDetails?.map((item) => item.bucket) || [];
  const bookingData = revenueDetails?.map((item) => item.booking) || [];
  const adsData = revenueDetails?.map((item) => item.ads) || [];

  const chartOptions = {
    series: [
      {
        name: "Ticket Revenue",
        data: bookingData,
      },
      {
        name: "Ads Revenue",
        data: adsData,
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
    colors: ["#0085db", "#fb977d"],
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
      categories: categories,
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
      colors: ["#0085db", "#fb977d"],
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
