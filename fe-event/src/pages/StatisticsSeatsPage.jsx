import { useEffect, useState } from "react";
import axios from "axios";

export default function StatisticsSeatsPage() {
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy danh sách sự kiện
  useEffect(() => {
  async function fetchEvents() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/events/myevents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Danh sách sự kiện:", res.data.data);
      setEvents(res.data.data);   
    } catch (error) {
      console.error("Lỗi khi lấy sự kiện:", error);
    }
  }
  fetchEvents();
}, []);



  // Hàm lấy dữ liệu thống kê
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const params = {};
      if (eventId) params.eventId = eventId;
      if (fromDate) params.fromDate = `${fromDate}T00:00:00`;
      if (toDate) params.toDate = `${toDate}T23:59:59`;

      const res = await axios.get("/api/ticket-sales", {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setData(res.data);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc khi submit form
  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Lấy dữ liệu mặc định khi vào trang
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Thống kê ghế đã bán</h1>
      <form className="flex gap-4 mb-6 items-end" onSubmit={handleFilter}>
        <div>
          <label className="block text-gray-300 mb-1">Sự kiện</label>
          <select
            className="w-64 h-12 px-3 rounded bg-white text-black text-base border border-gray-300 shadow-sm focus:outline-none"
            value={eventId}
            onChange={e => setEventId(e.target.value)}
          >
            <option value="">Tất cả</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>



        </div>
        <div>
          <label className="block text-gray-300 mb-1">Từ ngày</label>
          <input
            type="date"
            className="h-12 px-3 rounded bg-white text-black text-base border border-gray-300 shadow-sm focus:outline-none"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Đến ngày</label>
          <input
            type="date"
            className="h-12 px-3 rounded bg-white text-black text-base border border-gray-300 shadow-sm focus:outline-none"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-32 bg-blue-600 h-12 px-3 rounded bg-blue text-black text-base border border-gray-300 shadow-sm focus:outline-none
"
        >
          Lọc
        </button>
      </form>
      {loading ? (
        <div className="text-gray-400">Đang tải...</div>
      ) : (
        <table className="w-full text-left bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-4">Tên sự kiện</th>
              <th className="py-2 px-4">Số ghế đã bán</th>
              <th className="py-2 px-4">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.eventId} className="border-t border-gray-700">
                <td className="py-2 px-4 text-white">{item.eventTitle}</td>
                <td className="py-2 px-4 text-yellow-400">{item.ticketsSold}</td>
                <td className="py-2 px-4 text-green-400">{item.totalRevenue?.toLocaleString("vi-VN")} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && data.length === 0 && (
        <div className="text-gray-400 py-8 text-center">Không có dữ liệu.</div>
      )}
    </div>
  );
}