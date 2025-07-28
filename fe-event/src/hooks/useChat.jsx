"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { getToken } from "../utils/storage";
import chatService from "../services/chatService";
import useAuth from "./useAuth";

const useChat = () => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const stompClientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const token = getToken();
    if (!token) {
      console.warn("⚠️ No token found, cannot connect to WebSocket");
      return;
    }

    try {
      const socket = new SockJS("http://localhost:8080/ws");
      stompClientRef.current = over(socket);

      stompClientRef.current.connect(
        { Authorization: "Bearer " + token },
        (frame) => {
          console.log("✅ Chat WebSocket Connected:", frame);
          setConnected(true);
          reconnectAttempts.current = 0;

          // Subscribe to personal chat messages
          stompClientRef.current.subscribe("/user/queue/chat", (message) => {
            try {
              const payload = JSON.parse(message.body);
              console.log("💬 New chat message received:", payload);

              // Update conversations list
              fetchConversations();
              setUnreadCount((prev) => prev + 1);

              // Add new message to current conversation if it matches
              setMessages((prev) => {
                const currentConv = currentConversation;
                const isCurrentConversation =
                  currentConv &&
                  ((Number(payload.senderId) ===
                    Number(currentConv.partnerId) &&
                    Number(payload.receiverId) === Number(user?.id)) ||
                    (Number(payload.senderId) === Number(user?.id) &&
                      Number(payload.receiverId) ===
                        Number(currentConv.partnerId)));

                if (!isCurrentConversation) {
                  return prev;
                }

                const hasOptimisticMessage = prev.some(
                  (msg) =>
                    msg.id > 1000000000000 &&
                    msg.content === payload.content &&
                    Number(msg.senderId) === Number(payload.senderId)
                );

                if (hasOptimisticMessage) {
                  const updatedMessages = prev.map((msg) =>
                    msg.id > 1000000000000 &&
                    msg.content === payload.content &&
                    Number(msg.senderId) === Number(payload.senderId)
                      ? payload
                      : msg
                  );
                  // Sort by createdAt to ensure correct order
                  return updatedMessages.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                  );
                } else {
                  const newMessages = [...prev, payload];
                  // Sort by createdAt to ensure correct order (oldest first)
                  return newMessages.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                  );
                }
              });
            } catch (error) {
              console.error("Error parsing chat message:", error);
            }
          });
        },
        (error) => {
          console.error("❌ Chat WebSocket Connection Error:", error);
          setConnected(false);

          // Attempt to reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            console.log(
              `🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 3000 * reconnectAttempts.current); // Exponential backoff
          } else {
            console.error("❌ Max reconnection attempts reached");
          }
        }
      );
    } catch (error) {
      console.error("❌ Error creating WebSocket connection:", error);
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect(() => {
        console.log("🔌 Chat WebSocket Disconnected");
        setConnected(false);
      });
    } else {
      console.warn("⚠️ Chat WebSocket not connected, skip disconnect");
      setConnected(false);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await chatService.getConversations();
      if (response.code === 200) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  const fetchMessages = useCallback(
    async (partnerId, eventId = null, page = 0) => {
      try {
        const response = await chatService.getMessages(
          partnerId,
          eventId,
          page
        );
        if (response.code === 200) {
          const newMessages = response.data.content;
          setHasMoreMessages(!response.data.last);
          setCurrentPage(page);

          if (page === 0) {
            // For page 0, messages are already in DESC order (newest first)
            // We need to reverse them to show oldest first (ASC order)
            const sortedMessages = newMessages.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            setMessages(sortedMessages);
          } else {
            // For pagination, add older messages to the beginning
            setMessages((prev) => {
              const combinedMessages = [...newMessages, ...prev];
              // Sort by createdAt to ensure correct order (oldest first)
              return combinedMessages.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
            });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (receiverId, content, messageType = "TEXT", eventId = null) => {
      try {
        const response = await chatService.sendMessage(
          receiverId,
          content,
          messageType,
          eventId
        );
        if (response.code === 200) {
          // Add optimistic message
          const optimisticMessage = {
            id: Date.now(),
            senderId: Number(user?.id), // Ensure it's a number
            senderName: user?.fullName,
            senderAvatar: user?.profileUrl,
            receiverId: Number(receiverId), // Ensure it's a number
            receiverName: "",
            receiverAvatar: "",
            content: content,
            messageType: messageType,
            eventId: eventId,
            read: false,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, optimisticMessage];
            // Sort by createdAt to ensure correct order (oldest first)
            return newMessages.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          });
          fetchConversations();
          return response.data;
        }
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    []
  );

  const selectConversation = useCallback(async (conversation) => {
    setCurrentConversation(conversation);
    setHasMoreMessages(false);
    setCurrentPage(0);
    setLoadingMessages(true);

    // Fetch messages immediately and set them
    try {
      const response = await chatService.getMessages(
        conversation.partnerId,
        conversation.eventId,
        0
      );
      if (response.code === 200) {
        const newMessages = response.data.content;
        setHasMoreMessages(!response.data.last);

        // Messages from backend are in DESC order (newest first)
        // Sort them to ASC order (oldest first) for display
        const sortedMessages = newMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadMoreMessages = useCallback(() => {
    if (currentConversation && hasMoreMessages) {
      fetchMessages(
        currentConversation.partnerId,
        currentConversation.eventId,
        currentPage + 1
      );
    }
  }, [currentConversation, hasMoreMessages, currentPage, fetchMessages]);

  const createSupportConversation = useCallback(
    async (receiverId, initialMessage) => {
      try {
        const response = await chatService.createSupportConversation(
          receiverId,
          initialMessage
        );
        if (response.code === 200) {
          fetchConversations();
          return response.data;
        }
      } catch (error) {
        console.error("Error creating support conversation:", error);
        throw error;
      }
    },
    [fetchConversations]
  );

  useEffect(() => {
    connect();
    fetchConversations();

    return () => {
      disconnect();
    };
  }, [connect, disconnect, fetchConversations]);

  return {
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
    fetchConversations,
  };
};

export default useChat;
