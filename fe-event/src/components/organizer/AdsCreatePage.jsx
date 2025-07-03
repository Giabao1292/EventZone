import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdsCreatePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    totalPrice: 0,
    bannerImageUrl: "",
    paymentMethod: "VNPAY",
  });
  const [loading, setLoading] = useState(false);

  // Calculate price based on dates
  const calculatePrice = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.max(
      1,
      Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1
    );
    return diffDays * 2000;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    // Recalculate price if dates change
    if (name === "startDate" || name === "endDate") {
      updated.totalPrice = calculatePrice(
        name === "startDate" ? value : form.startDate,
        name === "endDate" ? value : form.endDate
      );
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      // Send request to create ad and get payment link in one call
      const response = await axios.post(
        "http://localhost:8080/api/event-ads/create-and-pay",
        {
          eventId: parseInt(eventId),
          startDate: form.startDate,
          endDate: form.endDate,
          totalPrice: form.totalPrice,
          bannerImageUrl: form.bannerImageUrl,
          paymentMethod: form.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { adsId, checkoutUrl } = response.data.data;

      // Redirect to the payment checkout URL
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra khi tạo quảng cáo hoặc thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 text-white shadow-xl p-6 rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Tạo quảng cáo sự kiện #{eventId}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            min={form.startDate || new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Giá quảng cáo (VNĐ)</label>
          <input
            type="number"
            name="totalPrice"
            value={form.totalPrice}
            readOnly
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1">Banner (URL ảnh)</label>
          <input
            type="text"
            name="bannerImageUrl"
            value={form.bannerImageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Phương thức thanh toán</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="VNPAY">VNPAY</option>
            <option value="PAYOS">PAYOS</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          {loading ? "Đang xử lý..." : "Tạo quảng cáo & Thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default AdsCreatePage;
