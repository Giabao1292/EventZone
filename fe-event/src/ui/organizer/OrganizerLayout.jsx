import { Outlet } from "react-router-dom";
import HeaderOrganizer from "./HeaderOrganizer";
import OrganizerSidebar from "./OrganizerSidebar";
import PropTypes from "prop-types";

const OrganizerLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Animated background with floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-orange-200/20"></div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <OrganizerSidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="bg-gradient-to-r from-white/90 via-blue-50/90 to-orange-50/90 border-b border-blue-200/50 backdrop-blur-xl shadow-sm relative z-[99999]">
          <HeaderOrganizer />
        </div>

        <main className="p-6 overflow-auto bg-gradient-to-br from-white/80 via-blue-50/80 to-orange-50/80 flex-1 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-orange-200/10 pointer-events-none"></div>
          <div className="relative z-10 text-slate-800">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>

      {/* Animated particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping shadow-lg shadow-blue-400/30"></div>
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-1000 shadow-lg shadow-orange-400/30"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-2000 shadow-lg shadow-blue-500/30"></div>
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping delay-1500 shadow-lg shadow-orange-500/30"></div>
    </div>
  );
};

OrganizerLayout.propTypes = {
  children: PropTypes.node,
};
export default OrganizerLayout;
