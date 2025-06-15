import React from "react";
import { Menu } from "lucide-react";

// Import các components con đã tạo
import DDNotification from "./header-components/DDNotification";
import DDProfile from "./header-components/DDProfile";

const Header = () => {
  const toggleSidebar = () => {
    // You would implement sidebar toggle logic here
    // This would depend on how your sidebar is implemented
    console.log("Toggle sidebar");
  };

  return (
    <nav
      className="w-full flex items-center justify-between"
      aria-label="Global"
    >
      <ul className="icon-nav flex items-center gap-4">
        <li className="relative xl:hidden">
          <a
            className="text-xl icon-hover cursor-pointer text-heading"
            onClick={toggleSidebar}
            aria-controls="application-sidebar-brand"
            aria-label="Toggle navigation"
            id="headerCollapse"
            href="#"
          >
            <i className="ti ti-menu-2 relative z-1"></i>
          </a>
        </li>

        <li className="relative">
          <DDNotification />
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <DDProfile />
      </div>
    </nav>
  );
};

export default Header;
