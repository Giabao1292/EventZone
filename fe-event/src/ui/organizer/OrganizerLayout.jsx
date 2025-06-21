import { Outlet } from "react-router-dom";
import HeaderOrganizer from "./HeaderOrganizer";
import OrganizerSidebar from "./OrganizerSidebar";
import PropTypes from "prop-types";

const OrganizerLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20"></div>

      <OrganizerSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <div className="bg-gradient-to-r from-gray-800/80 via-gray-900/80 to-gray-800/80 border-b border-gray-700/50">
          <HeaderOrganizer />
        </div>

        <main className="p-6 overflow-auto bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none"></div>
          <div className="relative z-10 text-white">
            {" "}
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-2000"></div>
    </div>
  );
};

OrganizerLayout.propTypes = {
  children: PropTypes.node,
};
export default OrganizerLayout;
