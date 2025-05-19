import React from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="border-b border-base-300 p-4 flex items-center gap-3">
      <div className="relative">        <img
          src={selectedUser?.profilePic || selectedUser?.profilepic || "/avatar.png"}
          alt={selectedUser?.fullName || "User"}
          className="size-10 rounded-full object-cover"
          onError={(e) => {
            console.log("Image load error, falling back to default");
            e.target.src = "/avatar.png";
          }}
        />
        {isOnline && (
          <span
            className="absolute bottom-0 right-0 size-3 bg-green-500 
            rounded-full ring-2 ring-base-100"
          />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{selectedUser?.fullName || "User"}</h3>
        <p className="text-xs text-base-content/70">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
