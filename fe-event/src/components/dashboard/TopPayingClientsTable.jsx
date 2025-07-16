// src/components/dashboard/TopPayingClientsTable.jsx
import React, { useState, useEffect } from "react";
import { getTopClients } from "../../services/userServices"; // Import userService

const TopPayingClientsTable = () => {
  // State để lưu trữ dữ liệu từ API
  const [clients, setClients] = useState([]);
  // State để quản lý trạng thái loading
  const [loading, setLoading] = useState(true);
  // State để quản lý lỗi nếu có
  const [error, setError] = useState(null);

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchTopClients = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        setError(null); // Xóa lỗi cũ

        // Gọi hàm getTopClients từ userService
        // Truyền các tham số Pageable qua object params
        const topClientsData = await getTopClients({
          page: 0, // Trang đầu tiên
          size: 4, // 4 kết quả mỗi trang
        });

        setClients(topClientsData);
      } catch (err) {
        console.error("Error fetching top clients:", err);
        setError("Failed to fetch top clients. Please try again later.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchTopClients();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

  // Xử lý trạng thái loading và error
  if (loading) {
    return (
      <div className="col-span-2 flex items-center justify-center h-[200px]">
        <p>Đang tải danh sách khách hàng hàng đầu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-2 flex items-center justify-center h-[200px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="col-span-2">
      <div className="card h-full">
        <div className="card-body">
          <h4 className="text-gray-500 text-lg font-semibold mb-5">
            Top Paying Clients
          </h4>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap text-sm text-gray-500">
              <thead>
                <tr className="text-sm">
                  <th scope="col" className="p-4 font-semibold">
                    Profile
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Email
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Bookings
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Expenditure
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <tr key={client.email || index}>
                      {" "}
                      {/* Sử dụng email làm key hoặc index dự phòng */}
                      <td className="p-4 text-sm">
                        <div className="flex gap-6 items-center">
                          <div className="h-12 w-12 inline-block">
                            {/* Sử dụng client.profileUrl nếu có, hoặc avatar mặc định */}
                            <img
                              src={
                                client.profileUrl ||
                                "/assets/images/profile/user-2.jpg"
                              }
                              alt={client.fullName}
                              className="rounded-full w-full h-full object-cover" // Đảm bảo ảnh hiển thị đúng
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-gray-500">
                            <h3 className="font-bold">{client.fullName}</h3>
                            {/* Nếu có role, bạn có thể hiển thị ở đây */}
                            {/* <span className="font-normal">{client.role}</span> */}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <h3 className="font-medium">{client.email}</h3>
                      </td>
                      <td className="p-4">
                        <h3 className="font-medium text-teal-500">
                          {client.numberOfBookings}
                        </h3>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center py-2 px-4 rounded-3xl font-semibold ${
                            client.expenditure > 1000000
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {/* Định dạng tiền tệ cho expenditure */}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(client.expenditure)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      Không tìm thấy khách hàng hàng đầu nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPayingClientsTable;
