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
import TopEventsCardGrid from "../../ui/TopEventsCardGrid";
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
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Top Events</h2>
        <TopEventsCardGrid />
      </div>
    </>
  );
};

export default DashboardPage;
