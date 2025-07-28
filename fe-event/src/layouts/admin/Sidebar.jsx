import React, { useState } from "react";
// If you're using React Router, uncomment this:
// import { Link, useLocation } from "react-router-dom";

export default function SidebarNavigation() {
  // If using React Router, uncomment this:
  // const location = useLocation();
  // const pathname = location.pathname;

  // For now, we'll just use a placeholder pathname
  const pathname = window.location.pathname;

  const [openAccordions, setOpenAccordions] = useState({});

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {/* Start Vertical Layout Sidebar */}
      <div className="p-4">
        <a href="/admin/dashboard" className="text-nowrap">
          <img src="/eventlogo.png" alt="Logo-Dark" />
        </a>
      </div>
      <div className="scroll-sidebar overflow-y-auto">
        <nav className="w-full flex flex-col sidebar-nav px-4 mt-5">
          <ul id="sidebarnav" className="text-gray-600 text-sm">
            <li className="text-xs font-bold pb-[5px]">
              <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
              <span className="text-xs text-gray-400 font-semibold">HOME</span>
            </li>

            <li className="sidebar-item">
              {/* If using React Router, replace 'a' with Link */}
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/dashboard"
              >
                <i className="ti ti-layout-dashboard ps-2 text-2xl text-blue-500"></i>
                <span>Dashboard</span>
              </a>
            </li>

            <li className="text-xs font-bold mb-4 mt-6">
              <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
              <span className="text-xs text-gray-400 font-semibold">
                MANAGEMENT
              </span>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/buttons"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/withdraw"
              >
                <i className="ti ti-user-circle ps-2 text-yellow-500 text-2xl"></i>{" "}
                <span>Withdraw Management</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/buttons"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/users"
              >
                <i className="ti ti-user-circle ps-2 text-yellow-500 text-2xl"></i>{" "}
                <span>User Management</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/alerts"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/organizers"
              >
                <i className="ti ti-users ps-2 text-yellow-500 text-2xl"></i>{" "}
                <span>Organizer Management</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/buttons"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/ads"
              >
                <i className="ti ti-user-circle ps-2 text-yellow-500 text-2xl"></i>{" "}
                <span>Ads Management</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/alerts"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/events"
              >
                <i className="ti ti-ticket ps-2 text-2xl text-red-500"></i>{" "}
                <span>Event Management</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/alerts"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/vouchers"
              >
                <i className="ti ti-discount-2 ps-2 text-2xl text-red-500"></i>{" "}
                <span>Voucher Management</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/admin/reviews"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/reviews"
              >
                <i className="ti ti-message-circle ps-2 text-yellow-500 text-2xl"></i>{" "}
                <span>Review Management</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/admin/category-management"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/category-management"
              >
                <i className="ti ti-folder ps-2 text-2xl text-yellow-500"></i>
                <span>Category Management</span>
              </a>
            </li>

            <li className="text-xs font-bold mb-4 mt-6">
              <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
              <span className="text-xs text-gray-400 font-semibold">
                TRACK & STATISTICS
              </span>
            </li>

            {/* Ecommerce Accordion */}
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/alerts"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/admin/revenue"
              >
                <i className="ti ti-report-money ps-2 text-2xl text-emerald-500"></i>{" "}
                <span>Revenue Management</span>
              </a>
            </li>

            {/* User Profile Accordion */}

            {/* For brevity, I'm not including all sections, but the pattern is the same */}
            {/* Additional sections would follow the same pattern */}
          </ul>
        </nav>
      </div>
    </>
  );
}
