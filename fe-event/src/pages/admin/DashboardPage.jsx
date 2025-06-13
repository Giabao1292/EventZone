// src/pages/DashboardPage.jsx
import React from "react";
// import { LayoutDashboard } from 'lucide-react'; // Không cần nếu không dùng icon này ở đây

// Import các component con
import ProfitExpensesChart from "../../components/dashboard/ProfitExpensesChart";
import TrafficDistributionCard from "../../components/dashboard/TrafficDistributionCard";
import ProductSalesSparkline from "../../components/dashboard/ProductSalesSparkLine";
import UpcomingSchedules from "../../components/dashboard/UpcomingSchedules";
import TopPayingClientsTable from "../../components/dashboard/TopPayingClientsTable";
import ProductCard from "../../components/dashboard/ProductCard";

const DashboardPage = () => {
  return (
    <>
      {" "}
      {/* Sử dụng React Fragment để không có thẻ div bọc ngoài */}
      {/* Hàng 1: Profit & Expenses, Traffic Distribution, Product Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6">
        <div className="col-span-2">
          <ProfitExpensesChart />
        </div>

        <div className="flex flex-col gap-6">
          <TrafficDistributionCard />
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
