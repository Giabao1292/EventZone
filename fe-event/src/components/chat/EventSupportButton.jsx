import { useState, useEffect } from "react";
import { Building2, Shield, Info } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import chatService from "../../services/chatService";

const EventSupportButton = ({ event, organizer }) => {
  const [loading, setLoading] = useState(false);
  const [adminUserId, setAdminUserId] = useState(null);
  const { user } = useAuth();

  // Lấy admin user ID khi component mount
  useEffect(() => {
    const fetchAdminUserId = async () => {
      try {
        const response = await chatService.getAdminUserId();
        if (response.code === 200) {
          setAdminUserId(response.data);
        }
      } catch (error) {
        console.error("Error fetching admin user ID:", error);
      }
    };
    fetchAdminUserId();
  }, []);

  const formatEventInfo = (event) => {
    const showingTime = event.showingTimes?.[0];
    const address = showingTime?.address;

    return `
📅 **Thông tin sự kiện cần hỗ trợ:**

🎯 **Tên sự kiện:** ${event.eventTitle || event.title || event.name}
📝 **Mô tả:** ${event.description || "Không có mô tả"}
📍 **Địa điểm:** ${
      address ? `${address.venueName} - ${address.location}` : "Chưa cập nhật"
    }
📅 **Ngày:** ${
      showingTime?.startTime
        ? new Date(showingTime.startTime).toLocaleDateString("vi-VN")
        : "Chưa cập nhật"
    }
⏰ **Giờ:** ${
      showingTime?.startTime
        ? new Date(showingTime.startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Chưa cập nhật"
    }
🏢 **Nhà tổ chức:** ${organizer?.fullName || organizer?.name || "Không rõ"}
💰 **Giá vé:** ${
      showingTime?.price
        ? `${showingTime.price.toLocaleString("vi-VN")} VNĐ`
        : "Chưa cập nhật"
    }

Tôi cần hỗ trợ về sự kiện này.`.trim();
  };

  const handleSendDirectMessage = async (receiverId, isAdmin = false) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để yêu cầu hỗ trợ");
      return;
    }

    if (receiverId === user.id) {
      toast.error("Không thể gửi tin nhắn cho chính mình");
      return;
    }

    setLoading(true);
    try {
      const eventInfo = formatEventInfo(event);
      const message = isAdmin
        ? `Xin chào Admin! ${eventInfo}`
        : `Xin chào! ${eventInfo}`;

      // Gửi tin nhắn trực tiếp thay vì tạo cuộc trò chuyện
      await chatService.sendMessage(receiverId, message, "TEXT", event.id);

      toast.success(
        `Đã gửi yêu cầu hỗ trợ tới ${isAdmin ? "Admin" : "Nhà tổ chức"}!`
      );

      // Trigger chat widget to open
      localStorage.setItem("openChatWidget", "true");
      window.dispatchEvent(new Event("openChatWidget"));
    } catch (error) {
      console.error("Error sending direct message:", error);
      toast.error("Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToOrganizer = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để yêu cầu hỗ trợ");
      return;
    }

    if (!event || !event.id) {
      toast.error("Không tìm thấy thông tin sự kiện");
      return;
    }

    setLoading(true);
    try {
      // Lấy organizer user ID cho sự kiện này
      const organizerResponse = await chatService.getOrganizerUserId(event.id);
      if (organizerResponse.code !== 200) {
        throw new Error("Không thể lấy thông tin organizer");
      }

      const organizerUserId = organizerResponse.data;

      if (organizerUserId === user.id) {
        toast.error("Không thể gửi tin nhắn cho chính mình");
        return;
      }

      const eventInfo = formatEventInfo(event);
      const message = `Xin chào! ${eventInfo}`;

      // Gửi tin nhắn trực tiếp
      await chatService.sendMessage(organizerUserId, message, "TEXT", event.id);

      toast.success("Đã gửi yêu cầu hỗ trợ tới nhà tổ chức!");

      // Trigger chat widget to open
      localStorage.setItem("openChatWidget", "true");
      window.dispatchEvent(new Event("openChatWidget"));
    } catch (error) {
      console.error("Error sending message to organizer:", error);
      toast.error("Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "ORGANIZER":
        return <Building2 className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Info className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">
          Gửi yêu cầu hỗ trợ sự kiện
        </h3>
      </div>

      <p className="text-gray-300 mb-6">
        Bạn có câu hỏi về sự kiện này? Hãy gửi tin nhắn trực tiếp tới nhà tổ
        chức hoặc admin để được hỗ trợ ngay lập tức.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gửi yêu cầu Admin */}
        {adminUserId && adminUserId !== user.id && (
          <button
            onClick={() => handleSendDirectMessage(adminUserId, true)}
            disabled={loading}
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Gửi yêu cầu Admin</span>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
          </button>
        )}

        {/* Gửi yêu cầu Organizer */}
        <button
          onClick={handleSendToOrganizer}
          disabled={loading}
          className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Building2 className="w-5 h-5" />
          <span className="font-medium">Gửi yêu cầu Organizer</span>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Đang gửi yêu cầu hỗ trợ...
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-sm text-blue-300">
          <strong>💡 Lưu ý:</strong> Tin nhắn sẽ được gửi trực tiếp tới người
          nhận. Thông tin sự kiện sẽ được tự động gửi kèm để admin/organizer có
          thể hỗ trợ bạn tốt hơn.
        </p>
      </div>
    </div>
  );
};

export default EventSupportButton;
