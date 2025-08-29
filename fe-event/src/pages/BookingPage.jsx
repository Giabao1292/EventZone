import React, { useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../ui/Header";
import Background from "../assets/images/background/background.png";

export default function BookingPage() {
  const { showingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { event, showing } = location.state || {};
  const [selection, setSelection] = useState(null);

  const handleStep1Complete = (sel) => {
    setSelection(sel);
    navigate(`payment`, { state: { event, showing, selection: sel } });
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#222831] text-[#EEEEEE]"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0  bg-opacity-50 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center overflow-auto">
          <Outlet
            context={{
              event,
              showing,
              showingId,
              selection,
              handleStep1Complete,
            }}
          />
        </main>
      </div>
    </div>
  );
}
