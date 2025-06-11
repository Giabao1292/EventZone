import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SettingsPanel from "./SettingsPanel";
import Footer from "./Footer";
import Spinner from "./Spinner";

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);
  const location = useLocation();

  const onRouteChanged = () => {
    const fullPageLayoutRoutes = [
      "/user-pages/login-1",
      "/user-pages/register-1",
      "/error-pages/error-404",
      "/error-pages/error-500",
    ];

    let isFullPage = false;
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (location.pathname.includes(fullPageLayoutRoutes[i])) {
        isFullPage = true;
        break;
      }
    }

    setIsFullPageLayout(isFullPage);
    const pageBodyWrapper = document.querySelector(".page-body-wrapper");
    if (pageBodyWrapper) {
      if (isFullPage) {
        pageBodyWrapper.classList.add("full-page-wrapper");
      } else {
        pageBodyWrapper.classList.remove("full-page-wrapper");
      }
    }
  };

  useEffect(() => {
    // Initial route check and loading simulation
    onRouteChanged();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Hide spinner after 0.5 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array for componentDidMount equivalent

  useEffect(() => {
    onRouteChanged();
  }, [location]); // Run onRouteChanged when location changes

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container-scroller">
      {!isFullPageLayout && <Navbar />}
      <div className="container-fluid page-body-wrapper">
        {!isFullPageLayout && <SettingsPanel />}
        {!isFullPageLayout && <Sidebar />}
        <div className="main-panel">
          <div className="content-wrapper">
            <Outlet />
          </div>
          {!isFullPageLayout && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
