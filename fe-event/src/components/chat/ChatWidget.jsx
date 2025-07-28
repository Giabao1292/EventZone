import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";

const ChatWidget = () => {
  const { user } = useAuth();
  const {
    connected,
    conversations,
    messages,
    currentConversation,
    unreadCount,
    hasMoreMessages,
    loadingMessages,
    sendMessage,
    selectConversation,
    loadMoreMessages,
    createSupportConversation,
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMoreMessages) {
        loadMoreMessages();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation) return;

    try {
      await sendMessage(currentConversation.partnerId, message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartChat = async (partnerId, partnerName, isAdmin = false) => {
    try {
      const initialMessage = isAdmin
        ? "Xin chào! Tôi cần hỗ trợ từ admin."
        : `Xin chào! Tôi muốn hỏi về sự kiện.`;

      await createSupportConversation(partnerId, initialMessage);

      // Find the conversation and select it
      const conversation = conversations.find((c) => c.partnerId === partnerId);
      if (conversation) {
        selectConversation(conversation);
        setShowConversations(false);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const getMessageStatus = (message) => {
    if (message.read) {
      return <span className="text-blue-500 text-xs">✓✓</span>;
    }
    return <span className="text-gray-400 text-xs">✓</span>;
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-chat-widget
        className={`relative p-4 rounded-full shadow-xl transition-all duration-300 ${
          connected
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-gray-400 text-white"
        }`}
        title={connected ? "Mở chat" : "Đang kết nối..."}
      >
        <MessageCircle className="w-7 h-7" />
        {!connected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-xl shadow-2xl border-2 border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConversations(!showConversations)}
                className="p-2 hover:bg-purple-400 rounded-lg transition-colors"
              >
                {showConversations ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
              <h3 className="font-bold text-lg">
                {showConversations
                  ? "💬 Tin nhắn"
                  : `💬 ${currentConversation?.partnerName || "Chat"}`}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-purple-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {showConversations ? (
              /* Conversations List */
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {!connected && (
                  <div className="p-3 text-center text-sm text-gray-500 bg-yellow-50">
                    Đang kết nối...
                  </div>
                )}

                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="mb-4">
                      <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium mb-2">
                        Chưa có cuộc trò chuyện nào
                      </p>
                      <p className="text-sm">
                        Bắt đầu chat với admin để được hỗ trợ
                      </p>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleStartChat(1, "Admin", true)}
                        className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg"
                      >
                        👑 Chat với Admin
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.partnerId}
                        onClick={() => {
                          selectConversation(conversation);
                          setShowConversations(false);
                        }}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          {conversation.partnerAvatar ? (
                            <img
                              src={conversation.partnerAvatar}
                              alt={conversation.partnerName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {conversation.partnerName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 ml-4 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-semibold text-gray-900 truncate">
                              {conversation.partnerName}
                            </h4>
                            <span className="text-sm text-gray-500 font-medium">
                              {conversation.lastMessageTime &&
                                new Date(
                                  conversation.lastMessageTime
                                ).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-gray-600 truncate font-medium">
                              {Number(conversation.lastMessageSenderId) ===
                              Number(user.id)
                                ? "Bạn: "
                                : ""}
                              {conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                {conversation.unreadCount > 9
                                  ? "9+"
                                  : conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Chat Messages */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0"
                >
                  {hasMoreMessages && (
                    <button
                      onClick={loadMoreMessages}
                      className="w-full p-3 text-sm text-blue-500 hover:bg-blue-50 rounded-lg font-medium"
                    >
                      ⬆️ Tải tin nhắn cũ hơn
                    </button>
                  )}

                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p>Đang tải tin nhắn...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Chưa có tin nhắn nào</p>
                        <p className="text-sm">Bắt đầu cuộc trò chuyện!</p>
                      </div>
                    </div>
                  ) : (
                    messages
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                      )
                      .map((msg) => {
                        const isOwnMessage =
                          Number(msg.senderId) === Number(user.id);

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs px-3 py-2 rounded-lg ${
                                isOwnMessage
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <div
                                className={`flex items-center justify-end mt-1 space-x-1 ${
                                  isOwnMessage
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                <span className="text-xs">
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    "vi-VN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                                {isOwnMessage && getMessageStatus(msg)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Always visible */}
                <div className="flex-shrink-0 p-5 border-t-2 bg-gray-50">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        connected ? "Nhập tin nhắn..." : "Đang kết nối..."
                      }
                      disabled={!connected}
                      className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-base ${
                        connected
                          ? "border-gray-300 focus:border-purple-500"
                          : "border-gray-200 bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !connected}
                      className={`px-6 py-3 text-white rounded-xl transition-all duration-200 shadow-lg ${
                        connected
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        !connected
                          ? "Không thể gửi tin nhắn - Đang kết nối..."
                          : "Gửi tin nhắn"
                      }
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
