import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios"; // ⬅️ Quan trọng

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Đang xác thực...");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:8080/api/auth/verify-email?token=${token}`)
        .then(() => setStatus("✅ Xác thực thành công!"))
        .catch(() => setStatus("❌ Token không hợp lệ hoặc đã hết hạn."));
    } else {
      setStatus("❌ Không tìm thấy token.");
    }
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
