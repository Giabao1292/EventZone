import Chart from "react-apexcharts";
import { ArrowDownRight, DollarSign } from "lucide-react"; // Icons

const ProductSalesSparkline = () => {
  // Cấu hình biểu đồ từ dashboard.js
  const chartOptions = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Earnings",
        color: "#8763da",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex gap-6 items-center justify-between">
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-500 text-lg font-semibold">
              Product Sales
            </h4>
            <div className="flex flex-col gap-4">
              <h3 className="text-[22px] font-semibold text-gray-500">
                $6,820
              </h3>
              <div className="flex items-center gap-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-400">
                  <ArrowDownRight className="text-red-500" />
                </span>
                <p className="text-gray-500 text-sm font-normal">+9%</p>
                <p className="text-gray-400 text-sm font-normal text-nowrap">
                  last year
                </p>
              </div>
            </div>
          </div>

          <div className="w-11 h-11 flex justify-center items-center rounded-full bg-red-500 text-white self-start">
            <DollarSign className="text-xl" />
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
  );
};

export default ProductSalesSparkline;
