import React, { useEffect, useState } from "react";
import { fetchRevenueChartData } from "../../services/revenueService";
import ProfitExpensesChart from "../../components/dashboard/ProfitExpensesChart";
import TrafficDistributionCard from "../../components/dashboard/TrafficDistributionCard";
import ProductSalesSparkline from "../../components/dashboard/ProductSalesSparkLine";
import UpcomingSchedules from "../../components/dashboard/UpcomingSchedules";
import TopPayingClientsTable from "../../components/dashboard/TopPayingClientsTable";
import TopEventsCardGrid from "../../ui/TopEventsCardGrid";

const DashboardPage = () => {
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    // Gửi period = "7days", orgName = null
    fetchRevenueChartData("30days", null)
      .then(setRevenueData)
      .catch(console.error);
  }, []);

  if (!revenueData) return <p className="text-center">Loading…</p>;

  return (
    <>
      {/* Hàng 1: biểu đồ & donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-y-6">
        <div className="col-span-2">
          <ProfitExpensesChart revenueDetails={revenueData.revenueDetails} />
        </div>
        <div className="flex flex-col gap-6">
          <TrafficDistributionCard revenueData={revenueData} />
          <ProductSalesSparkline />
        </div>
      </div>

      {/* Hàng 2: Upcoming Schedules & Top Paying Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-y-6 mt-6">
        <UpcomingSchedules />
        <TopPayingClientsTable />
      </div>

      {/* Hàng 3: Top Events */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Top Events</h2>
        <TopEventsCardGrid />
      </div>
    </>
  );
};

export default DashboardPage;
