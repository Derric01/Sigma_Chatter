import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || authUser.profilepic || "/avatar.png"
                      : selectedUser.profilePic || selectedUser.profilepic || "/avatar.png"
                  }
                  onError={(e) => { 
                    console.log("Image load error, falling back to default");
                    e.target.src = "/avatar.png"; 
                  }}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>            <div className="chat-bubble flex flex-col">
              {message.image && (
                <div className="relative">
                  <img
                    src={message.image}
                    alt="Attachment"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Failed to load image:", message.image);
                      e.target.onerror = null;
                      e.target.alt = "Image load failed";
                      // Instead of hiding, show a placeholder with error message
                      e.target.src = "/avatar.png"; // Use a placeholder image
                      // Add error class for styling
                      e.target.classList.add("opacity-50");
                      // Find parent and add error message
                      const parent = e.target.closest('.relative');
                      if (parent) {
                        const errorElement = document.createElement('div');
                        errorElement.className = "absolute inset-0 flex items-center justify-center bg-base-300 bg-opacity-70 text-sm text-center p-2";
                        errorElement.textContent = "Image failed to load";
                        parent.appendChild(errorElement);
                      }
                    }}
                    className="sm:max-w-[200px] max-h-[300px] rounded-md mb-2 object-contain"
                  />
                </div>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
