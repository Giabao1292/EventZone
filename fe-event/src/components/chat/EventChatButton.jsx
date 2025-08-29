import { useState, useEffect } from "react";
import { MessageCircle, Building2, Shield } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import chatService from "../../services/chatService";
import PropTypes from "prop-types";

const EventChatButton = ({ event, organizer }) => {
  const [loading, setLoading] = useState(false);
  const [adminUserId, setAdminUserId] = useState(null);
  const { user } = useAuth();

  // Lấy admin user ID và organizer user ID khi component mount
  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        // Lấy admin user ID
        const adminResponse = await chatService.getAdminUserId();
        if (adminResponse.code === 200) {
          setAdminUserId(adminResponse.data);
        }

        // Lấy organizer user ID cho sự kiện này nếu chưa có
        if (event && event.id && (!organizer || !organizer.id)) {
          const organizerResponse = await chatService.getOrganizerUserId(
            event.id
          );
          if (organizerResponse.code === 200) {
            // Cập nhật organizer object với user ID
            if (organizer) {
              organizer.id = organizerResponse.data;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    };
    fetchUserIds();
  }, [event, organizer]);

  const handleChatWithOrganizer = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chat");
      return;
    }

    if (!event || !event.id) {
      toast.error("Không tìm thấy thông tin sự kiện");
      return;
    }

    setLoading(true);
    try {
      // Lấy organizer ID cho sự kiện này
      const organizerResponse = await chatService.getOrganizerUserId(event.id);
      if (organizerResponse.code !== 200) {
        throw new Error("Không thể lấy thông tin organizer");
      }

      const organizerId = organizerResponse.data;

      if (organizerId === user.id) {
        toast.error("Không thể chat với chính mình");
        return;
      }

      // Gửi tin nhắn đầu tiên để tạo cuộc trò chuyện
      const message = `Xin chào! Tôi có câu hỏi về sự kiện "${
        event.eventTitle || event.title
      }".`;

      await chatService.createSupportConversation(organizerId, message);

      toast.success("Đã bắt đầu cuộc trò chuyện với nhà tổ chức!");

      // Trigger chat widget to open
      localStorage.setItem("openChatWidget", "true");
      window.dispatchEvent(new Event("openChatWidget"));
    } catch (error) {
      console.error("Error starting chat with organizer:", error);
      toast.error("Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithAdmin = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chat");
      return;
    }

    if (!adminUserId) {
      toast.error("Không tìm thấy admin để chat");
      return;
    }

    if (adminUserId === user.id) {
      toast.error("Không thể chat với chính mình");
      return;
    }

    setLoading(true);
    try {
      // Gửi tin nhắn đầu tiên để tạo cuộc trò chuyện
      const message = `Xin chào Admin! Tôi cần hỗ trợ về sự kiện "${
        event.eventTitle || event.title
      }".`;

      await chatService.createSupportConversation(adminUserId, message);

      toast.success("Đã bắt đầu cuộc trò chuyện với Admin!");

      // Trigger chat widget to open
      localStorage.setItem("openChatWidget", "true");
      window.dispatchEvent(new Event("openChatWidget"));
    } catch (error) {
      console.error("Error starting chat with admin:", error);
      toast.error("Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Chat với Organizer */}
      <button
        onClick={handleChatWithOrganizer}
        disabled={loading}
        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat với nhà tổ chức</span>
        <Building2 className="w-4 h-4 text-blue-500" />
      </button>

      {/* Chat với Admin */}
      {adminUserId && adminUserId !== user.id && (
        <button
          onClick={handleChatWithAdmin}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Hỗ trợ từ Admin</span>
          <Shield className="w-4 h-4" />
        </button>
      )}

      {loading && (
        <div className="text-center text-sm text-gray-600">
          Đang tạo cuộc trò chuyện...
        </div>
      )}
    </div>
  );
};

EventChatButton.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    eventTitle: PropTypes.string,
    title: PropTypes.string,
  }),
  organizer: PropTypes.shape({
    id: PropTypes.number,
    role: PropTypes.string,
  }),
};

export default EventChatButton;
