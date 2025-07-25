import React, { useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../ui/Header";

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
    <div className="flex flex-col min-h-screen bg-[#222831] text-[#EEEEEE]">
      <Header />
      <main className="flex-1 flex items-center justify-center overflow-auto bg-[#222831]">
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
  );
}
