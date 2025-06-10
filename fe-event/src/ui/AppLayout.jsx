import Header from "./Header";
import Footer from "./Footer";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom"; // <-- Thêm Outlet

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow from-slate-100 to-slate-200">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
