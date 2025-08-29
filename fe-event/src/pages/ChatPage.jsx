import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  User,
  Building2,
  Shield,
  ChevronUp,
} from "lucide-react";
import useChat from "../hooks/useChat";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const {
    connected,
    conversations,
    currentConversation,
    messages,
    setMessages,
    loading,
    loadingMessages,
    hasMoreMessages,
    sendMessage,
    selectConversation,
    loadMoreMessages,
  } = useChat();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation) return;

    const messageText = message.trim();
    setMessage("");

    // Create optimistic message
    const optimisticMessage = {
      id: Date.now(),
      content: messageText,
      senderId: Number(user.id), // Ensure it's a number
      receiverId: Number(currentConversation.partnerId), // Ensure it's a number
      messageType: "TEXT",
      eventId: currentConversation.eventId,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => {
      const newMessages = [...prev, optimisticMessage];
      // Sort by createdAt to ensure correct order
      return newMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });

    try {
      await sendMessage(currentConversation.partnerId, messageText, "TEXT");
    } catch (error) {
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLoadMoreMessages = async () => {
    if (hasMoreMessages && !loading) {
      await loadMoreMessages();
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    // Load more messages when user scrolls to top
    if (scrollTop === 0 && hasMoreMessages && !loading) {
      handleLoadMoreMessages();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "ORGANIZER":
        return <Building2 className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full text-white";
    switch (role) {
      case "ADMIN":
        return `${baseClasses} bg-red-500`;
      case "ORGANIZER":
        return `${baseClasses} bg-blue-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  };

  const getMessageStatus = (message) => {
    if (Number(message.senderId) === Number(user.id)) {
      if (message.read) {
        return <span className="text-xs text-blue-400 ml-2">✓✓ đã xem</span>;
      } else {
        return <span className="text-xs text-gray-400 ml-2">✓ đã gửi</span>;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversation List */}
            <div className="lg:col-span-1 border-r border-gray-200">
              <div className="p-4 bg-purple-600 text-white">
                <h2 className="text-xl font-semibold">Tin nhắn</h2>
                <p className="text-purple-200 text-sm">
                  {connected ? "Đang kết nối" : "Đang kết nối lại..."}
                </p>
              </div>

              <div className="overflow-y-auto h-full">
                {loading && conversations.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      Chưa có cuộc trò chuyện nào
                    </p>
                    <p className="text-sm">
                      Bắt đầu chat với admin hoặc nhà tổ chức sự kiện
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.partnerId}
                        onClick={() => selectConversation(conversation)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          currentConversation?.partnerId ===
                          conversation.partnerId
                            ? "bg-purple-50 border-r-2 border-purple-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                conversation.partnerAvatar ||
                                "/default-avatar.png"
                              }
                              alt={conversation.partnerName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {getRoleIcon(conversation.partnerRole)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.partnerName}
                              </h3>
                              <span
                                className={getRoleBadge(
                                  conversation.partnerRole
                                )}
                              >
                                {conversation.partnerRole}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  conversation.lastMessageTime
                                ).toLocaleDateString("vi-VN")}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {conversation.unreadCount > 99
                                    ? "99+"
                                    : conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {!currentConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium mb-2">
                      Chọn cuộc trò chuyện
                    </h3>
                    <p>
                      Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
                      chat
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={
                            currentConversation.partnerAvatar ||
                            "/default-avatar.png"
                          }
                          alt={currentConversation.partnerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {getRoleIcon(currentConversation.partnerRole)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {currentConversation.partnerName}
                        </h3>
                        <span
                          className={getRoleBadge(
                            currentConversation.partnerRole
                          )}
                        >
                          {currentConversation.partnerRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    onScroll={handleScroll}
                  >
                    {/* Load More Button */}
                    {hasMoreMessages && (
                      <div className="text-center">
                        <button
                          onClick={handleLoadMoreMessages}
                          disabled={loading}
                          className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50"
                        >
                          {loading ? "Đang tải..." : "Tải tin nhắn cũ hơn"}
                        </button>
                      </div>
                    )}

                    {loadingMessages ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="text-gray-500 mt-2">
                          Đang tải tin nhắn...
                        </p>
                      </div>
                    ) : (
                      messages
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt) - new Date(b.createdAt)
                        )
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              Number(msg.senderId) === Number(user.id)
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                Number(msg.senderId) === Number(user.id)
                                  ? "bg-purple-600 text-white"
                                  : "bg-white border border-gray-200 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs opacity-70">
                                  {formatTime(msg.createdAt)}
                                </p>
                                {getMessageStatus(msg)}
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
