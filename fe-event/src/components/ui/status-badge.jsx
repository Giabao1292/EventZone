// components/StatusBadge.jsx
import React from "react";
import { Badge } from "./badge";

const StatusBadge = ({ status }) => {
  const baseClass =
    "inline-flex items-center py-2 px-4 rounded-3xl font-semibold";

  const normalizedStatus = status?.toLowerCase();
  let label = status;
  let className = `${baseClass} bg-gray-200 !text-gray-800`;

  switch (normalizedStatus) {
    case "paid":
    case "confirmed":
    case "approved":
      label = "Hoàn thành";
      className = `${baseClass} bg-green-100 !text-green-700`;
      break;
    case "pending":
      label = "Đang xử lý";
      className = `${baseClass} bg-yellow-100 !text-yellow-700`;
      break;
    case "failed":
    case "rejected":
    case "cancelled":
      label = "Thất bại";
      className = `${baseClass} bg-red-100 !text-red-700`;
      break;
    case "refunded":
      label = "Hoàn tiền";
      className = `${baseClass} bg-gray-100 !text-gray-700`;
      break;
  }

  return <Badge className={className}>{label}</Badge>;
};

export default StatusBadge;
