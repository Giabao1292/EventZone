import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyRegisterApi } from "../services/authServices";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyToken = searchParams.get("verifyToken");

  const isCalledRef = useRef(false);

  useEffect(() => {
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    if (!verifyToken) {
      navigate("/?verifyStatus=failed");
      return;
    }

    verifyRegisterApi(verifyToken)
      .then((res) => {
        if (res?.accessToken) {
          localStorage.setItem("accessToken", res.accessToken);
          window.location.href = "/home?verifyStatus=success";
        }
        navigate("/home?verifyStatus=success");
      })
      .catch(() => {
        navigate("/home?verifyStatus=failed");
      });
  }, [verifyToken, navigate]);
};
export default VerifyEmail;
