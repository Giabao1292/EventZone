// src/pages/DashboardPage.jsx
import React from "react";
// import { LayoutDashboard } from 'lucide-react'; // Không cần nếu không dùng icon này ở đây
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchRevenueChartData } from "../../services/revenueService";
// Import các component con
import ProfitExpensesChart from "../../components/dashboard/ProfitExpensesChart";
import TrafficDistributionCard from "../../components/dashboard/TrafficDistributionCard";
import ProductSalesSparkline from "../../components/dashboard/ProductSalesSparkLine";
import UpcomingSchedules from "../../components/dashboard/UpcomingSchedules";
import TopPayingClientsTable from "../../components/dashboard/TopPayingClientsTable";
import ProductCard from "../../components/dashboard/ProductCard";

const DashboardPage = () => {
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    const from = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    const to = dayjs().format("YYYY-MM-DD");

    fetchRevenueChartData(from, to).then(setRevenueData).catch(console.error);
  }, []);

  if (!revenueData) return <p className="text-center">Loading…</p>;

  return (
    <>
      {/* Hàng 1: biểu đồ & donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-y-6">
        <div className="col-span-2">
          {/* truyền revenueDetails cho cột */}
          <ProfitExpensesChart revenueDetails={revenueData.revenueDetails} />
        </div>

        <div className="flex flex-col gap-6">
          {/* truyền toàn bộ revenueData cho donut */}
          <TrafficDistributionCard revenueData={revenueData} />
          <ProductSalesSparkline />
        </div>
      </div>
      {/* Hàng 2: Upcoming Schedules & Top Paying Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6">
        <UpcomingSchedules />
        <TopPayingClientsTable />
      </div>
      {/* Hàng 3: Product Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-6">
        <ProductCard
          imageSrc="/assets/images/products/product-1.jpg"
          title="Boat Headphone"
          price="$50"
          oldPrice="$65"
          rating={3}
        />
        <ProductCard
          imageSrc="/assets/images/products/product-2.jpg"
          title="MacBook Air Pro"
          price="$650"
          oldPrice="$900"
          rating={3}
        />
        <ProductCard
          imageSrc="/assets/images/products/product-3.jpg"
          title="Red Valvet Dress"
          price="$150"
          oldPrice="$200"
          rating={3}
        />
        <ProductCard
          imageSrc="/assets/images/products/product-4.jpg" // Dựa trên hình ảnh dashboard
          title="Cute Soft Teddybear"
          price="$285"
          oldPrice="$345"
          rating={4}
        />
      </div>
    </>
  );
};

export default DashboardPage;
