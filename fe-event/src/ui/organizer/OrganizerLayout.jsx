import { Outlet } from "react-router-dom";
import HeaderOrganizer from "./HeaderOrganizer";
import OrganizerSidebar from "./OrganizerSidebar";
import PropTypes from "prop-types";

const OrganizerLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Simplified background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/10 via-transparent to-orange-200/10"></div>

        {/* Reduced floating orbs - only 2 instead of 3 */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Simplified grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <OrganizerSidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="bg-gradient-to-r from-white/90 via-blue-50/90 to-orange-50/90 border-b border-blue-200/50 backdrop-blur-xl shadow-sm relative z-[99999]">
          <HeaderOrganizer />
        </div>

        <main className="p-6 overflow-auto bg-gradient-to-br from-white/80 via-blue-50/80 to-orange-50/80 flex-1 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/5 via-transparent to-orange-200/5 pointer-events-none"></div>
          <div className="relative z-10 text-slate-800">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>

      {/* Reduced animated particles - only 2 instead of 4 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping shadow-lg shadow-blue-400/30"></div>
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-1000 shadow-lg shadow-orange-400/30"></div>
    </div>
  );
};

OrganizerLayout.propTypes = {
  children: PropTypes.node,
};
export default OrganizerLayout;
