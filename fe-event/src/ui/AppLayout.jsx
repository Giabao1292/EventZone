"use client";

import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const AppLayout = () => {
    const location = useLocation();

    return (
        <div
            className="flex flex-col min-h-screen"
            style={{ backgroundColor: "#12141D" }}
        >
            <Header />
            <main
                className="flex-grow relative overflow-hidden"
                style={{ backgroundColor: "#12141D" }}
            >
                {/* Chỉ một vòng tròn cam nhạt ở giữa thôi */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="w-[366px] h-[366px] rounded-full blur-[250px]"
                        style={{
                            background: "#FF1B00",
                            opacity: 0.2,
                        }}
                    ></div>
                </div>

                {/* Content với smooth transitions */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;