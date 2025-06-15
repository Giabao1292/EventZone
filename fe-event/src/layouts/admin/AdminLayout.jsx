// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Đảm bảo bạn đã import Header
import Footer from "./Footer"; // Đảm bảo bạn đã import Footer
import { Outlet } from "react-router-dom";
import AppTopStrip from "./AppTopStrip"; // Import AppTopStrip nếu cần
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định sidebar mở

  // Hàm để toggle trạng thái của sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-surface">
      <main>
        <div className="app-topstrip z-40 sticky top-0 py-[15px] px-6 bg-[linear-gradient(90deg,_#0f0533_0%,_#1b0a5c_100%)]">
          <AppTopStrip />
        </div>
        <div id="main-wrapper" className="flex p-5 xl:pr-0">
          <aside
            id="application-sidebar-brand"
            className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transform hidden xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 fixed xl:top-[90px] xl:left-auto top-0 left-0 with-vertical h-screen z-[999] shrink-0 w-[270px] shadow-md xl:rounded-md rounded-none bg-white left-sidebar transition-all duration-300"
          >
            <Sidebar />
          </aside>
          <div className="w-full page-wrapper xl:px-6 px-0">
            <main className="h-full max-w-full">
              <div className="container full-container p-0 flex flex-col gap-6">
                <header className="bg-white shadow-md rounded-md w-full text-sm py-4 px-6">
                  <Header />
                </header>
                <Outlet />
                <Footer />
              </div>
            </main>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
