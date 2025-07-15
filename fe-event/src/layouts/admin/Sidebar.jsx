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
                <i className="ti ti-layout-dashboard ps-2 text-2xl"></i>
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



            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/forms"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/components/forms"
              >
                <i className="ti ti-file-description ps-2 text-2xl "></i>
                <span>Forms</span>
              </a>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                  pathname === "/components/typography"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/components/typography"
              >
                <i className="ti ti-typography ps-2 text-2xl"></i>{" "}
                <span>Typography</span>
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
            <div className="sidebar-item">
              <button
                onClick={() => toggleAccordion("userprofile")}
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full justify-between ${
                  openAccordions["userprofile"]
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
                aria-expanded={openAccordions["userprofile"]}
              >
                <div className="flex items-center gap-3">
                  <i className="ti ti-user-circle ps-2 text-2xl"></i>
                  <span>User Profile</span>
                </div>
                <div className="mr-5">
                  {openAccordions["userprofile"] ? (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  ) : (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  )}
                </div>
              </button>
              <div
                className={`w-full overflow-hidden transition-all duration-300 ${
                  openAccordions["userprofile"] ? "block" : "hidden"
                }`}
              >
                <a
                  className="gap-4 py-2.5 my-1 px-[14px] text-sm flex items-center justify-between relative rounded-md text-gray-500 w-full hover:bg-gray-50"
                  href="/user-profile/profile-one"
                >
                  <div className="flex items-center gap-4">
                    <i className="ti ti-circle text-xs"></i>{" "}
                    <span>Profile One</span>
                  </div>
                  <span className="text-white bg-blue-700 rounded-3xl px-2 text-xs py-0.5">
                    Pro
                  </span>
                </a>
                <a
                  className="gap-4 py-2.5 my-1 px-[14px] text-sm flex items-center justify-between relative rounded-md text-gray-500 w-full hover:bg-gray-50"
                  href="/user-profile/profile-two"
                >
                  <div className="flex items-center gap-4">
                    <i className="ti ti-circle text-xs"></i>{" "}
                    <span>Profile Two</span>
                  </div>
                  <span className="text-white bg-blue-700 rounded-3xl px-2 text-xs py-0.5">
                    Pro
                  </span>
                </a>
              </div>
            </div>

            {/* Blog Accordion */}
            <div className="sidebar-item">
              <button
                onClick={() => toggleAccordion("blog")}
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full justify-between ${
                  openAccordions["blog"] ? "text-blue-600" : "text-gray-500"
                }`}
                aria-expanded={openAccordions["blog"]}
              >
                <div className="flex items-center gap-3">
                  <i className="ti ti-chart-donut-3 ps-2 text-2xl"></i>
                  <span>Blog</span>
                </div>
                <div className="mr-5">
                  {openAccordions["blog"] ? (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  ) : (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  )}
                </div>
              </button>
              <div
                className={`w-full overflow-hidden transition-all duration-300 ${
                  openAccordions["blog"] ? "block" : "hidden"
                }`}
              >
                <a
                  className="gap-4 py-2.5 my-1 px-[14px] text-sm flex items-center justify-between relative rounded-md text-gray-500 w-full hover:bg-gray-50"
                  href="/blog/posts"
                >
                  <div className="flex items-center gap-4">
                    <i className="ti ti-circle text-xs"></i> <span>Posts</span>
                  </div>
                  <span className="text-white bg-blue-700 rounded-3xl px-2 text-xs py-0.5">
                    Pro
                  </span>
                </a>
                <a
                  className="gap-4 py-2.5 my-1 px-[14px] text-sm flex items-center justify-between relative rounded-md text-gray-500 w-full hover:bg-gray-50"
                  href="/blog/details"
                >
                  <div className="flex items-center gap-4">
                    <i className="ti ti-circle text-xs"></i>{" "}
                    <span>Details</span>
                  </div>
                  <span className="text-white bg-blue-700 rounded-3xl px-2 text-xs py-0.5">
                    Pro
                  </span>
                </a>
              </div>
            </div>

            {/* Email, Calendar, Kanban, etc. */}
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/email"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/email"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-mail ps-2 text-2xl"></i>{" "}
                  <span>Email</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/calendar"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/calendar"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-calendar ps-2 text-2xl"></i>{" "}
                  <span>Calendar</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/kanban"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/kanban"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-layout-kanban ps-2 text-2xl"></i>
                  <span>Kanban</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/chat"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/chat"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-message-dots ps-2 text-2xl"></i>{" "}
                  <span>Chat</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/notes"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/notes"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-notes ps-2 text-2xl"></i>{" "}
                  <span>Notes</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/contact"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/contact"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-phone ps-2 text-2xl"></i>{" "}
                  <span>Contact</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/contact-list"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/contact-list"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-list-details ps-2 text-2xl"></i>
                  <span>Contact List</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/invoice"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/invoice"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-file-text ps-2 text-2xl"></i>{" "}
                  <span>Invoice</span>
                </div>
              </a>
            </li>

            {/* Pages section */}
            <li className="text-xs font-bold mb-4 mt-6">
              <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
              <span className="text-xs text-gray-400 font-semibold">
                SETTING
              </span>
            </li>

            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/pricing"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/pricing"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-currency-dollar ps-2 text-2xl"></i>
                  <span>Pricing</span>
                </div>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center justify-between relative rounded-md w-full ${
                  pathname === "/faq"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500"
                }`}
                href="/faq"
              >
                <div className="flex items-center gap-2">
                  <i className="ti ti-help ps-2 text-2xl"></i> <span>FAQ</span>
                </div>
              </a>
            </li>

            {/* For brevity, I'm not including all sections, but the pattern is the same */}
            {/* Additional sections would follow the same pattern */}
          </ul>
        </nav>
      </div>
    </>
  );
}
