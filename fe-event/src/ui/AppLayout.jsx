import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
// import StarfieldAnimation from "react-starfield";

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen relative bg-black">
      {/* Hiệu ứng sao nền, nằm dưới mọi thứ khác */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.4 }}
      >
        {/* <StarfieldAnimation
          numParticles={50}
          depth={400}
          style={{ width: "100%", height: "100%" }}
        /> */}
      </div>

      {/* Nội dung chính, nằm trên sao */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow relative overflow-hidden">
          <div className="relative z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
