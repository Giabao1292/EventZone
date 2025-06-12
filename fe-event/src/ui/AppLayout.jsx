import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-100 to-slate-200">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
